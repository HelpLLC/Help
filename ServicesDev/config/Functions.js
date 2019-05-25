//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. The class
//will connect with the firebase firestore in order to retrieve the necessary data. 
import firebase from 'react-native-firebase';

//All methods should be labeled static. There will also be static variable that reference the collections
//in the cloud firestore
export default class Functions {

    //The four collections that will be used by this class
    static database = firebase.firestore();

    //Tests if there is a user currently logged in on this device
    static isUserLoggedIn() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                return true;
            } else {
                return false;
            }
        });
    }

    //Returns the provider/requester that is currently logged in
    static async getUserLoggedIn() {
        firebase.auth().onAuthStateChanged((user) => {
            this.getRequesterByID(user.uid).then((requester) => {
                if (requester === -1) {
                    this.getProviderByID(user.uid).then((provider) => {
                        return provider;
                    })
                } else {
                    return requester;
                }
            })
        })
    }

    //This method will take in an ID of a requester and return the index of the requester in the array
    //of requesters by searching through the array until it finds one that matches the provided ID
    static getRequesterIndexByID(requesterID, allRequesters) {

        const thisRequesterIndex = allRequesters.findIndex((requester) => {
            return requester.requesterID === requesterID;
        });

        return thisRequesterIndex;

    }

    //This method will take in an ID of a requester and then retrieve the requester from the firestore
    //database by getting a reference to the doc and then calling it from the database. If the user
    //doesn't exist, then -1 will be returned
    static async getRequesterByID(requesterID) {
        const ref = this.database.collection("requesters").doc(requesterID + "");
        const doc = await ref.get();

        if (doc.exists) {
            return doc.data();
        } else {
            return -1;
        }

    }

    //This method will take in an ID of a provider and return the index of the provider in the array
    //of providers by searching through the array until it finds one that matches the provided ID
    static getProviderIndexByID(providerID, allProviders) {

        const thisProviderIndex = allProviders.findIndex((provider) => {
            return provider.providerID === providerID;
        });

        return thisProviderIndex;

    }

    //This method will take in an ID of a requester and then call the firestore database and get the
    //provider. If the user isn't found, then -1 is returned
    static async getProviderByID(providerID) {
        const ref = this.database.collection("providers").doc(providerID + "");
        const doc = await ref.get();

        if (doc.exists) {
            return doc.data();
        } else {
            return -1;
        }

    }

    //This method will take in an ID of a service and return the index of the service in the array
    //of services by searching through the array until it finds one that matches the provided ID
    static getServiceIndexByID(serviceID, allServices) {

        const thisServiceIndex = allServices.findIndex((service) => {
            return service.serviceID === serviceID;
        });

        return thisServiceIndex;

    }

    //This method will take in an ID of a service and then call the firestore and retrieve that product
    //object
    static async getServiceByID(serviceID) {

        const ref = this.database.collection("products").doc(serviceID + "");
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
        const ref = this.database.collection("requesters").doc(uid);

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
        const ref = this.database.collection("providers").doc(uid);

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
        Functions.getProviderByID(providerID).then((provider) => {

            this.database.collection("products").add({

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
                
                const providerRef = this.database.collection("providers").doc(providerID)
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

    //Checks if the company name is taken by another user or not
    static async isCompanyNameTaken(businessName) {

        //Queries the providers to see if a provider exists
        const ref = this.database.collection("providers").where("companyName", "==", businessName);
        const snapshot = await ref.get();

        //If the array contains anything, then the name is taken and true will be returned
        if (snapshot.docs.length === 0) {
            return false;
        } else {
            return true;
        }

    }

    //This method will take in an ID of a provider and and ID of a requester and return the index of the 
    //conversation within the array of all conversations
    static getConversationIndexByID(providerID, requesterID, allMessages) {

        const thisConversationIndex = allMessages.findIndex((conversation) => {
            return conversation.providerID === providerID && conversation.requesterID === requesterID;
        });

        return thisConversationIndex;

    }

    //This method will take an ID of a provider and a requester and return the message object that is 
    //associated with it. It will do this by calling the method to get the index and then return that
    //value from the array of messages objects
    static getConversationByID(providerID, requesterID, allMessages) {

        const thisConversationIndex = Functions.getConversationIndexByID(providerID, requesterID, allMessages);
        return allMessages[thisConversationIndex];

    }

    //This method will return an array filled with requesters that requested a certain product. It will
    //take in a service and all the requesters and then return only the ones who's ID is present in
    //this product's requests
    static getServiceRequesters(service, allRequesters) {

        let requestersOfThisProduct = [];
        service.requests.currentRequests.forEach((request) => {
            let requesterID = request.requesterID;
            let requester = allRequesters.find((requester) => {
                return requester.requesterID === requesterID;
            });
            requestersOfThisProduct.push(requester);
        });

        return requestersOfThisProduct;

    }

    //This method will return an array of products that is offered by a specifc provider. It will
    //query through the products and then return only the ones that belong to this provider.
    static async getProviderProducts(provider) {

        //Fetches the service IDs that belong to this provider. If they are empty, an empty array will
        //be returned
        const serviceIDs = provider.serviceIDs;
        if (serviceIDs.length === 0) {
            return [];
        }
        //Initializes the array that will be returned
        let providerProducts = [];

        //Queries through the data
        await serviceIDs.forEach(async (id) => {
            const ref = this.database.collection("products").doc(id);
            const doc = await ref.get();
            providerProducts.push(doc.data());
        });
        return providerProducts;

    }

    //This method will return an array containing an all products currently in the market
    static async getAllProducts() {
        const snapshot = await this.database.collection("products").get();

        //Returns the array which contains all the docs
        return snapshot.docs.map((doc) => doc.data());
    }

    //This method will take in a provider ID and then return all of the associated chats that include
    //that provider. If the provider doesn't have any current existing chats with any requesters, then
    //the returned array of message objects will be empty
    static getProviderMessages(providerID, allMessages) {

        //Instantiates the array that will be returned
        const providerMessages = [];

        //Searches through all of the messages until it finds a message object that includes this
        //providerID and then pushes it to the array of providerMessages
        allMessages.forEach((messageObject) => {

            if (messageObject.providerID === providerID) {
                providerMessages.push(messageObject);
            }

        });

        //Returns the final array
        return providerMessages;

    }

    //This method will take in a requester ID and then return all of the associated chats that include
    //that requester. If the requester doesn't have any current existing chats with any providers, then
    //the returned array of message objects will be empty
    static getRequesterMessages(requesterID, allMessages) {

        //Instantiates the array that will be returned
        const requesterMessages = [];

        //Searches through all of the messages until it finds a message object that includes this
        //providerID and then pushes it to the array of providerMessages
        allMessages.forEach((messageObject) => {

            if (messageObject.requesterID === requesterID) {
                requesterMessages.push(messageObject);
            }

        });

        //Returns the final array
        return requesterMessages;

    }

    //This method will return true if the service has already been requested by this requester
    static isServiceAlreadyRequested(service, requesterID) {

        //If the value is -1, this means that this requester doesn't have a current request on this service
        const indexOfRequest = service.requests.currentRequests.findIndex((request) => {
            return request.requesterID === requesterID;
        });

        return (indexOfRequest === -1 ? false : true);

    }

    //This method will return true if this conversation between the two people is a new conversation
    //and there are no previous communication between them
    static isNewConversation(providerID, requesterID, allMessages) {

        const doesConversationExist = Functions.getConversationIndexByID(providerID, requesterID, allMessages);

        //If the conversation isn't found, then that means it is a new convo, and it returns true
        //If it does find it, then it is existing, and the method returns false
        return (doesConversationExist === -1 ? true : false);

    }

    //This method will take in a messages object and will return the most recent message sent message in
    //that conversation. NOTE: This doesn't return the message object, but the actual string text that
    //was sent by the user
    static getMostRecentText(messagesObject) {

        //Will fetch the conversation history
        let conversationMessages = messagesObject.conversationMessages;

        //Will sort the array of messages by date
        conversationMessages = conversationMessages.sort((a, b) => {
            d1 = new Date(a.createdAt);
            d2 = new Date(b.createdAt);
            return d2.getTime() - d1.getTime();
        });

        //Will return the most recent text in the chat (the literal string)
        return conversationMessages[0].text;

    }
}

