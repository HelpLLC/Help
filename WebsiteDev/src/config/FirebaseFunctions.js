import * as firebase from 'firebase';
var firebaseConfig = {
	apiKey: 'AIzaSyDOgt8k63g6SUWvrP-dvu4LEUIbGAwsWDc',
	authDomain: 'help-technologies-e4e1c.firebaseapp.com',
	databaseURL: 'https://help-technologies-e4e1c.firebaseio.com',
	projectId: 'help-technologies-e4e1c',
	storageBucket: 'help-technologies-e4e1c.appspot.com',
	messagingSenderId: '127668734841',
	appId: '1:127668734841:web:2e9114165d61025d653da8',
	measurementId: 'G-DPVW5284H2'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default class FirebaseFunctions {
	//The collections & references that will be used by this class
	static analytics = firebase.analytics();
	static functions = firebase.functions();
	static storage = firebase.storage();
	static fcm = firebase.messaging();

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
		const customer = (await this.functions.httpsCallable('getCustomerByID')({ customerID: uid })).data;
		const business =  (await this.functions.httpsCallable('getBusinessByID')({ businessID: uid })).data;
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
	// If successful, return 1 or else return -1
	firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
		return 1;
	}).catch(function(error) {
		return -1;
	});
 }
}
