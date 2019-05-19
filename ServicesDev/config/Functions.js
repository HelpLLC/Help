//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. The class
//will connect with the firebase firestore in order to retrieve the necessary data. 
import firebase from 'react-native-firebase';

//All methods should be labeled static. There will also be static variable that reference the collections
//in the cloud firestore
export default class Functions {

    //The four collections that will be used by this class
    static providersCollection = firebase.firestore().collection("providers");
    static requestersCollection = firebase.firestore().collection("requesters");
    static productsCollection = firebase.firestore().collection("products");
    static messagesCollection = firebase.firestore().collection("messagesCollection");

    //This method will take in an ID of a requester and return the index of the requester in the array
    //of requesters by searching through the array until it finds one that matches the provided ID
    static getRequesterIndexByID(requesterID, allRequesters) {

        const thisRequesterIndex = allRequesters.findIndex((requester) => {
            return requester.requesterID === requesterID;
        });

        return thisRequesterIndex;

    }

    //This method will take in an ID of a requester and then call the method to get the index and then
    //return the actual requester
    static getRequesterByID(requesterID, allRequesters) {

        const thisRequesterIndex = Functions.getRequesterIndexByID(requesterID, allRequesters);
        console.log(requesterID);
        console.log(allRequesters);
        console.log(thisRequesterIndex);
        return allRequesters[thisRequesterIndex];

    }

    //This method will take in an ID of a provider and return the index of the provider in the array
    //of providers by searching through the array until it finds one that matches the provided ID
    static getProviderIndexByID(providerID, allProviders) {

        const thisProviderIndex = allProviders.findIndex((provider) => {
            return provider.providerID === providerID;
        });

        return thisProviderIndex;

    }

    //This method will take in an ID of a requester and then call the method to get the index and then
    //return the actual requester
    static getProviderByID(providerID, allProviders) {

        const thisProviderIndex = Functions.getProviderIndexByID(providerID, allProviders);
        return allProviders[thisProviderIndex];

    }

    //This method will take in an ID of a service and return the index of the service in the array
    //of services by searching through the array until it finds one that matches the provided ID
    static getServiceIndexByID(serviceID, allServices) {

        const thisServiceIndex = allServices.findIndex((service) => {
            return service.serviceID === serviceID;
        });

        return thisServiceIndex;

    }


    //This method will take in an ID of a service and then call the method to get the index and then
    //return the actual service
    static getServiceByID(serviceID, allServices) {

        const thisServiceIndex = Functions.getServiceIndexByID(serviceID, allServices);
        return allServices[thisServiceIndex];

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
    //go through all products and only return ones that belong to this provider
    static getProviderProducts(provider, allProducts) {

        const providerProductIDs = provider.serviceIDs;
        const providerProducts = [];

        providerProductIDs.forEach((id) => {
            //Finds the index of the product that is associated with the user and adds it to the array
            //of this user's products
            let providerProduct = allProducts.find((product) => {
                return product.serviceID === id;
            });

            providerProducts.push(providerProduct);
        });

        return providerProducts;

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

