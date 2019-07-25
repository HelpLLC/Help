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
const storage = admin.storage();
const providers = database.collection("providers");
const requesters = database.collection("requesters");
const products = database.collection("products");
const messages = database.collection("messages");
const issues = database.collection("issues");

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
