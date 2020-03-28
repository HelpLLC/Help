const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
	const result = await database.runTransaction(async (transaction) => {
		const snapshot = await transaction.get(services);
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
	});

	return result;
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
	await database.runTransaction(async (transaction) => {
		let request = (await transaction.get(requests.doc(requestID))).data();
		let business = (await transaction.get(businesses.doc(businessID))).data();
		const customer = (await transaction.get(customers.doc(customerID))).data();

		const indexOfService = business.services.findIndex(
			(element) => element.serviceID === serviceID
		);
		business.services[indexOfService].numCurrentRequests =
			business.services[indexOfService].numCurrentRequests - 1;
		await transaction.update(businesses.doc(businessID), {
			services: business.services
		});

		//Fetches the date from the business and formats it in a way so scheduling could be deleted within business as well
		date = new Date(request.date);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		const dateString = year + '-' + month + '-' + day;
		await transaction.update(
			businesses
				.doc(businessID)
				.collection('Schedule')
				.doc(dateString),
			{
				[requestID]: admin.firestore.FieldValue.delete()
			}
		);

		//Updates the customer document
		indexOfRequest = customer.currentRequests.findIndex(
			(element) => element.requestID === requestID
		);
		customer.currentRequests.splice(indexOfRequest, 1);
		await transaction.update(customers.doc(customerID), {
			currentRequests: customer.currentRequests
		});

		//Notifies the business that the request has been deleted.
		sendNotification(
			'b-' + request.businessID,
			'Request Cancelled',
			customer.name + ' ' + 'has cancelled their request for' + ' ' + request.serviceTitle
		);
	});

	await database.runTransaction(async (transaction) => {
		let request = (await transaction.get(requests.doc(requestID))).data();
		date = new Date(request.date);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		const dateString = year + '-' + month + '-' + day;
		//Tests if this document should be deleted all together
		const scheduleDoc = (
			await transaction.get(
				businesses
					.doc(businessID)
					.collection('Schedule')
					.doc(dateString)
			)
		).data();
		if (Object.keys(scheduleDoc).length === 1) {
			await transaction.delete(
				businesses
					.doc(businessID)
					.collection('Schedule')
					.doc(dateString)
			);
		}
		await transaction.delete(requests.doc(requestID));
	});

	return 0;
};

//--------------------------------- "Document-Object" Getters ---------------------------------

//Method returns an array with all businesses
exports.getAllBusinesses = functions.https.onCall(async (input, context) => {
	const array = await database.runTransaction(async (transaction) => {
		const snapshot = await transaction.get(businesses);
		const array = await snapshot.docs.map((doc) => doc.data());
		return array;
	});

	//Returns the array which contains all of the docs
	return array;
});

//Method returns an array with all customers
exports.getAllCustomers = functions.https.onCall(async (input, context) => {
	const array = await database.runTransaction(async (transaction) => {
		const snapshot = await transaction.get(customers);
		const array = await snapshot.docs.map((doc) => doc.data());
		return array;
	});

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
	const array = await database.runTransaction(async (transaction) => {
		const snapshot = await transaction.get(requests);
		const array = await snapshot.docs.map((doc) => doc.data());
		return array;
	});

	//Returns the array which contains all of the docs
	return array;
});

//Method fetches a service by ID & returns the service as an object. If the service does not exist, returns -1
exports.getBusinessByID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = businesses.doc(businessID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	});
	return doc;
});

//This method is going to return an array of the documents which are the analytics for this specific business. Each piece of
//data analytic will be in its own seperate document
exports.getBusinessAnalyticsByBusinessID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;
	const analyticsDocs = await database.runTransaction(async (transaction) => {
		const analyticsRef = businesses.doc(businessID).collection('Analytics');
		const Revenue = await transaction.get(analyticsRef.doc('Revenue'));
		const TopServices = await transaction.get(analyticsRef.doc('TopServices'));
		const CustomerLocations = await transaction.get(analyticsRef.doc('CustomerLocations'));

		//Resolves all of the promises asynchronosly.
		const analyticsDocs = [Revenue.data(), TopServices.data(), CustomerLocations.data()];
		return analyticsDocs;
	});
	return analyticsDocs;
});

//Method fetches a customer by ID & returns the customer as an object. If the customer does not exist, returns -1
exports.getCustomerByID = functions.https.onCall(async (input, context) => {
	const { customerID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = customers.doc(customerID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	});
	return doc;
});

//Method fetches a service by ID & returns the service as an object. If the service does not exist, returns -1
exports.getServiceByID = functions.https.onCall(async (input, context) => {
	const { serviceID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = services.doc(serviceID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	});
	return doc;
});

//Method fetches a request by ID & returns the request as an object. If the request does not exist, returns -1
exports.getRequestByID = functions.https.onCall(async (input, context) => {
	const { requestID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = requests.doc(requestID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	});
	return doc;
});

//This function will return the document for a specific day on a business schedule. If that document, doesn't exist,
//then an empty object will be returned. Accepts a day in YYYY-MM-DD format, along with a businessID
exports.getBusinessCurrentRequestsByDay = functions.https.onCall(async (input, context) => {
	const { businessID, day } = input;

	const doc = await database.runTransaction(async (transaction) => {
		const doc = await transaction.get(
			businesses
				.doc(businessID)
				.collection('Schedule')
				.doc(day)
		);
		if (doc.exists === true) {
			const data = await doc.data();
			delete data.dateString;
			return data;
		} else {
			return {};
		}
	});

	return doc;
});

//This method will get the most upcoming request for a spefici date from their request subcollection. If there are no requests,
//then -1 will be returned
exports.getUpcomingRequestByBusinessID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	const doc = await database.runTransaction(async (transaction) => {
		const query = await businesses
			.doc(businessID)
			.collection('Schedule')
			.orderBy('dateString')
			.limit(1);

		const docs = await transaction.get(query);
		if (docs.length === 0) {
			return -1;
		} else {
			const doc = await docs[0].data();
			return doc;
		}
	});

	return doc;
});

//Method will return an array of category objects. Each object will contain two fields. The first field will be the name
//of the category, and the second will be the location of the image as it is stored in Firebase Storage. The image will not actually
//be downloaded with this method. Instead you must call the method "getCategoryImageByID" to return the downloaded image
exports.getCategoryObjects = functions.https.onCall(async (input, context) => {
	const result = await database.runTransaction(async (transaction) => {
		//Fetches the array from firestore containing the categories
		const categoriesDocument = await transaction.get(helpDev.doc('categories'));
		const { arrayOfCategoriesWithImages } = categoriesDocument.data();
		return arrayOfCategoriesWithImages;
	});

	return result;
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

	const result = await database.runTransaction(async (transaction) => {
		const reviews = await transaction.get(products.doc(serviceID).collection('Reviews'));

		const arrayOfReviews = reviews.docs.map((doc) => doc.data());
		return arrayOfReviews;
	});

	return result;
});

//Method fetches the array of completed subcollection level request objects that belong to a specific customer
exports.getCompletedRequestsByCustomerID = functions.https.onCall(async (input, context) => {
	const { customerID } = input;

	const result = await database.runTransaction(async (transaction) => {
		const completedServices = await transaction.get(
			customers.doc(customerID).collection('CompletedRequests')
		);
		const arrayOfCompletedServices = completedServices.docs.map((doc) => doc.data());
		return arrayOfCompletedServices;
	});

	return result;
});

//Method is going to take in an ID of a service & return all of the completed request object that are
//associated with this service
exports.getCompletedRequestsByServiceID = functions.https.onCall(async (input, context) => {
	const { serviceID } = input;

	const result = await database.runTransaction(async (transaction) => {
		const docs = await transaction.get(services.doc(serviceID).collection('CompletedRequests'));
		const arrayOfData = docs.docs.map((doc) => doc.data());
		return arrayOfData;
	});

	return result;
});

//Method is going to fetch current requests for specific service based on the serviceID that is passed into
//the function. It will do this using firebase SDK where function
exports.getCurrentRequestsByServiceID = functions.https.onCall(async (input, context) => {
	const { serviceID } = input;

	const result = await database.runTransaction(async (transaction) => {
		let finalDocs = [];

		//Fetches all the currently requested service given all the possible different statuses
		const allRequestsForThisService = requests.where('serviceID', '==', serviceID);
		const awaitingRequests = await transaction.get(
			allRequestsForThisService.where('status', '==', 'AWAITING')
		);
		const inProgressRequests = await transaction.get(
			allRequestsForThisService.where('status', '==', 'IN_PROGRESS')
		);

		finalDocs = awaitingRequests.docs.concat(inProgressRequests.docs);
		finalDocs = finalDocs.map((doc) => doc.data());

		return finalDocs;
	});

	return result;
});

//--------------------------------- Creating Functions ---------------------------------

//Method will take in a new customer ID and then will add that customer to the firestore
//as a new customer with a unique customer ID. That customer document will have the below fields as well
exports.addCustomerToDatabase = functions.https.onCall(async (input, context) => {
	const {
		address,
		blockedBusinesses,
		country,
		state,
		coordinates,
		currentRequests,
		customerID,
		city,
		email,
		name,
		phoneNumber,
		isReviewDue
	} = input;

	const batch = database.batch();

	batch.set(customers.doc(customerID), {
		address,
		blockedBusinesses,
		country,
		state,
		coordinates,
		currentRequests,
		city,
		customerID,
		email,
		name,
		phoneNumber,
		isReviewDue
	});

	await batch.commit();

	return 0;
});

//method will take in new versions of customer inputs and will update them in firestore. Updated the customer document along
//with any customer information that is in any other documents
exports.updateCustomerInformation = functions.https.onCall(async (input, context) => {
	const {
		address,
		coordinates,
		customerID,
		city,
		name,
		phoneNumber,
		currentRequests,
		state,
		country
	} = input;

	const batch = database.batch();

	batch.update(customers.doc(customerID), {
		address,
		coordinates,
		customerID,
		country,
		state,
		city,
		name,
		phoneNumber
	});

	for (const request of currentRequests) {
		batch.update(requests.doc(request.requestID), { customerName: name });
	}
	await batch.commit();

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
		coordinates,
		email,
		location,
		services,
		website,
		businessID,
		phoneNumber,
		isVerified
	} = input;

	const batch = database.batch();

	batch.set(businesses.doc(businessID), {
		businessName,
		businessDescription,
		businessHours,
		coordinates,
		businessID,
		email,
		location,
		services,
		website,
		phoneNumber,
		isVerified
	});

	//Adds analytics documents
	const analytics = businesses.doc(businessID).collection('Analytics');
	batch.set(analytics.doc('CustomerLocations'), { Cities: {}, States: {}, Countries: {} });
	batch.create(analytics.doc('Revenue'), {});
	batch.create(analytics.doc('TopServices'), {});

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

	await batch.commit();
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

	const batch = database.batch();

	batch.update(businesses.doc(businessID), {
		businessName,
		businessDescription,
		businessHours,
		coordinates,
		location,
		website,
		phoneNumber
	});

	for (const service of business.services) {
		batch.update(services.doc(service.serviceID), { businessName });
	}

	await batch.commit();

	return 0;
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

	const batch = database.batch();

	//Fetches its ID, adds it to its own document, and then adds it to the array of business serviceIDs
	const serviceID = newServiceDocument.id;
	batch.update(services.doc(serviceID), { serviceID });

	batch.update(businesses.doc(businessID), {
		services: admin.firestore.FieldValue.arrayUnion({
			numCurrentRequests: 0,
			serviceID,
			category,
			serviceDescription,
			serviceTitle,
			priceText
		})
	});

	//Adds the service to analytics
	batch.update(
		businesses
			.doc(businessID)
			.collection('Analytics')
			.doc('TopServices'),
		{
			[serviceID]: {
				serviceTitle,
				serviceID,
				totalViews: 0,
				totalRequests: 0,
				totalRevenue: 0
			}
		}
	);

	await batch.commit();

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

	const batch = database.batch();

	batch.update(services.doc(serviceID), {
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

	await batch.commit();

	const result = await database.runTransaction(async (transaction) => {
		//Updates the business document with the new information
		let business = (await transaction.get(businesses.doc(businessID))).data();
		const indexOfService = business.services.findIndex(
			(element) => element.serviceID === serviceID
		);
		business.services[indexOfService] = {
			...business.services[indexOfService],
			serviceTitle,
			priceText,
			serviceDescription
		};
		await transaction.update(businesses.doc(businessID), {
			services: business.services
		});

		//Updates the service title in analytics
		const fieldName = serviceID + '.serviceTitle';
		await transaction.update(
			businesses
				.doc(businessID)
				.collection('Analytics')
				.doc('TopServices'),
			{
				[fieldName]: serviceTitle
			}
		);

		return 0;
	});

	return result;
});

//Method is going to remove a business's reference to a service as well as give this service
//a "isDeleted" field of true to make sure it does not appear for customers. It will still remain in the database
//so it can be referenced to in a customer's order history and/or reviews. Additionally, it is going to remove
//all exisitng requests that are in this service & send customers notifications saying the service has been
//deleted
exports.deleteService = functions.https.onCall(async (input, context) => {
	const { serviceID, businessID } = input;

	const batch = database.batch();

	batch.update(services.doc(serviceID), {
		isDeleted: true
	});

	batch.update(businesses.doc(businessID), {
		serviceIDs: admin.firestore.FieldValue.arrayRemove(serviceID)
	});

	await batch.commit();

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
	let {
		assignedTo,
		businessID,
		customerID,
		customerLocation,
		cash,
		card,
		date,
		questions,
		price,
		priceText,
		review,
		serviceTitle,
		customerName,
		serviceDuration,
		requestedOn,
		serviceID,
		status,
		time
	} = input;

	const batch = database.batch();

	//If this is a request being edited, the old request document will be edited, else it will be added
	const newRequestDoc = await requests.add({
		assignedTo,
		businessID,
		customerID,
		cash,
		customerLocation,
		card,
		date,
		price,
		priceText,
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

	batch.update(requests.doc(requestID), { requestID });

	//Adds a reference to the request to the customer's array of currentRequests
	batch.update(customers.doc(customerID), {
		currentRequests: admin.firestore.FieldValue.arrayUnion({
			date,
			requestID,
			serviceID,
			serviceTitle,
			status,
			time
		})
	});

	await batch.commit();

	const result = await database.runTransaction(async (transaction) => {
		//Converts the date to YYYY-MM-DD format and adds the current request to the business's schedule subcollection
		const dateObject = new Date(date);
		let year = dateObject.getFullYear();
		let month = dateObject.getMonth() + 1;
		let day = dateObject.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		const dateString = year + '-' + month + '-' + day;
		const dateDocPath = businesses
			.doc(businessID)
			.collection('Schedule')
			.doc(dateString);
		const dateDoc = await transaction.get(dateDocPath);
		//Increments the numRequests for the service. Also adds scheduling information for the business
		let business = (await transaction.get(businesses.doc(businessID))).data();
		const indexOfService = business.services.findIndex(
			(element) => element.serviceID === serviceID
		);
		business.services[indexOfService].numCurrentRequests =
			business.services[indexOfService].numCurrentRequests + 1;
		await transaction.update(businesses.doc(businessID), {
			services: business.services
		});

		//Updates the analytics for the business
		const fieldName = serviceID + '.totalRequests';
		await transaction.update(
			businesses
				.doc(businessID)
				.collection('Analytics')
				.doc('TopServices'),
			{
				[fieldName]: admin.firestore.FieldValue.increment(1)
			}
		);

		if (dateDoc.exists === true) {
			await transaction.update(dateDocPath, {
				[requestID]: {
					date,
					time,
					requestID,
					serviceDuration,
					serviceTitle,
					serviceID,
					customerName
				}
			});
		} else {
			await transaction.set(dateDocPath, {
				dateString,
				[requestID]: {
					date,
					time,
					requestID,
					serviceDuration,
					serviceTitle,
					serviceID,
					customerName
				}
			});
		}

		return 0;
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

	return result;
});

//Method is going to edit a request by it's ID as well as update any fields necessary in the current requests arrays
//of the customer and the service.
exports.updateCustomerRequest = functions.https.onCall(async (input, context) => {
	let {
		requestID,
		customerID,
		businessID,
		date,
		customerLocation,
		serviceDuration,
		questions,
		time,
		serviceTitle,
		status,
		serviceID,
		customerName
	} = input;

	const result = await database.runTransaction(async (transaction) => {
		//updates the request within the customer
		let customer = (await transaction.get(customers.doc(customerID))).data();
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
		await transaction.update(customers.doc(customerID), {
			currentRequests: customer.currentRequests
		});

		await transaction.update(requests.doc(requestID), {
			date,
			questions,
			customerLocation,
			time
		});

		//updates the request within the business and fetches correct date format to do so
		const dateObject = new Date(date);
		let year = dateObject.getFullYear();
		let month = dateObject.getMonth() + 1;
		let day = dateObject.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		const dateString = year + '-' + month + '-' + day;
		await transaction.update(
			businesses
				.doc(businessID)
				.collection('Schedule')
				.doc(dateString),
			{
				[requestID]: {
					date,
					time,
					requestID,
					serviceDuration,
					serviceTitle,
					serviceID,
					customerName
				}
			}
		);
	});

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

	return result;
});

//Method taks in a requestID and completes that request in the database by giving it the status "complete", and addding it
//to the completed requests SubCollection in the customer and the business. It will also add the billing accordingly to the
//customer's side (unless the service was marked as cash). It will also mark the request as awaiting review from the customer
exports.completeRequest = functions.https.onCall(async (input, context) => {
	let { cash, requestID, billedAmount } = input;

	const batch = database.batch();

	billedAmount = parseFloat(billedAmount);

	//If the service is purchased through cash, then the request will simply be marked as complete.
	if (cash === true) {
		//Marks the status in the requests collection
		batch.update(requests.doc(requestID), { billedAmount, status: 'COMPLETE' });
		await batch.commit();

		await database.runTransaction(async (transaction) => {
			const request = (await transaction.get(requests.doc(requestID))).data();
			let customer = (await transaction.get(customers.doc(request.customerID))).data();
			let businessDoc = businesses.doc(request.businessID);
			let business = (await transaction.get(businessDoc)).data();

			//Moves the request from currentRequests to the subcollection in the customer document and adds the requestID to
			//the customer's isReviewDue array
			await transaction.set(
				customers
					.doc(request.customerID)
					.collection('CompletedRequests')
					.doc(requestID),
				{
					date: request.date,
					requestID,
					serviceID: request.serviceID,
					serviceTitle: request.serviceTitle,
					time: request.time,
					billedAmount
				}
			);
			const indexOfCustomerRequest = customer.currentRequests.findIndex(
				(element) => element.requestID === requestID
			);
			customer.currentRequests.splice(indexOfCustomerRequest, 1);
			await transaction.update(customers.doc(request.customerID), {
				currentRequests: customer.currentRequests,
				isReviewDue: admin.firestore.FieldValue.arrayUnion(requestID)
			});

			//Moves the request from currentRequests to the subcollection in the service document
			await transaction.set(
				services
					.doc(request.serviceID)
					.collection('CompletedRequests')
					.doc(requestID),
				{
					customerID: request.customerID,
					customerName: request.customerName,
					date: request.date,
					requestID,
					time: request.time,
					billedAmount
				}
			);

			//Decrements the numRequests for the service and updates current requests in the business document
			const indexOfService = business.services.findIndex(
				(element) => element.serviceID === request.serviceID
			);
			business.services[indexOfService].numCurrentRequests =
				business.services[indexOfService].numCurrentRequests - 1;
			await transaction.update(businessDoc, {
				services: business.services
			});

			//Gets the correct format of the date string and removes the current request from the business schedule
			let date = request.date;
			date = new Date(date);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			const dateString = year + '-' + month + '-' + day;

			//Updates the revenue analytics for this business
			await transaction.update(businessDoc.collection('Analytics').doc('Revenue'), {
				[year]: admin.firestore.FieldValue.increment(billedAmount),
				[year + '-' + month]: admin.firestore.FieldValue.increment(billedAmount)
			});

			//Updates the service analytics for this service
			const fieldName = request.serviceID + '.totalRevenue';
			await transaction.update(businessDoc.collection('Analytics').doc('TopServices'), {
				[fieldName]: admin.firestore.FieldValue.increment(billedAmount)
			});

			//Updates the customer analytics for this service
			const cityFieldName = 'Cities.' + request.customerLocation.city;
			const stateFieldName = 'States.' + request.customerLocation.state;
			const countryFieldName = 'Countries.' + request.customerLocation.country;
			await transaction.update(businessDoc.collection('Analytics').doc('CustomerLocations'), {
				[cityFieldName]: admin.firestore.FieldValue.increment(1),
				[stateFieldName]: admin.firestore.FieldValue.increment(1),
				[countryFieldName]: admin.firestore.FieldValue.increment(1)
			});

			await transaction.update(businessDoc.collection('Schedule').doc(dateString), {
				[requestID]: admin.firestore.FieldValue.delete()
			});
		});
		await database.runTransaction(async (transaction) => {
			//Tests if this document should be deleted all together
			const request = (await transaction.get(requests.doc(requestID))).data();
			let businessDoc = businesses.doc(request.businessID);
			const scheduleDoc = (
				await transaction.get(businessDoc.collection('Schedule').doc(dateString))
			).data();

			let date = request.date;
			date = new Date(date);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			const dateString = year + '-' + month + '-' + day;

			if (Object.keys(scheduleDoc).length === 1) {
				await transaction.delete(businessDoc.collection('Schedule').doc(dateString));
			}
		});
	} else {
		//This means the service is through a card payment, through which billing will be correctly set up
	}

	return 0;
});

//Method will take in a service ID and a customer ID and then delete that customer's request from the collection and
//the corresponding array.
exports.deleteRequest = functions.https.onCall(async (input, context) => {
	const { serviceID, customerID, requestID, businessID } = input;
	const deleted = await deleteRequest(serviceID, customerID, requestID, businessID);
	return deleted;
});

//This function will record within a service's analytics that the service has been viewed by a user. It will
//take in a businessID and a serviceID so it can update the document accordingly.
exports.viewService = functions.https.onCall(async (input, context) => {
	const { serviceID, businessID } = input;

	const batch = database.batch();
	const fieldName = serviceID + '.totalViews';
	batch.update(
		businesses
			.doc(businessID)
			.collection('Analytics')
			.doc('TopServices'),
		{
			[fieldName]: admin.firestore.FieldValue.increment(1)
		}
	);

	await batch.commit();
	return 0;
});

//--------------------------------- Review Functions ---------------------------------

//Method is going to submit the review to the subcollection within a service. It will also update the average rating
//within the service. Additionally, if the service does not yet have three reviews for display, it will add this review
//to that array. It will also add this review to the request document itself
exports.reviewService = functions.https.onCall(async (input, context) => {
	const { serviceID, comment, customerID, customerName, requestID, reviewDate, stars } = input;

	const result = await database.runTransaction(async (transaction) => {
		const service = (await transaction.get(products.doc(serviceID))).data();

		//Adds the review to the service subcollection
		await transaction.set(
			services
				.doc(serviceID)
				.collection('Reviews')
				.doc(requestID),
			{
				comment,
				customerID,
				customerName,
				requestID,
				reviewDate,
				stars
			}
		);

		//Calculates the new average rating for the service
		const a = service.averageRating * service.totalReviews;
		const b = a + stars;
		const c = service.totalReviews + 1;
		const newRating = b / c;
		await transaction.update(services.doc(serviceID), {
			averageRating: newRating,
			totalReviews: service.totalReviews + 1
		});

		//Adds the review to the request document itself
		await transaction.update(requests.doc(requestID), {
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
		await transaction.update(customers.doc(customerID), {
			isReviewDue: admin.firestore.FieldValue.arrayRemove(requestID)
		});
	});

	return 0;
});

//This method is going to indicate that the customer has chosen not to review a specific request by removing the requestID
//from the isReviewDue array within the customer's document
exports.skipReview = functions.https.onCall(async (input, context) => {
	const { requestID, customerID } = input;

	const batch = database.batch();
	batch.update(customers.doc(customerID), {
		isReviewDue: admin.firestore.FieldValue.arrayRemove(requestID)
	});

	await batch.commit();
	return 0;
});

//--------------------------------- Blocking & Reporting Functions ---------------------------------

//Method will block a specific business from a customer's account. It will append the business ID to the customer's
//blockedbusinesses array. It will also submit a report to the help support team to indicate that this action was taken. This
//will be in the form of an automated email.
exports.blockBusiness = functions.https.onCall(async (input, context) => {
	const { customerID, businessID } = input;

	const batch = database.batch();
	batch.update(customers.doc(customerID), {
		blockedBusinesses: admin.firestore.FieldValue.arrayUnion(businessID)
	});
	await batch.commit();
	return 0;
});

//Method will unblock a specific business from a customer's account by removing the businessID from the customer's array
//of blocked businesses
exports.unblockCompany = functions.https.onCall(async (input, context) => {
	const { customerID, businessID } = input;

	const batch = database.batch();
	batch.update(customers.doc(customerID), {
		blockedBusinesses: admin.firestore.FieldValue.arrayRemove(businessID)
	});
	await batch.commit();
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
	const result = await database.runTransaction(async (transaction) => {
		const maintenance = await transaction.get(helpDev.doc('maintenance'));
		return maintenance.data().businessApp;
	});

	return result;
});

//Method is going to return a boolean value on whether the customer app is currently under maintenance
//or not
exports.isCustomerAppUnderMaintenance = functions.https.onCall(async (input, context) => {
	const result = await database.runTransaction(async (transaction) => {
		const maintenance = await transaction.get(helpDev.doc('maintenance'));
		return maintenance.data().customerApp;
	});

	return result;
});

//Method is going to return a boolean value on whether the website is currently under maintenance
//or not
exports.isWebsiteUnderMaintenance = functions.https.onCall(async (input, context) => {
	const result = await database.runTransaction(async (transaction) => {
		const maintenance = await transaction.get(helpDev.doc('maintenance'));
		return maintenance.data().website;
	});

	return result;
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

		const batch = database.batch();

		//Actually verifies the business
		batch.update(businesses.doc(businessID), { isVerified: true });
		await batch.commit();

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

		const batch = database.batch();

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

		batch.delete(businesses.doc(businessID));
		await batch.commit();

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
