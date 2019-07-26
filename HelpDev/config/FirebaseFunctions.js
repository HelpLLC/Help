//This class only serves as a reference to the cloud functions class
import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
//Descriptions for all methods located in the index.js file in the 
//Firebase Functions directoy (not file)
export default class FirebaseFunctions {

    //The collections & references that will be used by this class
    static functions = firebase.functions();
    
    static database = firebase.firestore();
    static storage = firebase.storage();
    static providers = this.database.collection("providers");
    static requesters = this.database.collection("requesters");
    static products = this.database.collection("products");
    static messages = this.database.collection("messages");
    static issues = this.database.collection("issues");

    //This method will return an array containing an all products currently in the market
    static async getAllProducts() {

        return await this.functions.httpsCallable("getAllProducts")();

    }

    //This method will return an array of all of the providers
    static async getAllProviders() {

        return await this.functions.httpsCallable("getAllProviders")();

    }

    //This method will return an array of all of the requesters
    static async getAllRequesters() {
        
        return await this.functions.httpsCallable("getAllRequesters")();

    }

    //This method will return an array of all of the message objects
    static async getAllMessages() {
        
        return await this.functions.httpsCallable("getAllMessages")();

    }

    //This method will take in an ID of a requester and then retrieve the requester from the firestore
    //database by getting a reference to the doc and then calling it from the database. If the user
    //doesn't exist, then -1 will be returned
    static async getRequesterByID(requesterID) {

        return await this.functions.httpsCallable("getRequesterByID")({
            requesterID
        });

    }

    //This method will take in an ID of a requester and then call the firestore database and get the
    //provider. If the user isn't found, then -1 is returned
    static async getProviderByID(providerID) {
        
        return await this.functions.httpsCallable("getProviderByID")({
            providerID
        });

    }

    //This method will take in an ID of a service and then call the firestore and retrieve that product
    //object
    static async getServiceByID(serviceID) {

        return await this.functions.httpsCallable("getServiceByID")({
            serviceID
        });

    }

    //This method will take in an ID of a requester and an ID of a provider and return the object
    //containing the conversation between the two
    static async getConversationByID(providerID, requesterID) {

        return await this.functions.httpsCallable("getConversationByID")({
            providerID,
            requesterID
        });

    }

    //This functions will take in a new requester ID and then will add that requester to the firestore
    //as a new requester with a unique requester ID and a username which will just be their email
    //without the "@"
    static async addRequesterToDatabase(account, email) {

        return await this.functions.httpsCallable("addRequesterToDatabase")({
            account,
            email
        });

    }

    //This function will take in a new provider ID and then will add that new provider to the firestore
    //as a new provider with a unique provider ID and a username which will just be their email without
    //the "@". It will also have the companyName and the companyDescription that is passed
    static async addProviderToDatabase(account, email, businessName, businessInfo) {

        return await this.functions.httpsCallable("addProviderToDatabase")({
            account,
            email,
            businessName, 
            businessInfo
        });

    }

    //This method will take in an image respose & the desired reference in which to call the image and upload it 
    //to the firebase storage. This async function will take some time since image are 5-10 MB. Will be
    //used to upload product images
    static async uploadImage(reference, response) {

        return await this.functions.httpsCallable("uploadImage")({
            reference,
            response
        });

    }

    //This method will take in a reference to a picture (the same as the product ID it is fetching)
    //and return the download URL for the image which is used as an image source
    static async getImageByID(ID) {

        return await this.functions.httpsCallable("getImageByID")({
            ID
        });

    }

    //This method will take information about a new product and add it to the firestore database. It will
    //first add it to the firestore containing products, then it will add the service IDs to the provider
    //products
    static async addProductToDatabase(serviceTitle, serviceDescription, pricing, response, providerID, companyName) {
        
        return await this.functions.httpsCallable("addProductToDatabase")({
            serviceTitle,
            serviceDescription,
            pricing,
            response,
            providerID,
            companyName
        });

    }

    //Sends a message by adding that conversation to the database. If the conversation is a new one,
    //then it will create a new messages object between the two communicators
    static async sendMessage(providerID, requesterID, message, isNewConversation) {
        
        return await this.functions.httpsCallable("sendMessage")({
            providerID,
            requesterID,
            message,
            isNewConversation
        });

    }

    //Returns an array of all the conversation that this user has had, depending on if they are a 
    //requseter or a provider
    static async getAllUserConversations(userID, isRequester) {
        
        return await this.functions.httpsCallable("getAllUserConversations")({
            userID,
            isRequester
        });

    }

    //This method will update the information for a provider by taking in the new company name
    //and new company info and updating those fields in the firestore
    static async updateProviderInfo(providerID, newBusinessName, newBusinessInfo) {

        return await this.functions.httpsCallable("updateProviderInfo")({
            providerID,
            newBusinessName,
            newBusinessInfo
        });

    }

    //This method will update the information for a specific product by taking in all of the new
    //product information and updating those fields in firestore
    static async updateServiceInfo(productID, serviceTitle, serviceDescription, pricing, response) {

        return await this.functions.httpsCallable("updateServiceInfo")({
            productID,
            serviceTitle,
            serviceDescription,
            pricing,
            response
        });

    }

    //This method will take in a product ID and a requester ID and then delete that requester's request
    //from the array of the product's current requests
    static async deleteRequest(productID, requesterID) {

        return await this.functions.httpsCallable("deleteRequest")({
            productID,
            requesterID
        });

    }

    //This method will take in a product ID and a requester ID and then complete the request by removing
    //it from the array of current requests and adding it to the array of completed requests
    static async completeRequest(productID, requesterID) {

        return await this.functions.httpsCallable("completeRequest")({
            productID,
            requesterID
        });

    }

    //This method will take in a product ID and a requester ID and add the request to the array of current
    //requests corresponding with the product
    static async requestService(serviceID, requester) {

        return await this.functions.httpsCallable("requestService")({
            serviceID,
            requester
        });

    }

    
    static async reportIssue(user, issue) {
        
        return await this.functions.httpsCallable("reportIssue")({
            user,
            issue
        });

    }

    //This method will take in a request and a provider and block that provider from being able to sell
    //to the requester or get in contact with them. It does this by addind the provider's ID to the array
    //of blocked users that belongs to the requesters
    static async blockCompany(requester, provider) {

        return await this.functions.httpsCallable("blockCompany")({
            requester,
            provider
        });

    }

    //This method will log out the current user of the app
    static async logOut() {
        
        await firebase.auth().signOut();
        return 0;

    }

    //This method will take in an error message and log it into firebase firestore where errors
    //are stored
    static logIssue(error) {
        
        return this.functions.httpsCallable("logIssue")({
            error
        });

    }

}

