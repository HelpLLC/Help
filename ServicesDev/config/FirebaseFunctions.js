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
        return snapshot.docs.map((doc) => doc.data());
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
    static async addProductToDatabase(serviceTitle, serviceDescription, pricing, imageSource, providerID) {
        let product = "";
        //First will retrieve the provider information in order to know the name of the company
        FirebaseFunctions.getProviderByID(providerID).then((provider) => {

            this.products.add({

                serviceTitle,
                serviceDescription,
                requests: {
                    currentRequests: [],
                    completedRequests: [],
                },
                pricing,
                imageSource,
                offeredByID: providerID,
                offeredByName: provider.companyName

            }).then(async (newProduct) => {
                //Will deal with the ID of the product by adding it as a field and pushing to the
                //provider's field
                const batch = this.database.batch();
                const serviceID = newProduct.id;
                batch.update(newProduct, { serviceID });

                const providerRef = this.providers.doc(providerID)
                const providerDoc = await providerRef.get();
                const serviceIDsArray = providerDoc.data().serviceIDs;
                serviceIDsArray.push(serviceID);
                batch.update(providerRef, { serviceIDs: serviceIDsArray });

                batch.commit();
                product = newProduct;
            });
        });
        return product;
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

