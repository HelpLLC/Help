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

            this.database.products.add({

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

}

