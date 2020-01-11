const functions = require('firebase-functions');
const admin = require('firebase-admin');
const haversine = require('haversine');
var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://help-d194d.firebaseio.com',
  storageBucket: 'help-d194d.appspot.com'
});
//Configures email for automated emails
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'helpcocontact@gmail.com',
    pass: 'techBusiness123'
  },
  tls: {
    rejectUnauthorized: false
  }
});

//--------------------------------- Global Variables ---------------------------------

const database = admin.firestore();
const storage = admin.storage().bucket();
const fcm = admin.messaging();
const providers = database.collection('providers');
const requesters = database.collection('requesters');
const products = database.collection('products');
const conversations = database.collection('conversations');
const requests = database.collection('requests');
const issues = database.collection('issues');
const helpDev = database.collection('helpDev');

//--------------------------------- Global Functions ---------------------------------

//Method returns an array with all products
const getAllProducts = async () => {
  const snapshot = await products.get();

  //Returns the array which contains all the docs
  const array = await snapshot.docs.map((doc) => doc.data());

  //Removes the example from product from the array along with products that have been deleted
  const newArray = array.filter((element) => {
    return element.serviceTitle !== '' && !(element.isDeleted && element.isDeleted === true);
  });

  //Sorts the array by highest average rating
  newArray.sort((a, b) => {
    return b.averageRating - a.averageRating;
  });

  //Returns the correct array
  return newArray;
};

//Method fetches a conversation by matching providerID & requesterID & returns the conversation as an object.
//If the conversation does not exist, returns a new conversation object
const getConversationByID = async (providerID, requesterID) => {
  const ref = conversations
    .where('providerID', '==', providerID)
    .where('requesterID', '==', requesterID)
    .limit(1);
  const query = await ref.get();

  if (query.docs.length > 0) {
    const doc = query.docs[0].ref;
    //Gets the subcollection and fetches all of the docs
    const conversation = (await doc.collection('Messages').get()).docs;
    let conversationMessages = conversation.map((document) => document.data());
    //Sorts the conversation messages by time
    conversationMessages = conversationMessages.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return {
      conversationMessages,
      providerID,
      requesterID
    };
  }
  return {
    conversationMessages: [],
    providerID,
    requesterID
  };
};

//Method sends a notification with a custom title and body to a specific topic (user)
const sendNotification = async (topic, title, body) => {
  await fcm.sendToTopic(topic, {
    notification: {
      title,
      body
    }
  });
  return 0;
};

//Method will take in a product ID and a requester ID and then delete that requester's request
//from the subcollection of the product's current requests. It will also remove the request from the Requests subcollection
//of tthe requester
const deleteRequest = async (productID, requesterID, requestID) => {
  //updates the subcollection by removing the request
  await products
    .doc(productID)
    .collection('Requests')
    .doc(requestID)
    .delete();
  await requesters
    .doc(requesterID)
    .collection('Requests')
    .doc(requestID)
    .delete();
  await requests.doc(requestID).delete();

  //Fetches the necessary data to send a notification
  const product = (await products.doc(productID).get()).data();
  const requester = (await requesters.doc(requesterID).get()).data();

  //Notifies the business that the request has been deleted.
  sendNotification(
    'p-' + product.offeredByID,
    'Request Cancelled',
    requester.username + ' ' + 'has cancelled their request for' + ' ' + product.serviceTitle
  );

  return 0;
};

//--------------------------------- "Document-Object" Getters ---------------------------------

//Method returns an array with all providers
exports.getAllProviders = functions.https.onCall(async (input, context) => {
  const snapshot = await providers.get();
  const array = await snapshot.docs.map((doc) => doc.data());

  //Returns the array which contains all of the docs
  return array;
});

//Method returns an array with all requesters
exports.getAllRequesters = functions.https.onCall(async (input, context) => {
  const snapshot = await requesters.get();
  const array = await snapshot.docs.map((doc) => doc.data());

  //Returns the array which contains all of the docs
  return array;
});

//Method returns an array with all products
exports.getAllProducts = functions.https.onCall(async (input, context) => {
  const allProducts = await getAllProducts();
  return allProducts;
});

//Method returns an array with all conversations
exports.getAllConversations = functions.https.onCall(async (input, context) => {
  const snapshot = await conversations.get();
  const array = await snapshot.docs.map((doc) => doc.data());

  //Returns the array which contains all of the docs
  return array;
});

//Method returns an array with all requests
exports.getAllRequests = functions.https.onCall(async (input, context) => {
  const snapshot = await requests.get();
  const array = await snapshot.docs.map((doc) => doc.data());

  //Returns the array which contains all of the docs
  return array;
});

//Method fetches a provider by ID & returns the provider as an object. If the provider does not exist, returns -1
exports.getProviderByID = functions.https.onCall(async (input, context) => {
  const { providerID } = input;
  const ref = providers.doc(providerID + '');
  const doc = await ref.get();

  if (doc.exists) {
    return doc.data();
  } else {
    return -1;
  }
});

//Method fetches a requester by ID & returns the requester as an object. If the requester does not exist, returns -1
exports.getRequesterByID = functions.https.onCall(async (input, context) => {
  const { requesterID } = input;
  const ref = requesters.doc(requesterID + '');
  const doc = await ref.get();

  if (doc.exists) {
    return doc.data();
  } else {
    return -1;
  }
});

//Method fetches a service by ID & returns the service as an object. If the service does not exist, returns -1
exports.getServiceByID = functions.https.onCall(async (input, context) => {
  const { serviceID } = input;
  const ref = products.doc(serviceID + '');
  const doc = await ref.get();

  if (doc.exists) {
    return doc.data();
  } else {
    return -1;
  }
});

//Method fetches a request by ID & returns the request as an object. If the request does not exist, returns -1
exports.getRequestByID = functions.https.onCall(async (input, context) => {
  const { requestID } = input;
  const ref = requests.doc(requestID + '');
  const doc = await ref.get();

  if (doc.exists) {
    return doc.data();
  } else {
    return -1;
  }
});

//Method fetches a conversation by matching providerID & requesterID & returns the conversation as an object.
//If the conversation does not exist, returns a new conversation object
exports.getConversationByID = functions.https.onCall(async (input, context) => {
  const { providerID, requesterID } = input;
  const conversation = await getConversationByID(providerID, requesterID);
  return conversation;
});

//Method fetches the array of completed subcollection level request objects that belong to a specific requester
exports.getCompletedRequestsByRequesterID = functions.https.onCall(async (input, context) => {
  const { requesterID } = input;
  const completedServices = await requesters
    .doc(requesterID)
    .collection('Requests')
    .where('isCompleted', '==', true)
    .get();
  const arrayOfCompletedServices = completedServices.docs.map((doc) => doc.data());
  return arrayOfCompletedServices;
});

//Method fetches the array of in progress subcollection level request objects that belong to a specific requester
exports.getInProgressRequestsByRequesterID = functions.https.onCall(async (input, context) => {
  const { requesterID } = input;
  const inProgressServices = await requesters
    .doc(requesterID)
    .collection('Requests')
    .where('isCompleted', '==', false)
    .get();
  const arrayOfInProgressServices = inProgressServices.docs.map((doc) => doc.data());
  return arrayOfInProgressServices;
});

//Method will return an array of category objects. Each object will contain two fields. The first field will be the name
//of the category, and the second will be the location of the image as it is stored in Firebase Storage. The image will not actually
//be downloaded with this method. Instead you must call the method "getCategoryImageByID" to return the downloaded image
exports.getCategoryObjects = functions.https.onCall(async (input, context) => {
  //Fetches the array from firestore containing the categories
  const categoriesDocument = await helpDev.doc('categories').get();
  const { arrayOfCategoriesWithImages } = categoriesDocument.data();
  return arrayOfCategoriesWithImages;
});

//This method will take in all the unblocked products for a requester and then return
//all the products associated with a certain category which will be passed in as a second
//parameter
exports.getProductsByCategory = functions.https.onCall(async (input, context) => {
  const { allProducts, categoryName } = input;
  //creates the new array
  const filteredProducts = allProducts.filter((element) => {
    return element.category === categoryName;
  });

  return filteredProducts;
});

//Method returns an array of review objects given a specific serviceID
exports.getReviewsByServiceID = functions.https.onCall(async (input, context) => {
  const { serviceID } = input;
  const reviews = await products
    .doc(serviceID)
    .collection('Reviews')
    .get();
  const arrayOfReviews = reviews.docs.map((doc) => doc.data());
  return arrayOfReviews;
});

//Method returns an array of all the conversation that this user has had, depending on if they are a
//requseter or a provider
exports.getAllUserConversations = functions.https.onCall(async (input, context) => {
  const { userID, isRequester } = input;
  let allUserConversations = [];
  const searchBy = isRequester === true ? 'requesterID' : 'providerID';
  const ref = this.conversations.where(searchBy, '==', userID);
  const query = await ref.get();
  const docs = query.docs;
  for (const doc of docs) {
    const obj = await doc.get();
    const objWithConversation = getConversationByID(obj.providerID, obj.requesterID);
    allUserConversations.push(objWithConversation);
  }

  return allUserConversations;
});

//Method is going to return an array of providers that have been blocked by a requester. The array
//will contain objects containing two fields: the provider's ID and the provider's company name
exports.getBlockedBusinessesByRequesterID = functions.https.onCall(async (input, context) => {
  const { requesterID } = input;
  const allDocs = await requesters
    .doc(requesterID)
    .collection('BlockedUsers')
    .get();
  const docData = await allDocs.docs.map((doc) => doc.data());
  const finalArray = [];
  for (const blocked of docData) {
    const { providerID } = blocked;
    //Removes the default businesses from the list of blocked users (unless it is our test account)
    //No matter what, don't add the Example Provider Document
    if (providerID !== 'Example Provider') {
      //If it is the test business account, only add it if it is on the requester test account
      if (providerID === 'MRWYHdcULQggTQlxyXwGbykY5r02') {
        if (requesterID === 'IaRNsJxXE4O6gdBqbBv24bo39g33') {
          const provider = (await providers.doc(providerID).get()).data();
          finalArray.push({
            providerID: provider.providerID,
            companyName: provider.companyName
          });
        }
        //If it is just normal blocked user, add them to array
      } else {
        console.log(providerID)
        const providerDoc = await providers.doc(providerID).get()
        console.log(providerDoc);
        const provider = providerDoc.data();
        console.log(provider);
        finalArray.push({
          providerID: provider.providerID,
          companyName: provider.companyName
        });
      }
    }
  }
  return finalArray;
});

//Method is going to take an ID of a service & return the number of current requests that service
//currently has
exports.getNumCurrentRequestByServiceID = functions.https.onCall(async (input, context) => {
  const { serviceID } = input;
  const number = (
    await products
      .doc(serviceID)
      .collection('Requests')
      .where('isCompleted', '==', false)
      .get()
  ).docs.length;
  return number;
});

//Method is going to take in an ID of a service & return all of the current request object that are
//associated with this service
exports.getCurrentRequestsByServiceID = functions.https.onCall(async (input, context) => {
  const { serviceID } = input;
  const docs = await requests
    .where('serviceID', '==', serviceID)
    .where('isCompleted', '==', false)
    .get();
  const arrayOfData = docs.docs.map((doc) => doc.data());
  return arrayOfData;
});

//Method is going to take in an ID of a service & return all of the completed request object that are
//associated with this service
exports.getCompletedRequestsByServiceID = functions.https.onCall(async (input, context) => {
  const { serviceID } = input;
  const docs = await requests
    .where('serviceID', '==', serviceID)
    .where('isCompleted', '==', true)
    .get();
  const arrayOfData = docs.docs.map((doc) => doc.data());
  return arrayOfData;
});

//--------------------------------- Document Updaters ---------------------------------

//Method will take in an ID of a provider and update the object with the fields that are passed in using an object which will
//be the second parameter of the method. If the provider doesn't exist, then the method will return -1.
exports.updateProviderByID = functions.https.onCall(async (input, context) => {
  const { providerID, updates } = input;
  const ref = providers.doc(providerID);
  try {
    await ref.update(updates);
  } catch (error) {
    return -1;
  }
  return 0;
});

//Method method will take in an ID of a requester and update the object with the fields that are passed in using an object which will
//be the second parameter of the method. If the requester doesn't exist, then the method will return -1.
exports.updateRequesterByID = functions.https.onCall(async (input, context) => {
  const { requesterID, updates } = input;
  const ref = requesters.doc(requesterID);
  try {
    await ref.update(updates);
  } catch (error) {
    return -1;
  }
  return 0;
});

//Method will take in an ID of a product and update the object with the fields that are passed in using an object which will
//be the second parameter of the method. If the product doesn't exist, then the method will return -1.
exports.updateServiceByID = functions.https.onCall(async (input, context) => {
  const { serviceID, updates } = input;
  const ref = products.doc(serviceID);
  try {
    await ref.update(updates);
  } catch (error) {
    return -1;
  }
  return 0;
});

//Method will take in an ID of a request and update that request object with the fields that are passed in
//as a second parameter. If the request doesn't exist, the method will return -1.
exports.updateRequestByID = functions.https.onCall(async (input, context) => {
  const { requestID, updates } = input;
  const ref = requests.doc(requestID);
  try {
    await ref.update(updates);
  } catch (error) {
    return -1;
  }
  return 0;
});

//Method will take in an ID of a conversation and update the object with the fields that are passed in using an object which will
//be the second parameter of the method. If the conversation doesn't exist, then the method will return -1.
exports.updateCoversationByID = functions.https.onCall(async (input, context) => {
  const { conversationID, updates } = input;
  const ref = conversations.doc(conversationID);
  try {
    await ref.update(updates);
  } catch (error) {
    return -1;
  }
  return 0;
});

//Method will update the information for a provider by taking in the new provider object and overwriting it in firebase
exports.updateProviderInfo = functions.https.onCall(async (input, context) => {
  const { providerID, newProviderInfo } = input;
  await providers.doc(providerID).update(newProviderInfo);

  //Goes through and edits all of the products that belong to this business & updated the
  //field that connects them to the correct provider to the new businessName
  const query = products.where('offeredByID', '==', providerID);
  const result = await query.get();
  for (const doc of result.docs) {
    await products.doc(doc.id).update({
      offeredByName: newProviderInfo.companyName,
      coordinates: newProviderInfo.coordinates,
      location: newProviderInfo.location
    });
  }

  return 0;
});

//Method will update the information for a specific product by taking in all of the new
//product information and updating those fields in firestore
exports.updateServiceInfo = functions.https.onCall(async (input, context) => {
  const { productID, newProductObject } = input;
  const { response, price } = newProductObject;
  //Creates the product object & the pricing text to be displayed to users
  let pricing =
    price.priceType === 'per'
      ? '$' + price.price + ' ' + 'per' + ' ' + price.per
      : price.priceType === 'range'
      ? '$' + price.min + ' ' + 'to' + ' $' + price.max
      : '$' + price.priceFixed;
  let updatedProductObjectWithPrice = {
    ...newProductObject,
    pricing
  };
  //Deletes the response field from the product that is going into firebase
  delete updatedProductObjectWithPrice.response;
  await products.doc(productID).update(updatedProductObjectWithPrice);

  //Removes the old image and then uploads the new one if the image has been changed
  if (response !== null) {
    const imageRef = storage.file('products/' + productID);

    await imageRef.delete();
  }

  return 0;
});

//Method is going to remove a business's reference to a service as well as give this service
//a "isDeleted" field of true to make sure it does not appear for customers. It will still remain in the database
//so it can be referenced to in a customer's order history and/or reviews. Additionally, it is going to remove
//all exisitng requests that are in this service & send customers notifications saying the service has been
//deleted
exports.deleteService = functions.https.onCall(async (input, context) => {
  const { serviceID, providerID } = input;
  await products.doc(serviceID).update({
    isDeleted: true
  });

  const provider = (await providers.doc(providerID).get()).data();
  let { serviceIDs } = provider;
  let indexOfService = serviceIDs.findIndex((productID) => {
    return productID === serviceID;
  });
  serviceIDs.splice(indexOfService, 1);
  await providers.doc(providerID).update({
    serviceIDs
  });

  //Deletes all current requests for the service & notifies the customers
  const requestsSub = products.doc(serviceID).collection('Requests');
  const inProgress = (await requestsSub.where('isCompleted', '==', false).get()).docs;
  for (const request of inProgress) {
    const reqeustObject = (await requests.doc(request.requestID).get()).data();
    await deleteRequest(serviceID, reqeustObject.requesterID, request.requeustID);
  }

  return 0;
});

//--------------------------------- Creating Functions ---------------------------------

//Method will take in a new requester ID and then will add that requester to the firestore
//as a new requester with a unique requester ID
exports.addRequesterToDatabase = functions.https.onCall(async (input, context) => {
  const { userID, phoneNumber, coordinates, city, name } = input;
  const uid = userID;
  const ref = requesters.doc(uid);

  const newRequester = {
    requesterID: uid,
    username: name,
    phoneNumber,
    coordinates,
    city
  };

  //Creates the document and its blocked users subcollection
  await ref.set(newRequester);
  await ref
    .collection('BlockedUsers')
    .doc('Example Provider')
    .set({
      providerID: 'Example Provider'
    });
  await ref
    .collection('BlockedUsers')
    .doc('MRWYHdcULQggTQlxyXwGbykY5r02')
    .set({
      providerID: 'MRWYHdcULQggTQlxyXwGbykY5r02'
    });

  //This is a promise that won't be resolved while offline
  return newRequester;
});

//Method will take in a new provider ID and then will add that new provider to the firestore
//as a new provider with a unique provider ID and a username which will just be their email without
//the "@". It will also have the companyName and the companyDescription that is passed along with a phone
//number. Must wait for verfication by developers (default value for "isVerified" is false), when switched to true,
//user can log in
exports.addProviderToDatabase = functions.https.onCall(async (input, context) => {
  const { newProvider } = input;
  await providers.doc(newProvider.providerID).set(newProvider);

  const {
    companyName,
    companyDescription,
    email,
    phoneNumber,
    location,
    website,
    providerID
  } = newProvider;

  //Fetches the business's name and description from the params

  //Configures the email subject, to, and from
  const mailOptions = {
    from: 'Help <helpcocontact@gmail.com>',
    to: 'helpcocontact@gmail.com',
    subject: 'New Business'
  };

  //This is in the case that the user has not installed a new version of the app
  if (!providerID) {
    //The text of the email
    mailOptions.text =
      'A new business has signed up on Help. Here is its information.\n\n' +
      'Business Name: ' +
      companyName +
      '\n\n' +
      'Business Description: ' +
      companyDescription +
      '\n\n' +
      'Business Email: ' +
      email +
      '\n\n' +
      'Business Phone Number: ' +
      phoneNumber +
      '\n\n' +
      'This user is currently on an older version of the app. To approve or decline them, you must manually change the "isVerified" field in Cloud Firestore.' +
      '\n\nHelp LLC';
  } else {
    //The text of the email
    mailOptions.text =
      'A new business has signed up on Help. Here is its information.\n\n' +
      'Business Name: ' +
      companyName +
      '\n\n' +
      'Business Description: ' +
      companyDescription +
      '\n\n' +
      'Business Email: ' +
      email +
      '\n\n' +
      'Business Phone Number: ' +
      phoneNumber +
      '\n\n' +
      'Business Location: ' +
      location +
      '\n\n' +
      'Business Site: ' +
      website +
      '\n\n' +
      'To approve this busisness, click this link: \n' +
      'https://us-central1-help-d194d.cloudfunctions.net/verifyBusiness?businessEmail=' +
      email +
      '&providerID=' +
      providerID +
      '\n\n' +
      'To decline this business, click this link: \n' +
      'https://us-central1-help-d194d.cloudfunctions.net/declineBusiness?businessEmail=' +
      email +
      '&providerID=' +
      providerID +
      '\n\nHelp LLC';
  }

  await mailTransport.sendMail(mailOptions);
  return newProvider;
});

//This method will take information about a new product and add it to the firestore database. It will
//first add it to the firestore containing products, then it will add the service IDs to the provider
//products
exports.addProductToDatabase = functions.https.onCall(async (input, context) => {
  const { providerID, newProductObject } = input;
  //Creates the product object & the pricing text to be displayed to users
  const { price, response } = newProductObject;
  let pricing =
    price.priceType === 'per'
      ? '$' + price.price + ' ' + 'per' + ' ' + price.per
      : price.priceType === 'range'
      ? '$' + price.min + ' ' + 'to' + ' $' + price.max
      : '$' + price.priceFixed;
  //Fetches the provider by their ID so they can get some required information
  const provider = (await providers.doc(providerID).get()).data();
  const { coordinates, location, companyName } = provider;
  //Adds the remaining required fields to the object
  let product = {
    ...newProductObject,
    pricing,
    offeredByID: providerID,
    coordinates,
    location,
    offeredByName: companyName,
    category: 'Cleaning',
    averageRating: 0,
    totalReviews: 0
  };

  //deletes the response field from the object going into firebase
  delete product.response;

  //Adds the product to the database of products
  const newProduct = await products.add(product);

  //Will deal with the ID of the product by adding it as a field and pushing to the
  //provider's field
  await products.doc(newProduct.id).update({
    serviceID: newProduct.id
  });
  await providers.doc(providerID).update({
    serviceIDs: admin.firestore.FieldValue.arrayUnion(newProduct.id)
  });

  return newProduct.id;
});

//Method sends a message by adding that conversation to the database. If the conversation is a new one,
//then it will create a new messages object between the two communicators
exports.sendMessage = functions.https.onCall(async (input, context) => {
  const { providerID, requesterID, message, isNewConversation } = input;

  //Retrieves the names of the requester and the provider so that can be added to the database
  //as well
  const provider = (await providers.doc(providerID).get()).data();
  const requester = (await requesters.doc(requesterID).get()).data();
  if (isNewConversation === true) {
    const messageWithCorrectDate = {
      _id: message[0]._id,
      createdAt: new Date(message[0].createdAt).getTime(),
      text: message[0].text,
      user: message[0].user
    };
    const newDoc = await conversations.add({
      providerID,
      requesterID,
      requesterName: requester.username,
      providerName: provider.companyName
    });
    await newDoc
      .collection('Messages')
      .doc(messageWithCorrectDate._id)
      .set(messageWithCorrectDate);
  } else {
    const ref = this.conversations
      .where('providerID', '==', providerID)
      .where('requesterID', '==', requesterID);
    const query = await ref.get();
    const doc = query.docs[0];
    const messageWithCorrectDate = {
      _id: message[0]._id,
      createdAt: new Date(message[0].createdAt).getTime(),
      text: message[0].text,
      user: message[0].user
    };
    await doc.ref
      .collection('Messages')
      .doc(messageWithCorrectDate._id)
      .set(messageWithCorrectDate);
  }

  //Notifies the user who RECIEVED the message (the opposite of whoever message[0].user is)
  //Notifies the provider whose service this belongs to
  if (message[0].user._id === providerID) {
    sendNotification('r-' + requesterID, provider.companyName, message[0].text);
  } else {
    sendNotification('p-' + providerID, requester.username, message[0].text);
  }
  return 0;
});

//--------------------------------- Image Functions ---------------------------------

//Method will take in an ID of a category image and download it from Firebase Storage, storing its URI.
exports.getCategoryImageByID = functions.https.onCall(async (input, context) => {
  const { ID } = input;
  //Creates the reference
  const uri = await storage
    .file('categoryIcons/' + ID)
    .getSignedUrl({ action: 'read', expires: '03-17-2025' });
  return { uri: await uri[0] };
});

//Method will take in a reference to a picture (the same as the product ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getProductImageByID = functions.https.onCall(async (input, context) => {
  const { ID } = input;
  //Creates the reference
  const uri = await storage
    .file('products/' + ID)
    .getSignedUrl({ action: 'read', expires: '03-17-2025' });
  return { uri: await uri[0] };
});

//Method will take in a reference to a picture (the same as the profile ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getProfilePictureByID = functions.https.onCall(async (input, context) => {
  const { ID } = input;
  //Creates the reference
  const uri = storage.file('profilePictures/' + ID);
  const exists = await uri.exists();
  if (exists[0] === true) {
    const downloadURL = await uri.getSignedUrl({ action: 'read', expires: '03-17-2025' });
    return { uri: await downloadURL[0] };
  } else {
    const downloadURL = await storage
      .file('profilePictures/defaultProfilePic.png')
      .getSignedUrl({ action: 'read', expires: '03-17-2025' });
    return { uri: await downloadURL[0] };
  }
});

//--------------------------------- Request Functions ---------------------------------

//Method will take in a request object, which may contain a schedule, answers to questions, or both.
//It will add this request object to the right locations. It will also take in an "isEditing" parameter
//that will overwrite an old request for this product with the new request
exports.requestService = functions.https.onCall(async (input, context) => {
  const { newRequest, isEditing } = input;
  //If this is a request being edited, the old request document will be edited, else it will be added
  if (isEditing === true) {
    await requests.doc(newRequest.requestID).update(newRequest);
  } else {
    const newRequestDoc = await requests.add(newRequest);
    const requestID = newRequestDoc.id;
    //Adds the ID to the request document
    await requests.doc(requestID).update({
      requestID: requestID,
      isCompleted: false
    });

    //Adds the request reference to the product's subcollection as well as the requester's subcollection
    await products
      .doc(newRequest.serviceID)
      .collection('Requests')
      .doc(requestID)
      .set({
        isCompleted: false,
        requestID: requestID,
        serviceID: newRequest.serviceID,
        dateSelected: newRequest.dateSelected
      });
    await requesters
      .doc(newRequest.requesterID)
      .collection('Requests')
      .doc(requestID)
      .set({
        isCompleted: false,
        requestID: requestID,
        serviceID: newRequest.serviceID,
        dateSelected: newRequest.dateSelected
      });
  }
  //Fetches the correct fields in order to send a notification
  const service = (await products.doc(newRequest.serviceID).get()).data();
  const requester = (await requesters.doc(newRequest.requesterID).get()).data();

  //If the request is a new one, then business will be notified. If it is an old one being edited, the business
  //will be notified of that as well
  if (isEditing === true) {
    sendNotification(
      'p-' + service.offeredByID,
      'Request Updated',
      requester.username + ' ' + 'has updated their request for' + ' ' + service.serviceTitle
    );
  } else {
    sendNotification(
      'p-' + service.offeredByID,
      'New Request',
      'You have a new request for ' + service.serviceTitle
    );
  }
  return 0;
});

//Method will take in a product ID and a requester ID and then complete the request by updating the subcollection
//versions as well as the collection level request object's field of "isCompleted" to be true
exports.completeRequest = functions.https.onCall(async (input, context) => {
  const { requestID } = input;

  await requests.doc(requestID).update({
    isCompleted: true
  });

  const request = (await requests.doc(requestID).get()).data();
  const { serviceID, requesterID } = request;
  await products
    .doc(serviceID)
    .collection('Requests')
    .doc(requestID)
    .update({
      isCompleted: true
    });
  await requesters
    .doc(requesterID)
    .collection('Requests')
    .doc(requestID)
    .update({
      isCompleted: true,
      review: 'Pending'
    });

  return 0;
});

//Method will take in a product ID and a requester ID and then delete that requester's request
//from the subcollection of the product's current requests. It will also remove the request from the Requests subcollection
//of tthe requester
exports.deleteRequest = functions.https.onCall(async (input, context) => {
  const { productID, requesterID, requestID } = input;
  const deleted = await deleteRequest(productID, requesterID, requestID);
  return deleted;
});

//--------------------------------- Review Functions ---------------------------------

//Method is going to add a review to the array of reviews for a specified service. It will also
//update the status of the review inside the requester's array of orderHistory.
exports.submitReview = functions.https.onCall(async (input, context) => {
  const { serviceID, requesterID, stars, comment, requestID } = input;
  const requester = (await requesters.doc(requesterID).get()).data();
  review = {
    requesterName: requester.username,
    stars,
    requesterID,
    requestID,
    comment
  };

  const service = (await products.doc(serviceID).get()).data();

  //Calculates the new average rating for the service
  const a = service.averageRating * service.totalReviews;
  const b = a + stars;
  const c = service.totalReviews + 1;
  const newRating = b / c;

  await products.doc(serviceID).update({
    averageRating: newRating,
    totalReviews: service.totalReviews + 1
  });

  //Fetches the document of the service so it can add the review as an object to the subcollection
  await products
    .doc(serviceID)
    .collection('Reviews')
    .doc(requestID)
    .set(review);

  //Adds the review to the request document
  await requests.doc(requestID).update({ review: review });

  //Indicates that the user has completed the review
  await requesters
    .doc(requesterID)
    .collection('Requests')
    .doc(requestID)
    .update({
      review: 'Done'
    });

  return 0;
});

//This method is going to update the review status of a specific product inside a requester object
//to indicate that they have opted out of reviewing this product
exports.skipReview = functions.https.onCall(async (input, context) => {
  const { requestID, requesterID } = input;
  //Indicates that the user has skipped the review
  await requesters
    .doc(requesterID)
    .collection('Requests')
    .doc(requestID)
    .update({
      review: 'Skipped'
    });
  return 0;
});

//--------------------------------- Blocking & Reporting Functions ---------------------------------

//Method will take in a requester and a provider and block that provider from being able to sell
//to the requester or get in contact with them. It does this by addind the provider's ID as a new document in
//the subcollection. Also notifies the developers by  reporting the company
exports.blockCompany = functions.https.onCall(async (input, context) => {
  const { requester, provider } = input;
  await requesters
    .doc(requester.requesterID)
    .collection('BlockedUsers')
    .doc(provider.providerID)
    .set({
      providerID: provider.providerID
    });

  await issues.add({
    issue: {
      report: 'Report against a company',
      companyID: provider.providerID,
      companyName: provider.companyName
    },
    userID: requester.requesterID
  });

  return 0;
});

//Method is going to take in a requesterID and a providerID and will unblock that specific businesses from
//the requester's blocked businesses
exports.unblockCompany = functions.https.onCall(async (input, context) => {
  const { requesterID, providerID } = input;
  await requesters
    .doc(requesterID)
    .collection('BlockedUsers')
    .doc(providerID)
    .delete();
  return 0;
});

//Method will take in a username of a user, the user's UID, and a string containing the issue.
//Then it will add the issue to be viewed in the database (in the future, should send an email to
//the email of the company)
exports.reportIssue = functions.https.onCall(async (input, context) => {
  const { user, issue } = input;
  //tests whether or not the user is a requester or a provider and adds a "r-" or "p-" before their
  //ID respectivly
  const userID = user.requesterID ? 'r-' + user.requesterID : 'p-' + user;

  await issues.add({
    issue,
    userID
  });

  return 0;
});

//--------------------------------- Boolean Functions ---------------------------------

//Method is going to test whether a requester object has all the fields required as of the 2.0 update
//It will return a boolen true or false based on that
exports.isRequesterUpToDate = functions.https.onCall(async (input, context) => {
  const { requesterObject } = input;
  return requesterObject.city && requesterObject.coordinates && requesterObject.phoneNumber;
});

//Method is going to test whether a provider object has all the fields required as of the 2.0 update
//It will return a boolean true or false based on that
exports.isProviderUpToDate = functions.https.onCall(async (input, context) => {
  const { providerObject } = input;
  return providerObject.phoneNumber && providerObject.location && providerObject.coordinates;
});

//This method is going to return a boolean value on whether the app is currently under maintenance
//or not
exports.isEYBUnderMaintenance = functions.https.onCall(async (input, context) => {
  const maintenance = await helpDev.doc('maintenance').get();
  return maintenance.data().EYB;
});

//Method is going to return a boolean value on whether the app is currently under maintenance
//or not
exports.isGTDUnderMaintenance = functions.https.onCall(async (input, context) => {
  const maintenance = await helpDev.doc('maintenance').get();
  return maintenance.data().GTD;
});

//Method returns true or false based on whether a specific service has been requested by specific requester
exports.isServiceRequestedByRequester = functions.https.onCall(async (input, context) => {
  const { serviceID, requesterID } = input;
  const queryResults = (
    await requests
      .where('requesterID', '==', requesterID)
      .where('serviceID', '==', serviceID)
      .where('isCompleted', '==', false)
      .get()
  ).docs;
  if (queryResults.length === 0) {
    return false;
  } else {
    return true;
  }
});

//Method will check if a review is due for a customer. If there is not, the function will return false.
//If there is, then the function will return an object containing the necessary information for the customer
//to complete the review
exports.isReviewDue = functions.https.onCall(async (input, context) => {
  const { requesterID } = input;
  const requestsSub = await requesters
    .doc(requesterID)
    .collection('Requests')
    .where('review', '==', 'Pending')
    .limit(1);
  const query = (await requestsSub.get()).docs;
  if (query.length === 0) {
    return false;
  } else {
    const doc = query[0].data();
    const { requestID } = doc;
    const request = (await requests.doc(requestID).get()).data();
    const service = (await products.doc(request.serviceID).get()).data();
    return {
      requestID: requestID,
      serviceID: service.serviceID,
      serviceTitle: service.serviceTitle
    };
  }
});

//--------------------------------- Filtering Functions ---------------------------------

//Method will take in a requester object and an array of products. It will return an array containing only the products
//that are being offered by businesses that are within 50 miles of customer. In the future, this number of miles will be set
//by the business, as some businesses are willing to travel further than others
exports.filterProductsByRequesterLocation = functions.https.onCall(async (input, context) => {
  const { requester, products } = input;
  const requesterCoordinates = {
    latitude: requester.coordinates.lat,
    longitude: requester.coordinates.long
  };
  const filteredProducts = [];
  for (const product of products) {
    if (product.coordinates) {
      const productLocation = {
        latitude: product.coordinates.lat,
        longitude: product.coordinates.long
      };
      //Formula to calculate distance between two coordinates using Haversine Formula
      const distance = haversine(requesterCoordinates, productLocation, { unit: 'mile' });

      if (distance <= 50) {
        filteredProducts.push(product);
      }
    }
  }

  return filteredProducts;
});

//Method will take in a requester object & an array of products and return a filtered array of products
//that are offered by businesses that have not been blocked by the user
exports.filterProductsByRequesterBlockedUsers = functions.https.onCall(async (input, context) => {
  const { requester, products } = input;
  const { requesterID } = requester;

  const filteredProducts = [];
  for (const service of products) {
    const { offeredByID } = service;
    const doc = await requesters
      .doc(requesterID)
      .collection('BlockedUsers')
      .doc(offeredByID)
      .get();
    if (!doc.exists) {
      filteredProducts.push(service);
    }
  }
  return filteredProducts;
});

//--------------------------------- Notification Functions ---------------------------------

//Method sends a notification with a custom title and body to a specific topic (user)
exports.sendNotification = functions.https.onCall(async (input, context) => {
  const { topic, title, body } = input;
  const sent = await sendNotification(topic, title, body);
  return sent;
});

//--------------------------------- Email Functions ---------------------------------

//Method detects when a new business user has been verified & sends them a notification saying they're
//good to go
exports.businessGoodToGo = functions.firestore
  .document('providers/{providerID}')
  .onUpdate(async (change, context) => {
    if (change.after.data().isVerified === true && change.before.data().isVerified === false) {
      const topic = 'p-' + change.after.data().providerID;
      await admin.messaging().sendToTopic(topic, {
        notification: {
          title: 'Your good to go',
          body: "You're account has been verified and accepted. Create your first product now!"
        }
      });
    }

    return 0;
  });

//Method is going to take in a providerID and verify them by changing the "isVerified" field
//in firestore to true, therfore triggering a notification as well. Also sends them a welcome email
exports.verifyBusiness = functions.https.onRequest(async (req, res) => {
  try {
    const { businessEmail, providerID } = req.query;

    //Actually verifies the business
    const firestore = admin.firestore();
    const providerObject = firestore.collection('providers').doc(providerID);
    await providerObject.update({
      isVerified: true
    });

    //Sends a confirmation email to the business saying they have been verified
    const mailOptions = {
      from: 'Help <helpcocontact@gmail.com>',
      to: businessEmail,
      subject: "You're good to go"
    };
    mailOptions.text =
      "Your business has been verified on Help! We're super excited to welcome you to our family. Our goal " +
      'is to connect everyone with their local service businesses. You can now head over to the app, create your products, and get ' +
      'straight to business. For any questions, feedback, or insights, feel free to reach out to us at helpcocontact@gmail.com. ' +
      "We can't wait to see you grow.\n\nHelp LLC";
    await mailTransport.sendMail(mailOptions);

    res.send('Business has been verified');
  } catch (error) {
    res.send('Error');
  }
});

//Method is going to take in a providerID and email and decline their request to be a verified
//business on Help. It will send them an email, letting them know. Then it will delete the account
//from firebase in authentication and the provider document in firestore
exports.declineBusiness = functions.https.onRequest(async (req, res) => {
  try {
    const { businessEmail, providerID } = req.query;

    //Configures the email subject, to, and from, and text, then sends the mail
    const mailOptions = {
      from: 'Help <helpcocontact@gmail.com>',
      to: businessEmail,
      subject: 'Business Unverified'
    };
    mailOptions.text =
      'We regret to inform you that your business could not be verified and will not ' +
      'be able to be registered on Help. There could be multiple reasons for this. Your specific industry ' +
      'might not be currently supported on Help or your business could not be verified as a legitimate provider. ' +
      'For more information, email us at helpcocontact@gmail.com and we would be happy to assist you. You can also attempt ' +
      'to recreate your account with more updated information on your businesses and we will re-review your profile.\n\n' +
      'We apologize for the inconvenience.\n\nHelp LLC';
    await mailTransport.sendMail(mailOptions);

    //Deletes the user object from firestore and deletes the user from Firebase Authentication (unless they have an existing requester object)
    const firestore = admin.firestore();
    const doc = await firestore
      .collection('requesters')
      .doc(providerID)
      .get();
    if (!doc.exists) {
      const auth = admin.auth();
      await auth.deleteUser(providerID);
    }
    const providerObject = firestore.collection('providers').doc(providerID);
    await providerObject.delete();

    res.send('Business has been declined');
  } catch (error) {
    res.send(error);
  }
  return 0;
});

//--------------------------------- Issue Functions ---------------------------------

//Method will take in an error message and log it into firebase firestore where errors
//are stored
exports.logIssue = functions.https.onCall(async (input, context) => {
  const { error, userID } = input;
  //Adds it to the report issue section
  issues.add({
    userID,
    appError: true,
    errorName: error.name ? error.name : null,
    errorMessage: error.message ? error.message : null
  });
});
