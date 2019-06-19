//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. The class
//will connect with the firebase firestore in order to retrieve the necessary data. 
import firebase from 'react-native-firebase';

//All methods should be labeled static. There will also be static variable that reference the collections
//in the cloud firestore
export default class FirebaseFunctions {

    //The four collections that will be used by this class (references)
    static database = firebase.firestore();
    static providers = this.database.collection("providers");
    static requesters = this.database.collection("requesters");
    static products = this.database.collection("products");
    static messages = this.database.collection("messages");
    static issues = this.database.collection("issues");

    //This method will return an array containing an all products currently in the market
    static async getAllProducts() {
        const snapshot = await this.products.get();

        //Returns the array which contains all the docs
        const array = snapshot.docs.map((doc) => doc.data());

        //Removes the example from product from the array
        const newArray = array.filter((element) => {
            return element.serviceTitle !== "Example Service";
        });

        //Returns the correct array
        console.log(array);
        console.log(newArray);
        return newArray;
    }

    //This method will return an array of all of the providers
    static async getAllProviders() {
        const snapshot = await this.providers.get();

        //Returns the array which contains all of the docs
        return snapshot.docs.map((doc) => doc.data());
    }

    //This method will return an array of all of the requesters
    static async getAllRequesters() {
        const snapshot = await this.requesters.get();

        //Returns the array which contains all of the docs
        return snapshot.docs.map((doc) => doc.data());
    }

    //This method will return an array of all of the message objects
    static async getAllMessages() {
        const snapshot = await this.messages.get();

        //Returns the array which contains all of the docs
        return snapshot.docs.map((doc) => doc.data());
    }

    //This method will take in an ID of a requester and then retrieve the requester from the firestore
    //database by getting a reference to the doc and then calling it from the database. If the user
    //doesn't exist, then -1 will be returned
    static async getRequesterByID(requesterID) {
        const ref = this.requesters.doc(requesterID + "");
        const doc = await ref.get();

        if (doc.exists) {
            return doc.data();
        } else {
            return -1;
        }

    }

    //This method will take in an ID of a requester and then call the firestore database and get the
    //provider. If the user isn't found, then -1 is returned
    static async getProviderByID(providerID) {
        const ref = this.providers.doc(providerID + "");
        const doc = await ref.get();

        if (doc.exists) {
            return doc.data();
        } else {
            return -1;
        }

    }

    //This method will take in an ID of a service and then call the firestore and retrieve that product
    //object
    static async getServiceByID(serviceID) {

        const ref = this.products.doc(serviceID + "");
        const doc = await ref.get();

        if (doc.exists) {
            return doc.data();
        }
        return -1;

    }

    //This method will take in an ID of a requester and an ID of a provider and return the object
    //containing the conversation between the two
    static async getConversationByID(providerID, requesterID) {

        const ref = this.messages.where("providerID", "==", providerID).where("requesterID", "==", requesterID).limit(1);
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

    }

    //This functions will take in a new requester ID and then will add that requester to the firestore
    //as a new requester with a unique requester ID and a username which will just be their email
    //without the "@"
    static async addRequesterToDatabase(account, email) {

        const batch = this.database.batch();
        const uid = account.user.uid;
        const ref = this.requesters.doc(uid);

        const newRequester = {
            requesterID: uid,
            username: email.substring(0, email.indexOf("@"))
        }

        batch.set(ref, newRequester);
        batch.commit();

        //This is a promise that won't be resolved while offline
        return newRequester;

    }

    //This function will take in a new provider ID and then will add that new provider to the firestore
    //as a new provider with a unique provider ID and a username which will just be their email without
    //the "@". It will also have the companyName and the companyDescription that is passed
    static async addProviderToDatabase(account, email, businessName, businessInfo) {

        const batch = this.database.batch();
        const uid = account.user.uid;
        const ref = this.providers.doc(uid);

        const newProvider = {
            companyName: businessName,
            companyDescription: businessInfo,
            providerID: account.user.uid,
            serviceIDs: [],
            username: email.substring(0, email.indexOf("@"))
        }

        batch.set(ref, newProvider);
        batch.commit();

        return newProvider;

    }

    //This method will take information about a new product and add it to the firestore database. It will
    //first add it to the firestore containing products, then it will add the service IDs to the provider
    //products
    static async addProductToDatabase(serviceTitle, serviceDescription, pricing, imageSource, providerID, companyName) {
        //Creates the product object
        let product = {
            serviceTitle,
            serviceDescription,
            requests: {
                currentRequests: [],
                completedRequests: [],
            },
            pricing,
            imageSource,
            offeredByID: providerID,
            offeredByName: companyName
        };

        //Adds the product to the database of products
        const newProduct = await this.products.add(product);

        //Will deal with the ID of the product by adding it as a field and pushing to the
        //provider's field
        const batch = this.database.batch();
        const serviceID = newProduct.id;
        const productRef = this.products.doc(serviceID);
        batch.update(productRef, { serviceID });
        const providerRef = this.providers.doc(providerID)
        const providerDoc = await providerRef.get();
        const serviceIDsArray = providerDoc.data().serviceIDs;
        serviceIDsArray.push(serviceID);
        batch.update(providerRef, { serviceIDs: serviceIDsArray });
        batch.commit();
        return;
    }

    //Sends a message by adding that conversation to the database. If the conversation is a new one,
    //then it will create a new messages object between the two communicators
    static async sendMessage(providerID, requesterID, message, isNewConversation) {
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
            FirebaseFunctions.getProviderByID(providerID).then((provider) => {
                FirebaseFunctions.getRequesterByID(requesterID).then((requester) => {
                    this.messages.add({
                        conversationMessages,
                        providerID,
                        requesterID,
                        requesterName: requester.username,
                        providerName: provider.companyName
                    })
                })
            })
        } else {
            const ref = this.messages.where("providerID", "==", providerID).where("requesterID", "==", requesterID);
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
            const batch = this.database.batch();
            batch.update(doc.ref, {
                conversationMessages: oldConversationMessages
            });

            batch.commit();

        }
    }

    //Returns an array of all the conversation that this user has had, depending on if they are a 
    //requseter or a provider
    static async getAllUserConversations(userID, isRequester) {
        let allUserConversations = [];
        if (isRequester === true) {
            const ref = this.messages.where("requesterID", "==", userID);
            const query = await ref.get();
            const docs = query.docs;
            allUserConversations = docs.map((doc) => (doc.data()));
        } else {
            const ref = this.messages.where("providerID", "==", userID);
            const query = await ref.get();
            const docs = query.docs;
            allUserConversations = docs.map((doc) => (doc.data()));
        }

        return allUserConversations;

    }

    //This method will update the information for a provider by taking in the new company name
    //and new company info and updating those fields in the firestore
    static async updateProviderInfo(providerID, newBusinessName, newBusinessInfo) {

        const batch = this.database.batch();
        const ref = this.providers.doc(providerID);
        batch.update(ref, {
            companyName: newBusinessName,
            companyDescription: newBusinessInfo
        });

        //Goes through and edits all of the products that belong to this business & updated the
        //field that connects them to the correct provider to the new businessName
        const query = this.products.where("offeredByID", "==", providerID);
        const result = await query.get();
        result.docs.forEach((doc) => {
            const docRef = doc.ref;
            batch.update(docRef, {
                offeredByName: newBusinessName
            });
        });

        batch.commit();

    }

    //This method will update the information for a specific product by taking in all of the new
    //product information and updating those fields in firestore
    static async updateServiceInfo(productID, serviceTitle, serviceDescription, pricing, imageSource) {

        const batch = this.database.batch();
        const ref = this.products.doc(productID);
        batch.update(ref, {
            serviceTitle,
            serviceDescription,
            pricing,
            imageSource
        });

        batch.commit();

    }

    //This method will take in a product ID and a requester ID and then delete that requester's request
    //from the array of the product's current requests
    static async deleteRequest(productID, requesterID) {

        const batch = this.database.batch();
        const ref = this.products.doc(productID);
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

        batch.commit();

    }

    //This method will take in a product ID and a requester ID and then complete the request by removing
    //it from the array of current requests and adding it to the array of completed requests
    static async completeRequest(productID, requesterID) {

        const batch = this.database.batch();
        const ref = this.products.doc(productID);
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

        batch.commit();
        FirebaseFunctions.deleteRequest(productID, requesterID)

    }

    //This method will take in a product ID and a requester ID and add the request to the array of current
    //requests corresponding with the product
    static async requestService(serviceID, requester) {

        const batch = this.database.batch();
        const ref = this.products.doc(serviceID);
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

        batch.commit();

    }

    //This method will take in a username of a user, the user's UID, and a string containing the issue.
    //Then it will add the issue to be viewed in the database (in the future, should send an email to 
    //the email of the company)
    static async reportIssue(user, issue) {

        //tests whether or not the user is a requester or a provider and adds a "r-" or "p-" before their
        //ID respectivly
        const userID = (user.requesterID ? ("r-" + user.requesterID) : ("p-" + user));

        this.issues.add({
            issue,
            userID
        });

    }

}

