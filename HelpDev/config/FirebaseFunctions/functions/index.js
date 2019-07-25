//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. All these 
//methods are stored in cloud functions and are deployed from here. They are called from the firebase 
//functions .js file located in config/FirebaseFunctions.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//These are all the collections and reference that'll be used in
//the cloud functions
const database = admin.firestore();
const storage = admin.storage().bucket('gs://help-d194d.appspot.com');
const providers = database.collection("providers");
const requesters = database.collection("requesters");
const products = database.collection("products");
const messages = database.collection("messages");
const issues = database.collection("issues");

/*
These are abstracted functions that are used by multiple cloud functions
*/
const uploadImage = async (reference, response) => {

    //Creates the reference & uploads the image (async)
    await storage.upload(response, {
        destination: reference
    });

    return 0;

}

const getRequesterByID = async (requesterID) => {

    const ref = requesters.doc(requesterID + "");
    const doc = await ref.get();

    if (doc.exists) {
        return doc.data();
    } else {
        return -1;
    }

}

const getProviderByID = async (providerID) => {

    const ref = providers.doc(providerID + "");
    const doc = await ref.get();

    if (doc.exists) {
        return doc.data();
    } else {
        return -1;
    }

}

const deleteRequest = async (productID, requesterID) => {

    const batch = database.batch();
    const ref = products.doc(productID);
    const doc = await ref.get();

    //Creates a copy of the array of requests minus the request corresponding to this requester ID
    const oldRequests = doc.data().requests.currentRequests;
    const indexOfRequest = oldRequests.findIndex((request) => {
        return request.requesterID === requesterID;
    });

    oldRequests.splice(indexOfRequest, 1);
    batch.update(ref, {
        requests: {
            currentRequests: oldRequests,
            completedRequests: doc.data().requests.completedRequests
        }
    });

    await batch.commit();
    return 0;

}

/*
These are the callable cloud functions
*/

//This method will return an array containing an all products currently in the market
exports.getAllProducts = functions.https.onCall(async (input, context) => {

    const snapshot = await products.get();

    //Returns the array which contains all the docs
    const array = snapshot.docs.map((doc) => doc.data());

    //Removes the example from product from the array
    const newArray = array.filter((element) => {
        return element.serviceTitle !== "Example Service";
    });

    //Returns the correct array
    return newArray;

});

//This method will return an array of all of the providers
exports.getAllProviders = functions.https.onCall(async (input, context) => {

    const snapshot = await providers.get();

    //Returns the array which contains all of the docs
    return snapshot.docs.map((doc) => doc.data());

});

//This method will return an array of all of the requesters
exports.getAllRequesters = functions.https.onCall(async (input, context) => {

    const snapshot = await requesters.get();

    //Returns the array which contains all of the docs
    return snapshot.docs.map((doc) => doc.data());

});

//This method will return an array of all of the message objects
exports.getAllMessages = functions.https.onCall(async (input, context) => {

    const snapshot = await messages.get();

    //Returns the array which contains all of the docs
    return snapshot.docs.map((doc) => doc.data());

});

//This method will take in an ID of a requester and then retrieve the requester from the firestore
//database by getting a reference to the doc and then calling it from the database. If the user
//doesn't exist, then -1 will be returned
exports.getRequesterByID = functions.https.onCall(async (input, context) => {

    const { requesterID } = input;
    return await getRequesterByID(requesterID);

});

//This method will take in an ID of a requester and then call the firestore database and get the
//provider. If the user isn't found, then -1 is returned
exports.getProviderByID = functions.https.onCall(async (input, context) => {

    const { providerID } = input;
    return await getProviderByID(providerID);

});

//This method will take in an ID of a service and then call the firestore and retrieve that product
//object
exports.getServiceByID = functions.https.onCall(async (input, context) => {

    const { serviceID } = input;

    const ref = products.doc(serviceID + "");
    const doc = await ref.get();

    if (doc.exists) {
        return doc.data();
    }
    return -1;

});

//This method will take in an ID of a requester and an ID of a provider and return the object
//containing the conversation between the two
exports.getConversationByID = functions.https.onCall(async (input, context) => {

    const { providerID, requesterID } = input;

    const ref = messages.where("providerID", "==", providerID).where("requesterID", "==", requesterID).limit(1);
    const query = await ref.get();

    if (query.docs.length > 0) {
        const doc = query.docs[0];
        const docData = doc.data();
        //Sorts the conversation messages by time
        const conversationMessages = docData.conversationMessages.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });
        return {
            conversationMessages,
            providerID,
            requesterID
        }
    }
    return {
        conversationMessages: [],
        providerID,
        requesterID
    }

});

//This functions will take in a new requester ID and then will add that requester to the firestore
//as a new requester with a unique requester ID and a username which will just be their email
//without the "@"
exports.addRequesterToDatabase = functions.https.onCall(async (input, context) => {

    const { account, email } = input;

    const batch = database.batch();
    const uid = account.user.uid;
    const ref = requesters.doc(uid);

    const newRequester = {
        requesterID: uid,
        username: email.substring(0, email.indexOf("@")),
        blockedUsers: ["Example Business"]
    }

    batch.set(ref, newRequester);
    await batch.commit();

    //This is a promise that won't be resolved while offline
    return newRequester;

});

//This function will take in a new provider ID and then will add that new provider to the firestore
//as a new provider with a unique provider ID and a username which will just be their email without
//the "@". It will also have the companyName and the companyDescription that is passed
exports.addProviderToDatabase = functions.https.onCall(async (input, context) => {

    const { account, email, businessName, businessInfo } = input;

    const batch = database.batch();
    const uid = account.user.uid;
    const ref = providers.doc(uid);

    const newProvider = {
        companyName: businessName,
        companyDescription: businessInfo,
        providerID: account.user.uid,
        serviceIDs: [],
        username: email.substring(0, email.indexOf("@"))
    }

    batch.set(ref, newProvider);
    await batch.commit();

    return newProvider;

});

//This method will take in an image respose & the desired reference in which to call the image and upload it 
//to the firebase storage. This async function will take some time since image are 5-10 MB. Will be
//used to upload product images
exports.uploadImage = functions.https.onCall(async (input, context) => {

    const { reference, response } = input;

    return await uploadImage(reference, response);

});

//This method will take in a reference to a picture (the same as the product ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getImageByID = functions.https.onCall(async (input, context) => {

    const { ID } = input;

    //Creates the reference
    const uri = await storage.ref(ID).getDownloadURL();
    return { uri };

});

//This method will take information about a new product and add it to the firestore database. It will
//first add it to the firestore containing products, then it will add the service IDs to the provider
//products
exports.addProductToDatabase = functions.https.onCall(async (input, context) => {

    const { serviceTitle, serviceDescription, pricing, response, providerID, companyName } = input;
    //Creates the product object
    let product = {
        serviceTitle,
        serviceDescription,
        requests: {
            currentRequests: [],
            completedRequests: [],
        },
        pricing,
        offeredByID: providerID,
        offeredByName: companyName
    };

    //Adds the product to the database of products
    const newProduct = await products.add(product);

    //Uploads the image to the database (longest process)
    await uploadImage(newProduct.id, response);

    //Will deal with the ID of the product by adding it as a field and pushing to the
    //provider's field
    const batch = database.batch();
    const serviceID = newProduct.id;
    const productRef = products.doc(serviceID);
    batch.update(productRef, { serviceID });
    const providerRef = providers.doc(providerID);
    const providerDoc = await providerRef.get();
    const serviceIDsArray = providerDoc.data().serviceIDs;
    serviceIDsArray.push(serviceID);
    batch.update(providerRef, { serviceIDs: serviceIDsArray });
    await batch.commit();
    return 0;

});

//Sends a message by adding that conversation to the database. If the conversation is a new one,
//then it will create a new messages object between the two communicators
exports.sendMessage = functions.https.onCall(async (input, context) => {

    const { providerID, requesterID, message, isNewConversation } = input;

    if (isNewConversation === true) {
        const conversationMessages = []
        const messageWithCorrectDate = {
            _id: message[0]._id,
            createdAt: new Date(message[0].createdAt).getTime(),
            text: message[0].text,
            user: message[0].user
        }
        conversationMessages.push(messageWithCorrectDate);
        //Retrieves the names of the requester and the provider so that can be added to the database
        //as well
        const provider = await getProviderByID(providerID);
        const requester = await getRequesterByID(requesterID);
        await messages.add({
            conversationMessages,
            providerID,
            requesterID,
            requesterName: requester.username,
            providerName: provider.companyName
        });
    } else {
        const ref = messages.where("providerID", "==", providerID).where("requesterID", "==", requesterID);
        const query = await ref.get();
        const doc = query.docs[0];
        const docData = doc.data();
        const oldConversationMessages = docData.conversationMessages;
        const messageWithCorrectDate = {
            _id: message[0]._id,
            createdAt: new Date(message[0].createdAt).getTime(),
            text: message[0].text,
            user: message[0].user
        }
        oldConversationMessages.push(messageWithCorrectDate);
        const batch = database.batch();
        batch.update(doc.ref, {
            conversationMessages: oldConversationMessages
        });

        await batch.commit();

    }
    return 0;
});

//Returns an array of all the conversation that this user has had, depending on if they are a 
//requseter or a provider
exports.getAllUserConversations = functions.https.onCall(async (input, context) => {

    const { userID, isRequester } = input;

    let allUserConversations = [];
    if (isRequester === true) {
        const ref = messages.where("requesterID", "==", userID);
        const query = await ref.get();
        const docs = query.docs;
        allUserConversations = docs.map((doc) => (doc.data()));
    } else {
        const ref = messages.where("providerID", "==", userID);
        const query = await ref.get();
        const docs = query.docs;
        allUserConversations = docs.map((doc) => (doc.data()));
    }

    return allUserConversations;

});

//This method will update the information for a provider by taking in the new company name
//and new company info and updating those fields in the firestore
exports.updateProviderInfo = functions.https.onCall(async (input, context) => {

    const { providerID, newBusinessName, newBusinessInfo } = input;

    const batch = database.batch();
    const ref = providers.doc(providerID);
    batch.update(ref, {
        companyName: newBusinessName,
        companyDescription: newBusinessInfo
    });

    //Goes through and edits all of the products that belong to this business & updated the
    //field that connects them to the correct provider to the new businessName
    const query = products.where("offeredByID", "==", providerID);
    const result = await query.get();
    result.docs.forEach((doc) => {
        const docRef = doc.ref;
        batch.update(docRef, {
            offeredByName: newBusinessName
        });
    });

    await batch.commit();
    return 0;

});

//This method will update the information for a specific product by taking in all of the new
//product information and updating those fields in firestore
exports.updateServiceInfo = functions.https.onCall(async (input, context) => {

    const { productID, serviceTitle, serviceDescription, pricing, response } = input;

    const batch = database.batch();
    const ref = products.doc(productID);
    batch.update(ref, {
        serviceTitle,
        serviceDescription,
        pricing
    });

    //Removes the old image and then uploads the new one
    const imageRef = storage.ref(productID);
    await imageRef.delete();
    await uploadImage(productID, response);
    await batch.commit();
    return 0;

});

//This method will take in a product ID and a requester ID and then delete that requester's request
//from the array of the product's current requests
exports.deleteRequest = functions.https.onCall(async (input, context) => {

    const { productID, requesterID } = input;

    return await deleteRequest(productID, requesterID);

});

//This method will take in a product ID and a requester ID and then complete the request by removing
//it from the array of current requests and adding it to the array of completed requests
exports.completeRequest = functions.https.onCall(async (input, context) => {

    const { productID, requesterID } = input;

    const batch = database.batch();
    const ref = products.doc(productID);
    const doc = await ref.get();
    const product = doc.data();

    const requestToComplete = product.requests.currentRequests.find((eachRequest) => {
        return eachRequest.requesterID === requesterID;
    });

    //Gets the old array of completed requests and adds the new completed request to that array,
    //then sets that new array to it
    const oldCompletedRequests = product.requests.completedRequests;
    const newCompletedRequest = {
        dateCompleted: new Date().toLocaleDateString("en-US"),
        dateRequested: requestToComplete.dateRequested,
        requesterID,
        requesterName: requestToComplete.requesterName
    }
    oldCompletedRequests.push(newCompletedRequest);

    batch.update(ref, {
        requests: {
            completedRequests: oldCompletedRequests,
            currentRequests: product.requests.currentRequests
        }
    });

    await batch.commit();
    await deleteRequest(productID, requesterID);
    return 0;

});

//This method will take in a product ID and a requester ID and add the request to the array of current
//requests corresponding with the product
exports.requestService = functions.https.onCall(async (input, context) => {

    const { serviceID, requester } = input;

    const batch = database.batch();
    const ref = products.doc(serviceID);
    const doc = await ref.get();

    const oldArray = doc.data().requests.currentRequests;
    oldArray.push({
        dateRequested: new Date().toLocaleDateString("en-US"),
        requesterID: requester.requesterID,
        requesterName: requester.username
    });

    batch.update(ref, {
        requests: {
            completedRequests: doc.data().requests.completedRequests,
            currentRequests: oldArray
        }
    });

    await batch.commit();
    return 0;

});


//This method will take in a username of a user, the user's UID, and a string containing the issue.
//Then it will add the issue to be viewed in the database (in the future, should send an email to 
//the email of the company)
exports.reportIssue = functions.https.onCall(async (input, context) => {

    const { user, issue } = input;
    //tests whether or not the user is a requester or a provider and adds a "r-" or "p-" before their
    //ID respectivly
    const userID = (user.requesterID ? ("r-" + user.requesterID) : ("p-" + user));

    await issues.add({
        issue,
        userID
    });
    return 0;

});

//This method will take in a request and a provider and block that provider from being able to sell
//to the requester or get in contact with them. It does this by addind the provider's ID to the array
//of blocked users that belongs to the requesters
exports.blockCompany = functions.https.onCall(async (input, context) => {

    const { requester, provider } = input;

    //Fetches the old array of blocked companies by this requester and appends this provider to
    //that list
    const arrayOfBlockedCompanies = requester.blockedUsers;
    arrayOfBlockedCompanies.push(provider.providerID);

    //Updates this array in the firebase firestore
    const batch = database.batch();
    const ref = requesters.doc(requester.requesterID);
    batch.update(ref, {
        blockedUsers: arrayOfBlockedCompanies
    });

    //commits the batch
    await batch.commit();
    return 0;

});

//This method will take in an error message and log it into firebase firestore where errors
//are stored
exports.logIssue = functions.https.onCall((input, context) => {

    const { error } = input;
    //Adds it to the report issue section
    issues.add({
        userID: 'App Error',
        errorName: error.name,
        errorMessage: error.message
    });

});
