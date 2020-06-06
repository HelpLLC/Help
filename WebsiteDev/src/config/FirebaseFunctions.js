import * as firebase from 'firebase';
var firebaseConfig = {
	apiKey: "AIzaSyBLegtXhc78nSL0k5xr_6UYzrToVK8UtaI",
    authDomain: "quranconnect-4e4bc.firebaseapp.com",
    databaseURL: "https://quranconnect-4e4bc.firebaseio.com",
    projectId: "quranconnect-4e4bc",
    storageBucket: "quranconnect-4e4bc.appspot.com",
    messagingSenderId: "613685750998",
    appId: "1:613685750998:web:d4b67fef808760e11d6d77",
    measurementId: "G-CKKZ7H1ETQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default class FirebaseFunctions {
	//The collections & references that will be used by this class
	static analytics = firebase.analytics();
	static functions = firebase.functions();
	static storage = firebase.storage();

	static async call(functionName, parameters) {
		const functionReturn = await this.functions.httpsCallable(functionName)(parameters);
		return functionReturn.data;
	}

	//Logs the user in and subscribes to the notification service associated with his/her account
	static async logIn(email, password) {
		const account = await firebase.auth().signInWithEmailAndPassword(email, password);
		//Tests whether this is a business or a customer & based on that, subscribes to the correct channel
		const { uid } = account.user;
		//If the user only has a customer account, an error is returned
		const customer = (await this.functions.httpsCallable('getCustomerByID')({ customerID: uid }))
			.data;
		const business = (await this.functions.httpsCallable('getBusinessByID')({ businessID: uid }))
			.data;
		//Logs the event in firebase analytics
		this.analytics.logEvent('business_log_in');
		//Subscribes to the business channel
		if (customer !== -1 && business === -1) {
			return -1;
		}
		return business.businessID;
	}
	// This method emails the user a link to go ahead and reset their password if they have forgotten their password
	// Used in Login.js
	// @param email: the email that the link needs to be sent to
	static async forgotPassword(emailAddress) {
		try {
			// If successful, return 1 or else return -1
			await firebase.auth().sendPasswordResetEmail(emailAddress);
			return 1;
		} catch (error) {
			return -1;
		}
	}
}
