const functions = require('firebase-functions');
const admin = require('firebase-admin');
const haversine = require('haversine');
var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://help-technologies-e4e1c.firebaseio.com',
	storageBucket: 'help-technologies-e4e1c.appspot.com'
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
const businesses = database.collection('businesses');
const customers = database.collection('customers');
const services = database.collection('services');
const requests = database.collection('requests');
const issues = database.collection('issues');
const helpDev = database.collection('helpDev');

//--------------------------------- Global Functions ---------------------------------

//Method returns an array with all services
const getAllServices = async () => {
	const snapshot = await services.get();

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

//Sends an automatic email to a specified email. Takes in the email subject, the recepient, and the text
const sendEmail = async (recepient, subject, text) => {
	//Configures the email subject, to, and from
	const mailOptions = {
		from: 'Help <helpcocontact@gmail.com>',
		to: recepient,
		subject,
		text
	};

	await mailTransport.sendMail(mailOptions);

	return 0;
};

//Method will take in a service ID and a customer ID and a requestID and a businessID and then delete that customer's request
//from the service's current requests.
const deleteRequest = async (serviceID, customerID, requestID, businessID) => {
	
	//Updates the request collection
	await requests.doc(requestID).delete();

	//Updates the business document
	let business = (await businesses.doc(businessID).get()).data();
	const indexOfService = business.services.findIndex((element) => element.serviceID === serviceID);
	business.services[indexOfService].numCurrentRequests =
		business.services[indexOfService].numCurrentRequests - 1;
	let indexOfRequest = business.currentRequests.findIndex((element) => element.requestID === requestID);
	business.currentRequests.splice(indexOfRequest, 1);
	await businesses.doc(businessID).update({
		services: business.services,
		currentRequests: business.currentRequests
	});

	//Updates the customer document
	const customer = (await customers.doc(customerID).get()).data();
	indexOfRequest = customer.currentRequests.findIndex((element) => element.requestID === requestID);
	customer.currentRequests.splice(indexOfRequest, 1);
	await customers.doc(customerID).update({
		currentRequests: customer.currentRequests
	});

	//Updates the service document
	const service = (await services.doc(serviceID).get()).data();
	indexOfRequest = service.currentRequests.findIndex((element) => element.requestID === requestID);
	service.currentRequests.splice(indexOfRequest, 1);
	await services.doc(serviceID).update({
		currentRequests: service.currentRequests
	});

	//Notifies the business that the request has been deleted.
	sendNotification(
		'b-' + service.businessID,
		'Request Cancelled',
		customer.name + ' ' + 'has cancelled their request for' + ' ' + service.serviceTitle
	);

	return 0;
};

//--------------------------------- "Document-Object" Getters ---------------------------------

//Method returns an array with all businesses
exports.getAllBusinesses = functions.https.onCall(async (input, context) => {
	const snapshot = await businesses.get();
	const array = await snapshot.docs.map((doc) => doc.data());

	//Returns the array which contains all of the docs
	return array;
});

//Method returns an array with all customers
exports.getAllCustomers = functions.https.onCall(async (input, context) => {
	const snapshot = await customers.get();
	const array = await snapshot.docs.map((doc) => doc.data());

	//Returns the array which contains all of the docs
	return array;
});

//Method returns an array with all services
exports.getAllServices = functions.https.onCall(async (input, context) => {
	const allServices = await getAllServices();
	return allServices;
});

//Method returns an array with all requests
exports.getAllRequests = functions.https.onCall(async (input, context) => {
	const snapshot = await requests.get();
	const array = await snapshot.docs.map((doc) => doc.data());

	//Returns the array which contains all of the docs
	return array;
});

//Method fetches a service by ID & returns the service as an object. If the service does not exist, returns -1
exports.getBusinessByID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;
	const ref = businesses.doc(businessID + '');
	const doc = await ref.get();

	if (doc.exists) {
		return doc.data();
	} else {
		return -1;
	}
});

//Method fetches a customer by ID & returns the customer as an object. If the customer does not exist, returns -1
exports.getCustomerByID = functions.https.onCall(async (input, context) => {
	const { customerID } = input;
	const ref = customers.doc(customerID + '');
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
	const ref = services.doc(serviceID + '');
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

//Method fetches the array of completed subcollection level request objects that belong to a specific customer
exports.getCompletedRequestsByCustomerID = functions.https.onCall(async (input, context) => {
	const { customerID } = input;
	const completedServices = await customers
		.doc(customerID)
		.collection('CompletedRequests')
		.get();
	const arrayOfCompletedServices = completedServices.docs.map((doc) => doc.data());
	return arrayOfCompletedServices;
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

//This method will take in all the unblocked services for a customer and then return
//all the services associated with a certain category which will be passed in as a second
//parameter
exports.getServicesByCategory = functions.https.onCall(async (input, context) => {
	const { allServices, categoryName } = input;
	//creates the new array
	const filteredServices = allServices.filter((element) => {
		return element.category === categoryName;
	});

	return filteredServices;
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

//Method is going to take in an ID of a service & return all of the completed request object that are
//associated with this service
exports.getCompletedRequestsByServiceID = functions.https.onCall(async (input, context) => {
	const { serviceID } = input;
	const docs = await services
		.doc(serviceID)
		.collection('CompletedRequests')
		.get();
	const arrayOfData = docs.docs.map((doc) => doc.data());
	return arrayOfData;
});

//--------------------------------- Creating Functions ---------------------------------

//Method will take in a new customer ID and then will add that customer to the firestore
//as a new customer with a unique customer ID. That customer document will have the below fields as well
exports.addCustomerToDatabase = functions.https.onCall(async (input, context) => {
	const {
		address,
		blockedBusinesses,
		coordinates,
		currentRequests,
		customerID,
		city,
		email,
		name,
		phoneNumber,
		isReviewDue
	} = input;

	await customers.doc(customerID).set({
		address,
		blockedBusinesses,
		coordinates,
		currentRequests,
		city,
		customerID,
		email,
		name,
		phoneNumber,
		isReviewDue
	});

	return 0;
});

//method will take in new versions of customer inputs and will update them in firestore. Updated the customer document along
//with any customer information that is in any other documents
exports.updateCustomerInformation = functions.https.onCall(async (input, context) => {
	const { address, coordinates, customerID, city, name, phoneNumber, currentRequests } = input;

	await customers.doc(customerID).update({
		address,
		coordinates,
		customerID,
		city,
		name,
		phoneNumber
	});

	for (const request of currentRequests) {
		await requests.doc(request.requestID).update({ customerName: name });
	}

	return 0;
});

//Method will take in a new business ID and then will add that new business to the firestore
//as a new business with a unique business ID.
//Must wait for verfication by developers (default value for "isVerified" is false), when switched to true,
//user can log in.
//That business will have the below fields as well.
exports.addBusinessToDatabase = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the business
		businessName,
		businessDescription,
		businessHours,
		currentRequests,
		coordinates,
		email,
		location,
		services,
		website,
		businessID,
		phoneNumber,
		isVerified
	} = input;
	await businesses.doc(businessID).set({
		businessName,
		businessDescription,
		businessHours,
		currentRequests,
		coordinates,
		businessID,
		email,
		location,
		services,
		website,
		phoneNumber,
		isVerified
	});

	sendEmail(
		'helpcocontact@gmail.com',
		'New Business',
		'A new business has signed up on Help. Here is its information.\n\n' +
			'Business Name: ' +
			businessName +
			'\n\n' +
			'Business Description: ' +
			businessDescription +
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
			'To approve this business, click this link: \n' +
			'https://us-central1-help-technologies-e4e1c.cloudfunctions.net/verifyBusiness?businessEmail=' +
			email +
			'&businessID=' +
			businessID +
			'\n\n' +
			'To decline this business, click this link: \n' +
			'https://us-central1-help-technologies-e4e1c.cloudfunctions.net/declineBusiness?businessEmail=' +
			email +
			'&businessID=' +
			businessID +
			'\n\nHelp LLC'
	);
	return 0;
});

//This function is going to take in fields for a business and a businessID and update that business's information in
//firestore. It will also update any existing references to the business from existing documents
exports.updateBusinessInformation = functions.https.onCall(async (input, context) => {
	const {
		businessName,
		businessDescription,
		businessHours,
		coordinates,
		location,
		website,
		phoneNumber,
		businessID,
		business
	} = input;

	await businesses.doc(businessID).update({
		businessName,
		businessDescription,
		businessHours,
		coordinates,
		location,
		website,
		phoneNumber
	});

	for (const service of business.services) {
		await services.doc(service.serviceID).update({
			businessName
		});
	}
});

//This method will take information about a new service and add it to the firestore database. It will
//first add it to the services collection, then it will add it to the array of serviceIDs belonging to the business
exports.addServiceToDatabase = functions.https.onCall(async (input, context) => {
	const {
		averageRating,
		businessID,
		businessName,
		category,
		coordinates,
		currentRequests,
		displayedReviews,
		serviceDuration,
		simultaneousRequests,
		price,
		priceText,
		questions,
		serviceDescription,
		serviceTitle,
		totalReviews,
		cash,
		card
	} = input;

	//Adds the service to the collection
	const newServiceDocument = await services.add({
		averageRating,
		businessID,
		businessName,
		category,
		coordinates,
		currentRequests,
		displayedReviews,
		serviceDuration,
		priceText,
		simultaneousRequests,
		price,
		questions,
		serviceDescription,
		serviceTitle,
		card,
		cash,
		totalReviews
	});

	//Fetches its ID, adds it to its own document, and then adds it to the array of business serviceIDs
	const serviceID = newServiceDocument.id;
	await newServiceDocument.update({ serviceID });

	await businesses.doc(businessID).update({
		services: admin.firestore.FieldValue.arrayUnion({
			numCurrentRequests: 0,
			serviceID,
			category,
			serviceDescription,
			serviceTitle,
			priceText
		})
	});

	return serviceID;
});

//This method is going to take in a new version of a service and is going to update the service in firestore accorinding to
//updates. Updates the service document in addition to the service copy in the business document
exports.updateServiceInformation = functions.https.onCall(async (input, context) => {
	const {
		priceText,
		serviceDuration,
		simultaneousRequests,
		price,
		questions,
		serviceDescription,
		serviceTitle,
		serviceID,
		businessID,
		card,
		cash
	} = input;

	await services.doc(serviceID).update({
		priceText,
		serviceDuration,
		simultaneousRequests,
		price,
		questions,
		serviceDescription,
		card,
		cash,
		serviceTitle
	});

	//Updates the business document with the new information
	let business = (await businesses.doc(businessID).get()).data();
	const indexOfService = business.services.findIndex((element) => element.serviceID === serviceID);
	business.services[indexOfService] = {
		...business.services[indexOfService],
		serviceTitle,
		priceText,
		serviceDescription
	};

	await businesses.doc(businessID).update({
		services: business.services
	});

	return 0;
});

//Method is going to remove a business's reference to a service as well as give this service
//a "isDeleted" field of true to make sure it does not appear for customers. It will still remain in the database
//so it can be referenced to in a customer's order history and/or reviews. Additionally, it is going to remove
//all exisitng requests that are in this service & send customers notifications saying the service has been
//deleted
exports.deleteService = functions.https.onCall(async (input, context) => {
	const { serviceID, businessID } = input;
	await services.doc(serviceID).update({
		isDeleted: true
	});

	await businesses.doc(businessID).update({
		serviceIDs: admin.firestore.FieldValue.arrayRemove(serviceID)
	});

	//Deletes all current requests for the service & notifies the customers
	const service = await (await services.doc(serviceID).get()).data();
	for (const request of service.currentRequests) {
		await deleteRequest(serviceID, request.customerID, request.requestID, request.businessID);
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

//Method will take in a reference to a picture (the same as the service ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getServiceImageByID = functions.https.onCall(async (input, context) => {
	const { serviceID } = input;
	//Creates the reference
	const uri = await storage
		.file('services/' + serviceID)
		.getSignedUrl({ action: 'read', expires: '03-17-2025' });
	return { uri: await uri[0] };
});

//Method will take in a reference to a picture (the same as the profile ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getProfilePictureByID = functions.https.onCall(async (input, context) => {
	const { customerID } = input;
	//Creates the reference
	const uri = storage.file('profilePictures/' + customerID);
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
//It will add this request object to the right locations.
exports.requestService = functions.https.onCall(async (input, context) => {
	const {
		assignedTo,
		businessID,
		customerID,
		date,
		questions,
		review,
		serviceTitle,
		customerName,
		serviceDuration,
		requestedOn,
		serviceID,
		status,
		time
	} = input;
	//If this is a request being edited, the old request document will be edited, else it will be added

	const newRequestDoc = await requests.add({
		assignedTo,
		businessID,
		customerID,
		date,
		questions,
		review,
		serviceTitle,
		customerName,
		requestedOn,
		serviceID,
		status,
		time
	});
	const requestID = newRequestDoc.id;
	//Adds the ID to the request document
	newRequestDoc.update({ requestID });

	//Adds a reference to the request to the service's array of currentRequests
	await services.doc(serviceID).update({
		currentRequests: admin.firestore.FieldValue.arrayUnion({
			customerID,
			customerName,
			date,
			requestID,
			status,
			time
		})
	});

	//Adds a reference to the request to the customer's array of currentRequests
	await customers.doc(customerID).update({
		currentRequests: admin.firestore.FieldValue.arrayUnion({
			date,
			requestID,
			serviceID,
			serviceTitle,
			status,
			time
		})
	});

	//Increments the numRequests for the service. Also adds scheduling information for the business
	let business = (await businesses.doc(businessID).get()).data();
	const indexOfService = business.services.findIndex((element) => element.serviceID === serviceID);
	business.services[indexOfService].numCurrentRequests =
		business.services[indexOfService].numCurrentRequests + 1;
	await businesses.doc(businessID).update({
		services: business.services,
		currentRequests: admin.firestore.FieldValue.arrayUnion({
			date,
			time,
			requestID,
			serviceDuration,
			serviceTitle,
			serviceID,
			customerName
		})
	});

	sendNotification('b-' + businessID, 'New Request', 'You have a new request for ' + serviceTitle);

	//Emails help team that there has been a new requeset
	sendEmail(
		'helpcocontact@gmail.com',
		'New Request',
		'Customer #' +
			customerID +
			' has requested ' +
			serviceTitle +
			' from ' +
			'Business #' +
			businessID
	);

	return 0;
});

//Method is going to edit a request by it's ID as well as update any fields necessary in the current requests arrays
//of the customer and the service.
exports.updateCustomerRequest = functions.https.onCall(async (input, context) => {
	const {
		requestID,
		customerID,
		businessID,
		date,
		serviceDuration,
		questions,
		time,
		serviceTitle,
		status,
		serviceID,
		customerName
	} = input;
	await requests.doc(requestID).update({
		date,
		questions,
		time
	});

	//updates the request within the service
	let service = (await services.doc(serviceID).get()).data();
	const indexOfServiceRequest = service.currentRequests.findIndex(
		(element) => element.requestID === requestID
	);
	service.currentRequests[indexOfServiceRequest] = {
		customerID,
		customerName,
		date,
		requestID,
		status,
		time
	};
	await services.doc(serviceID).update({ currentRequests: service.currentRequests });

	//updates the request within the customer
	let customer = (await customers.doc(customerID).get()).data();
	const indexOfCustomerRequest = customer.currentRequests.findIndex(
		(element) => element.requestID === requestID
	);
	customer.currentRequests[indexOfCustomerRequest] = {
		date,
		requestID,
		serviceID,
		serviceTitle,
		status,
		time
	};
	await customers.doc(customerID).update({ currentRequests: customer.currentRequests });

	//updates the request within the business
	let business = (await businesses.doc(businessID).get()).data();
	const indexOfBusinessRequest = business.currentRequests.findIndex(
		(element) => element.requestID === requestID
	);
	business.currentRequests[indexOfBusinessRequest] = {
		date,
		time,
		requestID,
		serviceDuration,
		serviceTitle,
		serviceID,
		customerName
	};
	await businesses.doc(businessID).update({ currentRequests: business.currentRequests });

	//Sends notifications to the customer and the business
	sendNotification(
		'c-' + customerID,
		'Request Update',
		'Your request for ' + serviceTitle + ' has been updated.'
	);
	sendNotification(
		'b-' + businessID,
		'Request Update',
		customerName + 'has updated their request for ' + serviceTitle
	);

	return 0;
});

//Method taks in a requestID and completes that request in the database by giving it the status "complete", and addding it
//to the completed requests SubCollection in the customer and the business. It will also add the requestID to the isReviewDue
//array for customers
exports.completeRequest = functions.https.onCall(async (input, context) => {
	const { requestID } = input;

	//Marks the status in the requests collection
	await requests.doc(requestID).update({ status: 'complete' });
	const request = (await requests.doc(requestID).get()).data();

	//Moves the request from currentRequests to the subcollection in the customer document
	await customers
		.doc(request.customerID)
		.collection('CompletedRequests')
		.doc(requestID)
		.set({
			date: request.date,
			requestID,
			serviceID: request.serviceID,
			serviceTitle: request.serviceTitle,
			time: request.time
		});
	let customer = (await customers.doc(request.customerID).get()).data();
	const indexOfCustomerRequest = customer.currentRequests.findIndex(
		(element) => element.requestID === requestID
	);
	customer.currentRequests.splice(indexOfCustomerRequest, 1);
	await customers.doc(request.customerID).update({
		currentRequests: customer.currentRequests,
		isReviewDue: admin.firestore.FieldValue.arrayUnion(requestID)
	});

	//Moves the request from currentRequests to the subcollection in the service document
	await services
		.doc(request.serviceID)
		.collection('CompletedRequests')
		.doc(requestID)
		.set({
			customerID: request.customerID,
			customerName: request.customerName,
			date: request.date,
			requestID,
			time: request.time
		});
	let service = (await services.doc(request.serviceID).get()).data();
	const indexOfServiceRequest = service.currentRequests.findIndex(
		(element) => element.requestID === requestID
	);
	service.currentRequests.splice(indexOfServiceRequest, 1);
	await services.doc(request.serviceID).update({
		currentRequests: service.currentRequests
	});

	//Decrements the numRequests for the service and updates current requests in the business document
	let business = (await businesses.doc(service.businessID).get()).data();
	const indexOfService = business.services.findIndex(
		(element) => element.serviceID === service.serviceID
	);
	business.services[indexOfService].numCurrentRequests =
		business.services[indexOfService].numCurrentRequests - 1;
	const indexOfRequest = business.currentRequests.findIndex(
		(element) => element.requestID === requestID
	);
	business.currentRequests.splice(indexOfRequest, 1);
	await businesses.doc(service.businessID).update({
		services: business.services,
		currentRequests: business.currentRequests
	});

	return 0;
});

//Method will take in a service ID and a customer ID and then delete that customer's request from the collection and
//the corresponding array.
exports.deleteRequest = functions.https.onCall(async (input, context) => {
	const { serviceID, customerID, requestID, businessID } = input;
	const deleted = await deleteRequest(serviceID, customerID, requestID, businessID);
	return deleted;
});

//--------------------------------- Review Functions ---------------------------------

//Method is going to submit the review to the subcollection within a service. It will also update the average rating
//within the service. Additionally, if the service does not yet have three reviews for display, it will add this review
//to that array. It will also add this review to the request document itself
exports.reviewService = functions.https.onCall(async (input, context) => {
	const { serviceID, comment, customerID, customerName, requestID, reviewDate, stars } = input;

	//Adds the review to the service subcollection
	await services
		.doc(serviceID)
		.collection('Reviews')
		.doc(requestID)
		.set({
			comment,
			customerID,
			customerName,
			requestID,
			reviewDate,
			stars
		});

	const service = (await products.doc(serviceID).get()).data();

	//Calculates the new average rating for the service
	const a = service.averageRating * service.totalReviews;
	const b = a + stars;
	const c = service.totalReviews + 1;
	const newRating = b / c;
	await services.doc(serviceID).update({
		averageRating: newRating,
		totalReviews: service.totalReviews + 1
	});

	//Adds the review to the request document itself
	await requests.doc(requestID).update({
		review: {
			comment,
			customerID,
			customerName,
			requestID,
			reviewDate,
			stars
		}
	});

	//Removes the requestID from the customer's isReviewDue field
	await customers.doc(customerID).update({
		isReviewDue: admin.firestore.FieldValue.arrayRemove(requestID)
	});

	return 0;
});

//This method is going to indicate that the customer has chosen not to review a specific request by removing the requestID
//from the isReviewDue array within the customer's document
exports.skipReview = functions.https.onCall(async (input, context) => {
	const { requestID, customerID } = input;

	await customers.doc(customerID).update({
		isReviewDue: admin.firestore.FieldValue.arrayRemove(requestID)
	});
	return 0;
});

//--------------------------------- Blocking & Reporting Functions ---------------------------------

//Method will block a specific business from a customer's account. It will append the business ID to the customer's
//blockedbusinesses array. It will also submit a report to the help support team to indicate that this action was taken. This
//will be in the form of an automated email.
exports.blockBusiness = functions.https.onCall(async (input, context) => {
	const { customerID, businessID } = input;
	await customers.doc(customerID).update({
		blockedBusinesses: admin.firestore.FieldValue.arrayUnion(businessID)
	});
	return 0;
});

//Method will unblock a specific business from a customer's account by removing the businessID from the customer's array
//of blocked businesses
exports.unblockCompany = functions.https.onCall(async (input, context) => {
	const { customerID, businessID } = input;
	await customers.doc(customerID).update({
		blockedBusinesses: admin.firestore.FieldValue.arrayRemove(businessID)
	});
	return 0;
});

//Method will take in a user's ID and will send an automatic email to help containing the issue text
exports.reportIssue = functions.https.onCall(async (input, context) => {
	const { userID, issue } = input;

	sendEmail(
		'helpcocontact@gmail.com',
		'Customer Issue',
		'Customer #' + userID + ' is experiencing the following issue:\n\n' + issue
	);

	return 0;
});

//--------------------------------- Boolean Functions ---------------------------------

//This method is going to return a boolean value on whether the business app is currently under maintenance
//or not
exports.isBusinessAppUnderMaintenance = functions.https.onCall(async (input, context) => {
	const maintenance = await helpDev.doc('maintenance').get();
	return maintenance.data().businessApp;
});

//Method is going to return a boolean value on whether the customer app is currently under maintenance
//or not
exports.isCustomerAppUnderMaintenance = functions.https.onCall(async (input, context) => {
	const maintenance = await helpDev.doc('maintenance').get();
	return maintenance.data().customerApp;
});

//Method is going to return a boolean value on whether the website is currently under maintenance
//or not
exports.isWebsiteUnderMaintenance = functions.https.onCall(async (input, context) => {
	const maintenance = await helpDev.doc('maintenance').get();
	return maintenance.data().website;
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
	.document('businesses/{businessID}')
	.onUpdate(async (change, context) => {
		if (change.after.data().isVerified === true && change.before.data().isVerified === false) {
			const topic = 'b-' + change.after.data().businessID;
			await admin.messaging().sendToTopic(topic, {
				notification: {
					title: 'Your good to go',
					body: "You're account has been verified and accepted. Create your first product now!"
				}
			});
		}

		return 0;
	});

//Method is going to take in a businessID and verify them by changing the "isVerified" field
//in firestore to true, therfore triggering a notification as well. Also sends them a welcome email
exports.verifyBusiness = functions.https.onRequest(async (req, res) => {
	try {
		const { businessEmail, businessID } = req.query;

		//Actually verifies the business
		await businesses.doc(businessID).update({ isVerified: true });

		//Sends a confirmation email to the business saying they have been verified
		sendEmail(
			businessEmail,
			"You're good to go",
			"Your business has been verified on Help! We're super excited to welcome you to our family. Our goal " +
				'is to connect everyone with their local service businesses. You can now head over to the app, create your products, and get ' +
				'straight to business. For any questions, feedback, or insights, feel free to reach out to us at helpcocontact@gmail.com. ' +
				"We can't wait to see you grow.\n\nHelp LLC"
		);
		res.send('Business has been verified');
	} catch (error) {
		res.send('Error');
	}
});

//Method is going to take in a businessID and email and decline their request to be a verified
//business on Help. It will send them an email, letting them know. Then it will delete the account
//from firebase in authentication and the provider document in firestore
exports.declineBusiness = functions.https.onRequest(async (req, res) => {
	try {
		const { businessEmail, businessID } = req.query;

		//Configures the email subject, to, and from, and text, then sends the mail
		sendEmail(
			businessEmail,
			"You're good to go",
			'We regret to inform you that your business could not be verified and will not ' +
				'be able to be registered on Help. There could be multiple reasons for this. Your specific industry ' +
				'might not be currently supported on Help or your business could not be verified as a legitimate provider. ' +
				'For more information, email us at helpcocontact@gmail.com and we would be happy to assist you. You can also attempt ' +
				'to recreate your account with more updated information on your businesses and we will re-review your profile.\n\n' +
				'We apologize for the inconvenience.\n\nHelp LLC'
		);

		//Deletes the user object from firestore and deletes the user from Firebase Authentication (unless they have an existing requester object)

		const auth = admin.auth();
		await auth.deleteUser(businessID);

		await businesses.doc(businessID).create();

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
		...error
	});
});
