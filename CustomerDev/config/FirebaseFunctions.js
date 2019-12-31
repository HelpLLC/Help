//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. The class
//will connect with the firebase firestore in order to retrieve the necessary data.
import firebase from 'react-native-firebase';

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
    return functionReturn.data;
  }

  //This method will log out the current user of the app & unsubscribed to the notification channel associated with
  //this user
  static async logOut(uid) {
    //Logs the event in firebase analytics & unsubcribes from the notification service
    await firebase.auth().signOut();
    this.analytics.logEvent('customer_log_out');
    this.fcm.unsubscribeFromTopic('r-' + uid);
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
  //If the user is a requester, the topic will be named "r-accountUID", and if they are a provider, it will be
  //"p-accountUID". The method will then return the topic name
  static async logIn(email, password) {
    const account = await firebase.auth().signInWithEmailAndPassword(email, password);
    //Tests whether this is a provider or a requester & based on that, subscribes to the correct channel
    const { uid } = account.user;
    //Starts with searching if this is a requester since that is more common
    const requester = await this.call('getRequesterByID', { requesterID: uid });
    const provider = await this.call('getProviderByID', { providerID: uid });
    //Logs the event in firebase analytics
    this.analytics.logEvent('customer_log_in');
    //Subscribes to the requester channel
    const topicName = 'r-' + uid;
    await this.fcm.subscribeToTopic(topicName);
    //If this account is only a provider account, then the method will return a string indicator to show this
    if (requester === -1 && provider !== -1) {
      return 'IS_ONLY_PROVIDER ' + topicName;
    }
    return topicName;
  }

  //This method will set the current screen to a specific name in firebase analytics
  static setCurrentScreen(screenName, screenClassOverride) {
    this.analytics.setCurrentScreen(screenName, screenClassOverride);
  }
}
