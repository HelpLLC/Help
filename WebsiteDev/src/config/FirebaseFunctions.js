import * as firebase from "firebase";

export default class FirebaseFunctions {
  //The collections & references that will be used by this class
  static fcm = firebase.messaging();
  static analytics = firebase.analytics();
  static functions = firebase.functions();
  static storage = firebase.storage();

  //Login function
  static async logIn(email, password) {
      
    const account = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    //Tests whether this is a provider or a requester & based on that, subscribes to the correct channel
    const { uid } = account.user;
    //If the user only has a requester account, an error is returned
    const requester = await this.functions.httpsCallable("getCustomerByID")({
      customerID: uid
    });
    const provider = await this.functions.httpsCallable("getBusinessByID")({
      businessID: uid
    });
    //Logs the event in firebase analytics
    this.analytics.logEvent("provider_log_in");
    //Subscribes to the provider channel
    const topicName = "b-" + uid;
    await this.fcm.subscribeToTopic(topicName);
    if (requester !== -1 && provider === -1) {
      return "IS_ONLY_CUSTOMER " + topicName;
    }
    return topicName;
  }
}
