//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. The class
//will connect with the firebase firestore in order to retrieve the necessary data.
import firebase from 'react-native-firebase';
const firebaseConfig = {
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

//All methods should be labeled static. There will also be static variable that reference the collections
//in the cloud firestore
export default class FirebaseFunctions {
	//The collections & references that will be used by this class
	static fcm = firebase.messaging();
	static analytics = firebase.analytics();
	static functions = firebase.functions();
	static storage = firebase.storage();

	//Method calls a firebase function by taking the functions name as a parameter, the parameters of the cloud function
	//as a second parameter, and then returns the functions result
	static async call(functionName, parameters) {
		const functionReturn = await this.functions.httpsCallable(functionName)(parameters);
		const data = functionReturn.data;
		return data;
	}

	//This method will log out the current user of the app & unsubscribed to the notification channel associated with
	//this user
	static async logOut(uid) {
		//Logs the event in firebase analytics & unsubcribes from the notification service
		await firebase.auth().signOut();
		this.analytics.logEvent('customer_log_out');
		this.fcm.unsubscribeFromTopic('c-' + uid);
		return 0;
	}

	// This method emails the user a link to go ahead and reset their password if they have forgotten their password
	// Used in forgotPasswordScreen.js
	// @param email: the email that the link needs to be sent to
	static async forgotPassword(email) {
		await firebase.auth().sendPasswordResetEmail(email);

		this.analytics.logEvent('forgot_password_email_sent');
		return 0;
	}

	//Logs the user in and subscribes to the notification service associated with his/her account
	//If the user is a customer, the topic will be named "c-accountUID", and if they are a business, it will be
	//"b-accountUID". The method will then return the topic name
	static async logIn(email, password) {
		const account = await firebase.auth().signInWithEmailAndPassword(email, password);
		//Tests whether this is a business or a customer & based on that, subscribes to the correct channel
		const { uid } = account.user;
		//Starts with searching if this is a customer since that is more common
		const customer = await this.call('getCustomerByID', { customerID: uid });
		const business = await this.call('getBusinessByID', { businessID: uid });
		//Logs the event in firebase analytics
		this.analytics.logEvent('customer_log_in');
		//Subscribes to the customer channel
		const topicName = 'c-' + uid;
		await this.fcm.subscribeToTopic(topicName);
		//If this account is only a business account, then the method will return a string indicator to show this
		if (customer === -1 && business !== -1) {
			return 'IS_ONLY_BUSINESS ' + topicName;
		}
		return topicName;
	}

	//This method will set the current screen to a specific name in firebase analytics
	static setCurrentScreen(screenName, screenClassOverride) {
		this.analytics.setCurrentScreen(screenName, screenClassOverride);
	}
}
