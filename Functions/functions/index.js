/*eslint no-useless-escape: "error"*/
/* eslint-disable no-await-in-loop */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://help-technologies-e4e1c.firebaseio.com',
	storageBucket: 'help-technologies-e4e1c.appspot.com',
});
//Configures email for automated emails
const nodemailer = require('nodemailer');
const { firestore } = require('firebase-admin');
const mailTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'helpcocontact@gmail.com',
		pass: 'techBusiness123',
	},
	tls: {
		rejectUnauthorized: false,
	},
});

//Sets up Stripe for payments
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';

//--------------------------------- Global Variables ---------------------------------

const database = admin.firestore();
const storage = admin.storage().bucket();
const fcm = admin.messaging();

const businesses = database.collection('businesses');
const customers = database.collection('customers');
const services = database.collection('services');
const requests = database.collection('requests');
const customRequests = database.collection('customRequests');
const issues = database.collection('issues');
const helpDev = database.collection('helpDev');
const employees = database.collection('employees')

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
			body,
		},
	});
	return 0;
};

// This function will take in a date object and will convert it to a string in a YYYY-MM-DD format
const convertDateToString = (dateObject) => {
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

	return dateString;
};

//Sends an automatic email to a specified email. Takes in the email subject, the recepient, and the text
const sendEmail = async (recepient, subject, text) => {
	//Configures the email subject, to, and from
	const mailOptions = {
		from: 'Help <helpcocontact@gmail.com>',
		to: recepient,
		subject,
		text,
	};

	await mailTransport.sendMail(mailOptions);

	return 0;
};

//Method will take in a service ID and a customer ID and a requestID and a businessID and then delete that customer's request
//from the service's current requests.
const deleteRequest = async (requestID) => {
	await database.runTransaction(async (transaction) => {
		let request = (await transaction.get(requests.doc(requestID))).data();
		let business = (await transaction.get(businesses.doc(request.businessID))).data();
		const customer = request.customerID ? (await transaction.get(customers.doc(request.customerID))).data() : null;

		const indexOfService = business.services.findIndex(
			(element) => element.serviceID === request.serviceID
		);
		business.services[indexOfService].numCurrentRequests =
			business.services[indexOfService].numCurrentRequests - 1;
		await transaction.update(businesses.doc(request.businessID), {
			services: business.services,
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
			businesses.doc(request.businessID).collection('Private').doc('Private Data').collection('Schedule').doc(dateString),
			{
				[requestID]: admin.firestore.FieldValue.delete(),
			}
		);

		//Updates the customer document
		if(customer) {
			indexOfRequest = customer.currentRequests.findIndex(
				(element) => element.requestID === requestID
			);
			customer.currentRequests.splice(indexOfRequest, 1);
			await transaction.update(customers.doc(request.customerID), {
				currentRequests: customer.currentRequests,
			});
		}

		//Notifies the business that the request has been deleted.
		sendNotification(
			'b-' + request.businessID,
			'Request Cancelled',
			customer.name + ' ' + 'has cancelled their request for' + ' ' + request.serviceTitle
		);

		//Notifies the customer that the request has been deleted.
		if(customer) sendNotification(
			'b-' + request.customerID,
			'Request Cancelled',
			'Your request for ' + request.serviceTitle + ' has been cancelled by the business.'
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
				businesses.doc(request.businessID).collection('Private').doc('Private Data').collection('Schedule').doc(dateString)
			)
		).data();
		if (Object.keys(scheduleDoc).length === 1) {
			await transaction.delete(
				businesses.doc(request.businessID).collection('Private').doc('Private Data').collection('Schedule').doc(dateString)
			);
		}
		await transaction.delete(requests.doc(requestID));
	});

	return 0;
};

const getBusinessCurrentRequestsByDay = async (businessID, day) => {
	const doc = await database.runTransaction(async (transaction) => {
		const doc = await transaction.get(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Schedule').doc(day));
		if (doc.exists === true) {
			const data = await doc.data();
			delete data.dateString;
			//Structures the requests as an array
			const finalArray = [];
			for (const objectKey of Object.keys(data)) {
				finalArray.push(data[objectKey]);
			}
			return finalArray;
		} else {
			return [];
		}
	});
	return doc;
};

//--------------------------------- Miscellaneous Functions ---------------------------------

//Method send to a recpeint from the company email. Accepts a text, subject, and a recepient
exports.sendEmail = functions.https.onCall(async (input, context) => {
	const { recepient, subject, text } = input;

	try {
		await sendEmail(recepient, subject, text);
		return 0;
	} catch (error) {
		return -1;
	}
});

//--------------------------------- Alert Functions ---------------------------------

//function for adding an alert to the database
async function AddAlertToBusiness(businessID, title, description, type){
	const batch = database.batch();

	const newAlert = await businesses.doc(businessID+"").collection('Private').doc('Private Data').collection('Alerts').add({
		title,
		description,
		type,
		recieved: new Date().toUTCString(),
	});
	
	const alertID = newAlert.id;
	batch.update(businesses.doc(businessID+"").collection('Private').doc('Private Data').collection('Alerts').doc(alertID), { alertID });
	
	await batch.commit();
} 

//retrieve all alerts for a business
exports.retrieveBusinessAlerts = functions.https.onCall(async (input, context) => {
	const { businessID } = input;
	const array = await database.runTransaction(async (transaction) => {
		const ref = businesses.doc(businessID+"").collection('Private').doc('Private Data').collection('Alerts');
		const snapshot = await transaction.get(ref);
		const array = await snapshot.docs.map((doc) => doc.data());
		return array;
	});

	//Returns the array which contains all of the docs
	return array;
});

//remove or delete an alert from the business alerts
exports.deleteBusinessAlert = functions.https.onCall(async (input, context) => {
	const { businessID, alertID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		return transaction.delete(businesses.doc(businessID+"").collection('Private').doc('Private Data').collection('Alerts').doc(alertID+""));
	});
});

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

//Method fetches a notifications for a business by business ID
// exports.getBusinessNotifications = functions.https.onCall(async (input, context) => {
// 	const { businessID } = input;
// 	const doc = await database.runTransaction(async (transaction) => {
// 		const query1 = await employees
// 			.where('businessID', '==', businessID)
// 			.where('isVerified', '==', false);
// 		const newEmployees = (await transaction.get(query1)).docs;
// 		for(let i in newEmployees)
// 			newEmployees[i].type = 'employeeRequest';

// 		const query2 = await requests
// 			.where('businessID', '==', businessID)
// 			.where('confirmed', '==', false);
// 		const newRequests = (await transaction.get(query2)).docs;
// 		for(let i in newRequests)
// 			newRequests[i].type = 'serviceRequest';

// 		return [...newEmployees, ...newRequests];
// 	});

// 	return doc;
// });

//Method fetches a business by ID & returns the business as an object. If the business does not exist, returns -1
exports.getBusinessByID = functions.https.onCall(async (input, context) => {
	const { documentID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = businesses.doc(documentID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	});
	return doc;
});

//Method fetches all employees from a business
exports.getEmployeesByBusinessID = functions.https.onCall(async (input, context) => {
	const { documentID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = businesses.doc(documentID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data().employees;
		} else {
			return -1;
		}
	});
	return doc;
});

//Method fetches all employees from a business
exports.getEmployeesAvailableForRequest = functions.https.onCall(async (input, context) => {
	const { 
		businessID,
		startTime,
		endTime,
		date
	} = input;
	const startString = date + 'T'+startTime;
	const endString = date + 'T'+endTime;
	const doc = await database.runTransaction(async (transaction) => {
		const doc = await transaction.get(businesses.doc(businessID + ''));

		if (doc.exists) {
			const employees = doc.data().employees;
			let availableEmployees = {};
			for(const i in employees){
				const employee = await transaction.get(employees.doc(i + '')).data();
				let bottomIndex = -1;
				let topIndex = employee.timesAvailible.length;
				let currentIndex = (topIndex - bottomIndex) / 2 + bottomIndex;
				while(currentIndex != bottomIndex){
					if(startTime > employee.timesAvailible[currentIndex])
						bottomIndex = currentIndex;
					else if(startTime < employee.timesAvailible[currentIndex])
						topIndex = currentIndex;
					else break;
					currentIndex = (topIndex - bottomIndex) / 2 + bottomIndex;
				}
				bottomIndex = ++currentIndex;
				topIndex = currentIndex;
				while(endTime > employee.timesAvailible[topIndex])
					topIndex++;
				if(bottomIndex != topIndex) continue;
				else if(currentIndex % 2 == 1) continue;
				else availableEmployees[i] = employees[i];
			}
			return availableEmployees;
		} else {
			return -1;
		}
	});
	return doc;
});

//Method fetches an employee by ID
exports.getEmployeeByID = functions.https.onCall(async (input, context) => {
	const { employeeID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = employees.doc(employeeID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	});
	return doc;
});

//Method fetches all time off requests
exports.getTimeOffRequestsByBusinessID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;
	const doc = await database.runTransaction(async (transaction) => {
		const ref = businesses.doc(businessID + '');
		const doc = await transaction.get(ref);

		if (doc.exists) {
			return doc.data().timeOff;
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
		const analyticsRef = businesses.doc(businessID).collection('Private').doc('Private Data').collection('Analytics');
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
//then an empty array will be returned. Accepts a day in YYYY-MM-DD format, along with a businessID
exports.getBusinessCurrentRequestsByDay = functions.https.onCall(async (input, context) => {
	const { businessID, day } = input;

	const doc = await getBusinessCurrentRequestsByDay(businessID, day);

	return doc;
});

// This function will take in a start date in the format YYYY-MM-DD and will fetch requests for the amount
// of timeframe which will be the limit parameter. The limit parameter is non-inclusive
exports.getBusinessCurrentRequestsByTimeFrame = functions.https.onCall(async (input, context) => {
	const { businessID, start, limit } = input;

	const startDate = new Date(start);
	const endDate = new Date(limit);

	const promises = [];

	const scheduleDocumentIDs = (
		await businesses.doc(businessID).collection('Private').doc('Private Data').collection('Schedule').listDocuments()
	).map((doc) => doc.id);

	const indexToStartAt = scheduleDocumentIDs.findIndex((ID) => {
		return new Date(ID).getTime() - startDate.getTime() >= 0;
	});

	let indexToEndAt = scheduleDocumentIDs.findIndex((ID) => {
		return new Date(ID).getTime() - endDate.getTime() >= 0;
	});

	const IDsToFetch = scheduleDocumentIDs.slice(indexToStartAt, indexToEndAt);

	for (const ID of IDsToFetch) {
		promises.push(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Schedule').doc(ID).get());
	}

	let result = await Promise.all(promises);
	const finalArray = [];
	for (const eachDay of result) {
		const dayArray = [];

		const finalDoc = eachDay.data();
		delete finalDoc.dateString;
		for (const requestID of Object.keys(finalDoc)) {
			dayArray.push(finalDoc[requestID]);
		}
		finalArray.push(dayArray);
	}

	return finalArray;
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
		const docs = (await transaction.get(query)).docs;
		if (docs.length === 0) {
			return [];
		} else {
			const doc = await docs[0].data();
			delete doc.dateString;
			const finalArray = [];
			for (const key of Object.keys(doc)) {
				finalArray.push(doc[key]);
			}

			return finalArray;
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

//This method will return all the services associated with a certain category which will be passed in as a parameter
exports.getServicesByCategory = functions.https.onCall(async (input, context) => {
	const { categoryName } = input;
	//creates the new array
	const allFilteredDocs = await services.where('category', '==', categoryName).get();
	let filteredServices = allFilteredDocs.docs.map((doc) => doc.data());
	filteredServices = filteredServices.filter((service) => service.serviceTitle !== '');

	return filteredServices;
});

//This method will return all the services associated with a certain category which will be passed in as a parameter
exports.getServicesByBusinessID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	const result = await database.runTransaction(async (transaction) => {
		const services = await transaction.get(businesses.doc(businessID).collection('Services'));

		const arrayOfServices = services.docs.map((doc) => doc.data());
		return arrayOfServices;
	});

	return result;
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
	const { serviceID, limit } = input;

	const result = await database.runTransaction(async (transaction) => {
		// Limits the amount of responses if we need to
		let query = '';
		if (typeof limit === 'number') {
			query = services.doc(serviceID).collection('CompletedRequests').orderBy('date').limit(limit);
		} else {
			query = services.doc(serviceID).collection('CompletedRequests').orderBy('date');
		}

		const docs = await transaction.get(query);
		const arrayOfData = docs.docs.map((doc) => doc.data());

		//Sorts the documents by time and date
		arrayOfData.sort((a, b) => {
			const aDate = new Date(a.date);
			const bDate = new Date(b.date);
			if (aDate.getTime() - bDate.getTime() === 0) {
				let aTime = a.time;
				let bTime = b.time;

				const aTimePeriod = aTime.split(' ')[1];
				const bTimePeriod = bTime.split(' ')[1];
				const aTimeString = aTime.split(' ')[0];
				const bTimeString = bTime.split(' ')[0];

				let aHour = aTimeString.split(':')[0];
				let aMinute = aTimeString.split(':')[1];
				let bHour = bTimeString.split(':')[0];
				let bMinute = bTimeString.split(':')[1];

				if (aTimePeriod === 'PM' && aHour !== '12') {
					aHour = parseInt(aHour) + 12;
				}
				if (bTimePeriod === 'PM' && bHour !== '12') {
					bHour = parseInt(bHour) + 12;
				}
				aTime = aHour * 60 + aMinute;
				bTime = bHour * 60 + bMinute;

				return aTime - bTime;
			} else {
				return aDate.getTime() - bDate.getTime();
			}
		});
		return arrayOfData;
	});

	return result;
});

//This method is going to fetch the confirmed requests for a specific service. It will take in a service ID parameter
//and a limit parameter. If that limit parameter is not a number, then the method will fetch ALL the confirmed requests. If
//it is a number, then that will be the number of requests it fetches. It will fetch them in order of the nearest date
exports.getConfirmedRequestsByServiceID = functions.https.onCall(async (input, context) => {
	const { serviceID, limit } = input;
	const confirmedRequests = requests
		.where('serviceID', '==', serviceID)
		.where('status', '==', 'REQUESTED')
		.where('confirmed', '==', true);
	let query = '';
	if (typeof limit === 'number') {
		query = await confirmedRequests.limit(limit).get();
	} else {
		query = await confirmedRequests.get();
	}
	const docs = query.docs.map((doc) => doc.data());

	//Sorts the documents by time and date
	docs.sort((a, b) => {
		const aDate = new Date(a.date);
		const bDate = new Date(b.date);
		if (aDate.getTime() - bDate.getTime() === 0) {
			let aTime = a.time;
			let bTime = b.time;

			const aTimePeriod = aTime.split(' ')[1];
			const bTimePeriod = bTime.split(' ')[1];
			const aTimeString = aTime.split(' ')[0];
			const bTimeString = bTime.split(' ')[0];

			let aHour = aTimeString.split(':')[0];
			let aMinute = aTimeString.split(':')[1];
			let bHour = bTimeString.split(':')[0];
			let bMinute = bTimeString.split(':')[1];

			if (aTimePeriod === 'PM' && aHour !== '12') {
				aHour = parseInt(aHour) + 12;
			}
			if (bTimePeriod === 'PM' && bHour !== '12') {
				bHour = parseInt(bHour) + 12;
			}
			aTime = aHour * 60 + aMinute;
			bTime = bHour * 60 + bMinute;

			return aTime - bTime;
		} else {
			return aDate.getTime() - bDate.getTime();
		}
	});

	return docs;
});

//This method is going to fetch the unconfirmed requests for a specific service. It will take in a service ID parameter
//and a limit parameter. If that limit parameter is not a number, then the method will fetch ALL the unconfirmed requests. If
//it is a number, then that will be the number of requests it fetches. It will fetch them in order of the nearest date
exports.getUnconfirmedRequestsByServiceID = functions.https.onCall(async (input, context) => {
	const { serviceID, limit } = input;
	const confirmedRequests = requests
		.where('serviceID', '==', serviceID)
		.where('status', '==', 'REQUESTED')
		.where('confirmed', '==', false);
	let query = '';
	if (typeof limit === 'number') {
		query = await confirmedRequests.limit(limit).get();
	} else {
		query = await confirmedRequests.get();
	}
	const docs = query.docs.map((doc) => doc.data());
	//Sorts the documents by time and date
	docs.sort((a, b) => {
		const aDate = new Date(a.date);
		const bDate = new Date(b.date);
		if (aDate.getTime() - bDate.getTime() === 0) {
			let aTime = a.time;
			let bTime = b.time;

			const aTimePeriod = aTime.split(' ')[1];
			const bTimePeriod = bTime.split(' ')[1];
			const aTimeString = aTime.split(' ')[0];
			const bTimeString = bTime.split(' ')[0];

			let aHour = aTimeString.split(':')[0];
			let aMinute = aTimeString.split(':')[1];
			let bHour = bTimeString.split(':')[0];
			let bMinute = bTimeString.split(':')[1];

			if (aTimePeriod === 'PM' && aHour !== '12') {
				aHour = parseInt(aHour) + 12;
			}
			if (bTimePeriod === 'PM' && bHour !== '12') {
				bHour = parseInt(bHour) + 12;
			}
			aTime = aHour * 60 + aMinute;
			bTime = bHour * 60 + bMinute;

			return aTime - bTime;
		} else {
			return aDate.getTime() - bDate.getTime();
		}
	});
	return docs;
});

// This method is going to return an array of upcoming unconfirmed requests based on the businessID. It will
// also take in a limit parameter that returns only a set amount of those unconfirmed requests
exports.getUnconfirmedRequestsByBusinessID = functions.https.onCall(async (input, context) => {
	const { businessID, limit } = input;

	const unconfirmedRequests = requests
		.where('businessID', '==', businessID)
		.where('confirmed', '==', false);
	let query = '';
	if (typeof limit === 'number') {
		query = await unconfirmedRequests.limit(limit).get();
	} else {
		query = await unconfirmedRequests.get();
	}
	const docs = query.docs.map((doc) => doc.data());
	//Sorts the documents by time and date
	docs.sort((a, b) => {
		const aDate = new Date(a.date);
		const bDate = new Date(b.date);
		if (aDate.getTime() - bDate.getTime() === 0) {
			let aTime = a.time;
			let bTime = b.time;

			const aTimePeriod = aTime.split(' ')[1];
			const bTimePeriod = bTime.split(' ')[1];
			const aTimeString = aTime.split(' ')[0];
			const bTimeString = bTime.split(' ')[0];

			let aHour = aTimeString.split(':')[0];
			let aMinute = aTimeString.split(':')[1];
			let bHour = bTimeString.split(':')[0];
			let bMinute = bTimeString.split(':')[1];

			if (aTimePeriod === 'PM' && aHour !== '12') {
				aHour = parseInt(aHour) + 12;
			}
			if (bTimePeriod === 'PM' && bHour !== '12') {
				bHour = parseInt(bHour) + 12;
			}
			aTime = aHour * 60 + aMinute;
			bTime = bHour * 60 + bMinute;

			return aTime - bTime;
		} else {
			return aDate.getTime() - bDate.getTime();
		}
	});
	return docs;
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
		paymentInformation,
		customerID,
		city,
		email,
		name,
		phoneNumber,
		isReviewDue,
	} = input;

	const batch = database.batch();

	batch.set(customers.doc(customerID), {
		address,
		blockedBusinesses,
		country,
		state,
		paymentInformation,
		coordinates,
		currentRequests,
		city,
		customerID,
		email,
		name,
		phoneNumber,
		isReviewDue,
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
		paymentInformation,
		currentRequests,
		state,
		country,
	} = input;

	const batch = database.batch();

	batch.update(customers.doc(customerID), {
		address,
		coordinates,
		paymentInformation,
		customerID,
		country,
		state,
		city,
		name,
		phoneNumber,
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
		website,
		businessID,
		paymentSetupStatus,
		phoneNumber,
		isVerified,
		employeeCode,
	} = input;

	const batch = database.batch();

	const newBusinessDoc = await businesses.add({
		businessName,
		businessDescription,
		businessHours,
		businessName,
		coordinates,
		paymentSetupStatus,
		email,
		isVerified,
		phoneNumber,
		timeoff: "",
		location,
		website,
	});
	
	const documentID = newBusinessDoc.id;
	batch.update(businesses.doc(documentID), { documentID });

	//creating the employee, private, and services subcollections
	const employees = businesses.doc(documentID).collection('Employees');
	employees.add({});
	const services = businesses.doc(documentID).collection('Services');
	services.add({});
	const private = businesses.doc(documentID).collection('Private');
	batch.create(private.doc("Private Data"), {businessID, businessJoinCode: employeeCode, paymentInformation:{}});

	//Adds analytics documents
	const analytics = private.doc("Private Data").collection('Analytics');
	batch.set(analytics.doc('CustomerLocations'), { Cities: {}, States: {}, Countries: {} });
	batch.create(analytics.doc('Revenue'), {});
	batch.create(analytics.doc('TopServices'), {});

	//add doc for storing transactions
	const transactions = private.doc("Private Data").collection('Transactions');
	batch.set(transactions.doc(new Date().getTime()), {}); 

	function getDateString(){
		let date = new Date();
		return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
	}

	//add doc for storing schedule
	const schedule = private.doc("Private Data").collection('Schedule');
	batch.set(schedule.doc(getDateString()), {}); 

	//add doc for storing alerts
	const alerts = private.doc("Private Data").collection('Alerts');
	batch.set(alerts.doc(""), {}); 

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
			'Business Employee Code: ' +
			employeeCode +
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
	return documentID;
});

//This function is going to take in fields for a business and a businessID and update that business's information in
//firestore. It will also update any existing references to the business from existing documents
exports.updateBusinessInformation = functions.https.onCall(async (input, context) => {
	const { businessID, updates } = input;

	if (updates.businessName) {
		const result = await database.runTransaction(async (transaction) => {
			const business = (await transaction.get(businesses.doc(businessID))).data();

			for (const service of business.services) {
				await transaction.update(services.doc(service.serviceID), {
					businessName: updates.businessName,
				});
			}

			await transaction.update(businesses.doc(businessID), updates);
			return 0;
		});
		return result;
	} else {
		const batch = database.batch();

		batch.update(businesses.doc(businessID), updates);

		await batch.commit();
		return 0;
	}
});

exports.addEmployeeToDatabase = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the employee
		name,
		email,
		phoneNumber,
		employeeID,
		businessID,
	} = input;

	const batch = database.batch();

	batch.set(employees.doc(employeeID), {
		name,
		email,
		phoneNumber,
		employeeID,
		isVerified:false,
		businessID,
		timeOff:[],
		timesAvailible:[],
		currentRequests:[],
	});

	await AddAlertToBusiness(businessID, "New employee", name+" has requested to join your business", "employee");

	// Commits the batch
	await batch.commit();
	return 0;
});

//Adds information to the employee that makes them eligable for business verification
//afterwords, the getBusinessNotifications function should return this employee as unverified for that business
exports.employeeRequestVerification = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the employee
		employeeID,
		employeeCode,
	} = input;
	
	//creates the new array
	const business = await businesses.where('employeeCode', '==', employeeCode).get();

	const batch = database.batch();

	batch.update(employees.doc(employeeID), {
		businessID: business.businessID,
	});

	const employee = await (await employees.doc(employeeID).get()).data();

	sendNotification('b-' + business.businessID, "Employee Request", employee.name+" requested to join your business");

	// Commits the batch
	await batch.commit();
	return 0;
});

//method to verify that an employee is part of a business
exports.verifyEmployeeForBusiness = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the employee
		employeeID,
		businessID,
	} = input;

	const batch = database.batch();

	batch.update(businesses.doc(businessID), new FieldPath('employees'), {
		[employeeID]: name
	});

	batch.update(employees.doc(employeeID), {
		isVerified: true,
	});

	// Commits the batch
	await batch.commit();
	return 0;
});

//This method will return all the services associated with a certain category which will be passed in as a parameter
exports.getBusinessByEmployeeCode = functions.https.onCall(async (input, context) => {
	const { employeeCode } = input;
	
	//creates the new array
	const allFilteredDocs = await businesses.where('employeeCode', '==', employeeCode).get();
	return allFilteredDocs;
});

//method to submit a time off request
exports.createTimeOffRequest = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the employee
		employeeID,
		businessID,
		employeeName,
		date,
		startTime,
		endTime,
	} = input;

	const batch = database.batch();

	batch.update(businesses.doc(businessID), {
		timeOff: admin.firestore.FieldValue.arrayUnion({
			employeeID,
			employeeName,
			date,
			startTime,
			endTime,
			status:'pending'
		}),
	});

	batch.update(employees.doc(employeeID), {
		timeOff: admin.firestore.FieldValue.arrayUnion({
			businessID,
			date,
			startTime,
			endTime,
			status:'pending'
		}),
	});
	
	await AddAlertToBusiness(businessID, "Time off request", employeeName+" has requested to take "+startTime+" to "+endTime+" off on "+date, "employee");

	// Commits the batch
	await batch.commit();
	return 0;
});

//method to approve a time off request
exports.approveTimeOffRequest = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the employee
		businessID,
		employeeID,
		index,
	} = input;

	const batch = database.batch();

	const doc = await database.runTransaction(async (transaction) => {
		const doc = await transaction.get(employees.doc(employeeID + ''));
		const doc2 = await transaction.get(businesses.doc(businessID + ''));

		if (doc.exists && doc2.exists) {
			const employee = doc.data();
			const request = doc2.data().timeOff[index];
			const startTime = request.date + 'T' + request.startTime;
			const endTime = request.date + 'T' + request.endTime;
			let bottomIndex = -1;
			let topIndex = employee.timesAvailible.length;
			let currentIndex = (topIndex - bottomIndex) / 2 + bottomIndex;
			while(currentIndex != bottomIndex){
				if(startTime > employee.timesAvailible[currentIndex])
					bottomIndex = currentIndex;
				else if(startTime < employee.timesAvailible[currentIndex])
					topIndex = currentIndex;
				else break;
				currentIndex = (topIndex - bottomIndex) / 2 + bottomIndex;
			}
			bottomIndex = ++currentIndex;
			topIndex = currentIndex;
			while(endTime > employee.timesAvailible[topIndex])
				topIndex++;
			if((bottomIndex - 1) % 2 == 0 && (topIndex) % 2 == 1){ //even = start, odd = finish
				employee.timesAvailible.splice(bottomIndex, topIndex - bottomIndex);
			}
			else{
				if(bottomIndex % 2 == 1){
					employee.timesAvailible.splice(bottomIndex, 1);
					employee.timesAvailible.splice(--topIndex, 0, endTime);
				}
				else if((topIndex - 1) % 2 == 0){
					employee.timesAvailible.splice(bottomIndex++, 0, startTime);
					employee.timesAvailible.splice(topIndex, 1);
				}
				else{
					employee.timesAvailible.splice(bottomIndex++, 0, startTime);
					employee.timesAvailible.splice(++topIndex, 0, endTime);
				}
				employee.timesAvailible.splice(bottomIndex, topIndex - bottomIndex);
			}

			batch.update(employees.doc(employeeID), {
				timesAvailible: employee.timesAvailible
			});
			return 0;
		} else {
			return -1;
		}
	});
	if(doc != 0) return doc;

	batch.update(businesses.doc(businessID), new FieldPath('timeOff', index+""), {
		status:'approved'
	});

	batch.update(employees.doc(employeeID), new FieldPath('timeOff', index+""), {
		status:'approved'
	});

	// Commits the batch
	await batch.commit();
	return 0;
});

//method to approve a time off request
exports.denyTimeOffRequest = functions.https.onCall(async (input, context) => {
	const {
		//Fields for the employee
		businessID,
		employeeID,
		index,
	} = input;

	const batch = database.batch();

	batch.update(businesses.doc(businessID), new FieldPath('timeOff', index+""), {
		status:'denied'
	});

	batch.update(employees.doc(employeeID), new FieldPath('timeOff', index+""), {
		status:'denied'
	});

	// Commits the batch
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
		price,
		priceText,
		questions,
		serviceDescription,
		serviceTitle,
		totalReviews,
		cash,
		card,
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
		price,
		questions,
		serviceDescription,
		serviceTitle,
		card,
		cash,
		totalReviews,
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
			totalReviews,
			averageRating,
			serviceTitle,
			priceText,
		}),
	});

	//Adds the service to analytics
	batch.update(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Analytics').doc('TopServices'), {
		[serviceID]: {
			serviceTitle,
			serviceID,
			totalViews: 0,
			totalRequests: 0,
			totalRevenue: 0,
		},
	});

	await batch.commit();

	return serviceID;
});

//This method is going to take in a new version of a service and is going to update the service in firestore accorinding to
//updates. Updates the service document in addition to the service copy in the business document
exports.updateServiceInformation = functions.https.onCall(async (input, context) => {
	const {
		priceText,
		serviceDuration,
		price,
		questions,
		serviceDescription,
		serviceTitle,
		serviceID,
		businessID,
		card,
		cash,
	} = input;

	const batch = database.batch();

	batch.update(services.doc(serviceID), {
		priceText,
		serviceDuration,
		price,
		questions,
		serviceDescription,
		card,
		cash,
		serviceTitle,
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
			serviceDescription,
		};
		await transaction.update(businesses.doc(businessID), {
			services: business.services,
		});

		//Updates the service title in analytics
		const fieldName = serviceID + '.serviceTitle';
		await transaction.update(
			businesses.doc(businessID).collection('Private').doc('Private Data').collection('Analytics').doc('TopServices'),
			{
				[fieldName]: serviceTitle,
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
//deleted.
exports.deleteService = functions.https.onCall(async (input, context) => {
	const { serviceID, businessID } = input;

	const result = await database.runTransaction(async (transaction) => {
		const business = (await transaction.get(businesses.doc(businessID))).data();
		//Fetches the necessary data
		const allRequestedForThisService = (
			await transaction.get(
				requests.where('serviceID', '==', serviceID).where('status', '==', 'REQUESTED')
			)
		).docs;
		let arrayOfCustomers = [];
		let promises = allRequestedForThisService.map((request) => {
			const customerID = request.data().customerID;
			return transaction.get(customers.doc(customerID));
		});
		arrayOfCustomers = await Promise.all(promises);

		//Removes each request from the business's schedule
		promises = allRequestedForThisService.map((requestDoc) => {
			const request = requestDoc.data();
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
			return transaction.update(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Schedule').doc(dateString), {
				[request.requestID]: admin.firestore.FieldValue.delete(),
			});
		});
		await Promise.all(promises);

		promises = arrayOfCustomers.map((customerDoc) => {
			const customer = customerDoc.data();
			//Updates the customer document
			indexOfRequest = customer.currentRequests.findIndex(
				(element) => element.serviceID === serviceID
			);
			//Notifies the business that the request has been deleted.
			sendNotification(
				'b-' + businessID,
				'Request Cancelled',
				customer.name +
					' ' +
					'has cancelled their request for' +
					' ' +
					customer.currentRequests[indexOfRequest].serviceTitle
			);

			//Notifies the customer that the request has been deleted.
			sendNotification(
				'c-' + customer.name,
				'Request Cancelled',
				'Your request for ' +
					customer.currentRequests[indexOfRequest].serviceTitle +
					' has been cancelled by the business.'
			);

			customer.currentRequests.splice(indexOfRequest, 1);
			return transaction.update(customers.doc(customer.customerID), {
				currentRequests: customer.currentRequests,
			});
		});
		await Promise.all(promises);

		//Deletes the request docments themselves
		promises = allRequestedForThisService.map((request) => {
			return transaction.delete(requests.doc(request.data().requestID));
		});
		await Promise.all(promises);

		//Updates the service to indicate that it is deleted (simply archives it)
		await transaction.update(services.doc(serviceID), {
			isDeleted: true,
		});

		//Finds the index of the service in the business's document removes it from that array of their services
		const indexOfService = business.services.findIndex(
			(eachService) => eachService.serviceID === serviceID
		);
		business.services.splice(indexOfService, 1);
		await transaction.update(businesses.doc(businessID), { services: business.services });

		return 0;
	});

	return result;
});

//--------------------------------- Payment Functions ---------------------------------

//This function will create a stripe customer and attach a payment method to that customer. It will then return
//the information for that specific stripe customer in the form of an object containing the IDs
exports.createStripeCustomerPaymentInformtion = functions.https.onCall(async (input, context) => {
	const { paymentSource, paymentToken, cardData, checkingAccount, customerID } = input;

	// example credit card
	// card = {
	// 	number: '4000056655665556',
	// 	exp_month: 10,
	// 	exp_year: 2021,
	// 	cvc: '314',
    // 	currency: 'usd',
	// }

	//example bank account
	// account = {
	// 	country: 'US',
	// 	currency: 'usd',
	// 	account_number: '3497216841356',
	//	routing_number: '000000000'
	// }

	try{
		const customerObject = (await customers.doc(customerID).get()).data();

		let finalSource;
		if(paymentSource) finalSource = {id:paymentSource};
		else{
			let finalToken;
			if(paymentToken) finalToken = {id:paymentToken};
			else if(cardData) finalToken = await stripe.tokens.create({card:cardData});
			else if(checkingAccount) finalToken = await stripe.tokens.create({bank_account:checkingAccount});
			else throw {code:'invalid_card_type'};

			finalSource = await stripe.sources.create({
				type: 'ach_credit_transfer',
				currency: 'usd',
				token: finalToken.id,
				owner: {
					email: customerObject.email
				},
				usage: 'reusable'
			});
		}

		//Creates the stripe customer
		const stripeCustomer = await stripe.customers.create({
			email: customerObject.email,
			name: customerObject.name,
			metadata: {
				firestoreDocumentID: customerID,
			},
		});

		//Creates the credit card information and connects it with the customer in stripe
		await stripe.customers.createSource(stripeCustomer.id, {
			source: finalSource.id,
		});

		const stripeCustomerObject = await stripe.customers.retrieve(stripeCustomer.id);

		const source = stripeCustomerObject.sources.data[0];

		//Writes this payment information to the customer's document for future references
		await customers.doc(customerID).update({
			stripeCustomerID: stripeCustomer.id,
			paymentInformation: source,
		});

		return { sourceID: source.id, stripeCustomerID: stripeCustomer.id };
	} catch (error) {
		if (error.code === 'invalid_card_type') {
			return 'invalid_card_type';
		} else {
			throw error;
		}
	}
});

//This function takes in an existing stripe customer and updates their payment information both in firebase
//and in the Stripe API
exports.updateStripeCustomerPaymentInformtion = functions.https.onCall(async (input, context) => {
	const { paymentSource, paymentToken, cardData, checkingAccount, customerID } = input;

	// example credit card
	// card = {
	// 	number: '4000056655665556',
	// 	exp_month: 10,
	// 	exp_year: 2021,
	// 	cvc: '314',
    // 	currency: 'usd',
	// }

	//example bank account
	// account = {
	// 	country: 'US',
	// 	currency: 'usd',
	// 	account_number: '3497216841356',
	//	routing_number: '000000000'
	// }

	try{
		const customerObject = (await customers.doc(customerID).get()).data();

		let finalSource;
		if(paymentSource) finalSource = {id:paymentSource};
		else{
			let finalToken;
			if(paymentToken) finalToken = {id:paymentToken};
			else if(cardData) finalToken = await stripe.tokens.create({card:cardData});
			else if(checkingAccount) finalToken = await stripe.tokens.create({bank_account:checkingAccount});
			else throw {code:'invalid_card_type'};

			finalSource = await stripe.sources.create({
				type: 'ach_credit_transfer',
				currency: 'usd',
				token: finalToken.id,
				owner: {
					email: customerObject.email
				},
				usage: 'reusable'
			});
		}

		const newCustomer = await stripe.customers.update(customerObject.stripeCustomerID, {
			source: finalSource.id,
		});

		const source = newCustomer.sources.data[0];

		//Writes this payment information to the customer's document for future references
		await customers.doc(customerID).update({
			paymentInformation: source,
		});
		return 0;
	} catch (error) {
		if (error.code === 'invalid_card_type') {
			return 'invalid_card_type';
		} else {
			throw error;
		}
	}
});

//This function is going to take in a customerID and is going to delete their payment information from
//the database, as well as delete their stripe account from Stripe
exports.deleteCustomerPaymentInformation = functions.https.onCall(async (input, context) => {
	try {
		const { customerID } = input;
		const customer = (await customers.doc(customerID).get()).data();

		//Deletes the stripe information in the Stripe API
		const { stripeCustomerID } = customer;
		await stripe.customers.del(stripeCustomerID);

		//Removes the payment information from firestore
		await customers.doc(customerID).update({
			paymentInformation: '',
			stripeCustomerID: admin.firestore.FieldValue.delete(),
		});

		return 0;
	} catch (error) {
		return -1;
	}
});

//This function deletes a certain stripe connect account
//NOTE: this function is only for testing purposes
exports.deleteStripeConnectAccount = functions.https.onCall(async (input, context) => {
	const {accountID} = input;
	try{
		const deleted = await stripe.accounts.del(
			accountID
		);
		return deleted;
	}
	catch(err){
		return err;
	}
});

//This function is going to take in a set of required information and create a Custom Account with Stripe Connect
//for businesses. It will return the account information. It will take in links that  stripe will redirect to
//once the OnBoarding process is complete
exports.createStripeConnectAccountForBusiness = functions.https.onCall(async (input, context) => {
	const { businessID, tos_acceptance, businessProfile, paymentToken, cardData, checkingAccount } = input;

	//NOTE: for a fully functional connect account, these fields must be present and completly filled out: 
	// businessID, tod_acceptance, businessProfile, and either paymentToken, cardData, or checkingAccount

	// example business profile
	// profile = {
	// 	name: 'Help',
	// 	url: 'https://helptechnologies.net'
	// }

	// example credit card
	// card = {
	// 	number: '4000056655665556',
	// 	exp_month: 10,
	// 	exp_year: 2021,
	// 	cvc: '314',
    // 	currency: 'usd',
	// }

	//example bank account
	// account = {
	// 	country: 'US',
	// 	currency: 'usd',
	// 	account_number: '3497216841356',
	//	routing_number: '000000000'
	// }


	try {
		const business = (await businesses.doc(businessID).get()).data();

		let finalToken;
		if(paymentToken) finalToken = {id:paymentToken};
		else if(cardData) finalToken = await stripe.tokens.create({card:cardData});
		else if(checkingAccount) finalToken = await stripe.tokens.create({bank_account:checkingAccount});
		else throw {code:'invalid_card_type'};

		const connectAccount = await stripe.accounts.create({
			type: 'custom',
			country: 'US',
			email: business.email,
			business_type: 'company',
			requested_capabilities: ['transfers'],
			metadata: {
				firestoreDocumentID: businessID,
			},
			tos_acceptance,
			external_account: finalToken.id,
			business_profile: businessProfile
		});

		const accountLinks = await stripe.accountLinks.create({
			account: connectAccount.id,
			failure_url: 'https://google.com', //Replace this with website payments once that is coded
			success_url: 'https://google.com', //Replace this with website payments once that is  coded
			type: 'custom_account_verification',
			collect: 'eventually_due',
		});

		await businesses.doc(businessID).update({
			paymentSetupStatus: 'PENDING',
			stripeBusinessID: connectAccount.id,
			paymentInformation: connectAccount.external_accounts.data[0],
		});

		return {
			accountLinks,
			stripeID: connectAccount.id,
			sourceID: connectAccount.external_accounts.data[0].id,
		};
	} catch (error) {
		//Handles the case that the user enters in a non-valid card for Stripe Connect (a credit card for example)
		if (error.code === 'invalid_card_type') {
			return 'invalid_card_type';
		} else {
			throw error;
		}
	}
});

//This function is going to update a business's payment information for their Stripe connect account that they've already
//created. They don't need to reonboard or anything
exports.updateStripeConnectAccountPayment = functions.https.onCall(async (input, context) => {
	const { businessID, paymentToken, cardData, checkingAccount } = input;

	// example credit card
	// card = {
	// 	number: '4000056655665556',
	// 	exp_month: 10,
	// 	exp_year: 2021,
	// 	cvc: '314',
    // 	currency: 'usd',
	// }

	//example bank account
	// account = {
	// 	country: 'US',
	// 	currency: 'usd',
	// 	account_number: '3497216841356',
	//	routing_number: '000000000'
	// }

	try {
		const business = (await businesses.doc(businessID).get()).data();

		let finalToken;
		if(paymentToken) finalToken = {id:paymentToken};
		else if(cardData) finalToken = await stripe.tokens.create({card:cardData});
		else if(checkingAccount) finalToken = await stripe.tokens.create({bank_account:checkingAccount});
		else throw {code:'invalid_card_type'};

		//Updates the card in stripe
		const connectAccount = await stripe.accounts.update(business.stripeBusinessID, {
			external_account: finalToken.id,
		});

		//updates the firestore payment information
		await businesses.doc(businessID).update({
			paymentInformation: connectAccount.external_accounts.data[0],
		});

		return 0;
	} catch (error) {
		//Handles the case that the user enters in a non-valid card for Stripe Connect (a credit card for example)
		if (error.code === 'invalid_card_type') {
			return 'invalid_card_type';
		} else {
			return -1;
		}
	}
});

//This method is going to close a business stripe account, delete their payment information, and delete the payment
//information from Firestore. The method is also going to change all of the business's current products to a cash
//product if they currently accept cards. If the business wants to reopen their account with Stripe, they will
//have to go through the onboarding process again. If there are any current requests for any of the services that
//are card, it changes them to cash requests.
exports.deleteBusinessPaymentInformation = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	//Updates the business's document and the changes the services to only accept cash. If the business
	//has anu current card requests. This entire function will return an error
	const result = await database.runTransaction(async (transaction) => {
		//Fetches the documents needed
		const business = (await transaction.get(businesses.doc(businessID))).data();
		const currentRequestsWithCard = await transaction.get(
			requests.where('businessID', '==', businessID).where('card', '==', true)
		);

		if (currentRequestsWithCard.docs.length > 0) {
			return -1;
		}

		//Changes all of the business's services to cash payments
		/* eslint-disable no-await-in-loop */
		for (const service of business.services) {
			await transaction.update(services.doc(service.serviceID), {
				cash: true,
				card: false,
			});
		}

		await transaction.update(businesses.doc(businessID), {
			paymentInformation: '',
			paymentSetupStatus: 'FALSE',
			stripeBusinessID: admin.firestore.FieldValue.delete(),
		});

		return business;
	});

	//Only deletes the stripe account if the previous part of the function succeeded.
	if (result !== -1) {
		await stripe.accounts.del(result.stripeBusinessID);
		return 0;
	} else {
		return -1;
	}
});

//Checks if a Stripe Connect account needs to be updated with any information. If it does, the function
//will return the URL to update it. If it doesn't the function will return false
exports.checkStripeOnboardingByStripeID = functions.https.onCall(async (input, context) => {
	const { stripeID } = input;
	const stripeAccount = await stripe.accounts.retrieve(stripeID);

	if (stripeAccount.requirements && stripeAccount.requirements.eventually_due.length === 0) {
		return {
			value: false,
			verification: stripeAccount.requirements.pending_verification,
		};
	} else {
		const accountLinks = await stripe.accountLinks.create({
			account: stripeID,
			failure_url: 'https://google.com', //Replace this with website payments once that is coded
			success_url: 'https://google.com', //Replace this with website payments once that is  coded
			type: 'custom_account_verification',
			collect: 'eventually_due',
		});
		return accountLinks.url;
	}
});

//The method updates the business's payment status to ready to go so they can now accept payments
exports.updateBusinessPaymentStatus = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	await businesses.doc(businessID).update({
		paymentSetupStatus: 'TRUE',
	});
});

//This method will charge a specific amount to a specific customer and move it to a Stripe Connect account
//It will take in a billed amount, charge it to the customer, and move it to the Stripe Connect balance. It will
//record this transaction as a field in the request document
exports.chargeCustomerForRequest = functions.https.onCall(async (input, context) => {
	const { businessID, customerID, requestID, billedAmount, serviceID, cardToken, isCardSaved } = input;

	try {
		const promises = await Promise.all([
			businesses.doc(businessID).get(),
			requests.doc(requestID).get(),
		]);
		const business = promises[0].data();
		const request = promises[1].data();
		const customer = customerID ? (await customers.doc(customerID).get()).data() : null;

		const { stripeBusinessID } = business;
		const stripeCustomerID = isCardSaved === true && cardToken ? customer.stripeCustomerID : false;

		//Calculates the charge amount along with the fee. Stripe accepts parameters as cents
		const chargedAmountToCustomer = billedAmount * 100; //This is how much the customer will be charged
		const feePaidByBusiness = (billedAmount * 0.05 + 0.3) * 100; //This is how much comes to us from the business. The "0.05 + 0.3" means 5% + 30 cents, which is the amount we will edit

		//If this is a one-time payment, then it charges the token which will be saved in the "isCardSaved param". If this
		//is a saved customer card, then it charges the customer object
		let charge = '';
		if (isCardSaved === true) {
			charge = await stripe.charges.create({
				amount: chargedAmountToCustomer,
				application_fee_amount: feePaidByBusiness,
				currency: 'usd',
				customer: stripeCustomerID,
				transfer_data: {
					destination: stripeBusinessID,
				},
			});
		} else {
			charge = await stripe.charges.create({
				amount: chargedAmountToCustomer,
				application_fee_amount: feePaidByBusiness,
				currency: 'usd',
				source: isCardSaved,
				transfer_data: {
					destination: stripeBusinessID,
				},
			});
		}

		let balance = await (new Promise( (res, rej) => {
			stripe.balance.retrieve({stripeAccount:business.data().stripeBusinessID}, (err, balance) => {
				if(balance) res(balance);
				else res(err);
			});
		}));
		let transaction = {
			amount: chargedAmountToCustomer,
			total: balance.available[0].amount + balance.pending[0].amount,
			service: request.serviceTitle,
			customer: request.customerName,
			date: new Date().getTime(),
		}

		//Updates the request document with information about the completed request. Also updates the CompletedRequest
		//subcollection documents within the service and the customer just in case it needs to be referenced.
		const { id, payment_method, receipt_url } = charge;
		const paymentInformation = {
			chargedAmountToCustomer: billedAmount,
			feePaidByBusiness: feePaidByBusiness / 100,
			amountPaidToHelp: (feePaidByBusiness / 100 - (billedAmount * 0.029 + 0.3)).toFixed(2), //This should be adjusted based on the Stripe Connect costs
			stripeCustomerID,
			stripeBusinessID,
			chargeID: id,
			paymentMethodID: payment_method,
			receiptURL: receipt_url,
		};

		const batch = database.batch();
		batch.set(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Transactions').doc(transaction.date), transaction);
		batch.update(requests.doc(requestID), { paymentInformation });
		if(customer) batch.update(customers.doc(customerID).collection('CompletedRequests').doc(requestID), {
			paymentInformation,
		});
		batch.update(services.doc(serviceID).collection('CompletedRequests').doc(requestID), {
			paymentInformation,
		});
		await batch.commit();

		return 0;
	} catch (error) {
		throw error;
	}
});

//The method retrieves the business's balance from their stripe account
exports.retrieveConnectAccountBalance = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	const business = await businesses.doc(businessID).get();

	return await (new Promise( (res, rej) => {
		stripe.balance.retrieve({stripeAccount:business.data().stripeBusinessID}, (err, balance) => {
			if(balance) res(balance);
			else res(err);
		});
	}));
});

//The method retrieves the business's bank account details
exports.retrieveConnectAccountDetails = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	const business = await businesses.doc(businessID).get();

	return (await stripe.accounts.listExternalAccounts(business.data().stripeBusinessID, {
		limit:1
	})).data[0];
});

//The method retrieves the business's transaction history (only including payments)
exports.retrieveConnectAccountTransactionHistory = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	return await admin.firestore().getAll( ...(await businesses.doc(businessID).collection('Private').doc('Private Data').collection('Transactions').listDocuments()));

	
	//this is old stripe syntax, before we realized we needed to store transactions locally

	// let result = await stripe.balanceTransactions.list({
	// 	//type: 'payment',
	// }, {stripeAccount: business.data().stripeBusinessID});

	// for(let i = result.data.length - 1; i >= 0; i--)
	// 	if(result.data[i].type == "payout")
	// 		result.data.splice(i, 1);
	
	// return result;
});

//The method retrieves the business's payout history
exports.retrieveConnectAccountPayoutHistory = functions.https.onCall(async (input, context) => {
	const { businessID } = input;

	const business = await businesses.doc(businessID).get();

	return await stripe.payouts.list({}, {stripeAccount: business.data().stripeBusinessID});
});

//The method retrieves the business's payout history
exports.SetConnectAccountPayoutSchedule = functions.https.onCall(async (input, context) => {
	const { businessID, interval, weekly_anchor, monthly_anchor } = input;

	let payoutInterval;
	switch(interval){
		case 'd': payoutInterval = 'daily'; break;
		case 'w': payoutInterval = 'weekly'; if(!weekly_anchor) return -1; break;
		case 'm': payoutInterval = 'monthly'; if(!monthly_anchor) return -1; break;
		default: return -1;
	}

	const business = await businesses.doc(businessID).get();

	await stripe.accounts.update(
		business.data().stripeBusinessID, {
		settings:{payouts:{schedule:{
			delay_days: 'minimum',
			interval: payoutInterval,
			monthly_anchor,
			weekly_anchor
		}}}
	});

	return 0;
});

//The method retrieves the business's transaction statistics (not including payouts)
exports.retrieveConnectAccountTransactionStatistics = functions.https.onCall(async (input, context) => {
	const { businessID, filterDate } = input;

	const business = await businesses.doc(businessID).get();

	const transactions = await stripe.balanceTransactions.list({
		type: 'payment',
		created:{gte:filterDate ? (new Date(filterDate)).getTime()/1000 : 0}
	}, {stripeAccount: business.data().stripeBusinessID});

	let statistics = {
		count: transactions.data.length,
		gross: 0
	};
	
	for(let i in transactions.data)
		statistics.gross += transactions.data[i].amount;

	return statistics;
});

//The method retrieves the business's transaction statistics (not including payouts)
exports.retrieveConnectAccountRefundStatistics = functions.https.onCall(async (input, context) => {
	const { businessID, filterDate } = input;

	const business = await businesses.doc(businessID).get();

	const transactions = await stripe.balanceTransactions.list({
		type: 'refund',
		created:{gte:filterDate ? (new Date(filterDate)).getTime()/1000 : 0}
	}, {stripeAccount: business.data().stripeBusinessID});

	let statistics = {
		count: transactions.data.length,
		gross: 0
	};
	
	for(let i in transactions.data)
		statistics.gross += transactions.data[i].amount;

	return statistics;
});

//The method retrieves the business's transaction statistics (not including payouts)
exports.retrieveConnectAccountStatistics = functions.https.onCall(async (input, context) => {
	const { businessID, filterDate } = input;

	const business = await businesses.doc(businessID).get();

	const transactions = await stripe.balanceTransactions.list({
		created:{gte:filterDate ? (new Date(filterDate)).getTime()/1000 : 0}
	}, {stripeAccount: business.data().stripeBusinessID});

	let statistics = {
		count: transactions.data.length,
		net: 0
	};
	
	for(let i in transactions.data)
		statistics.net += transactions.data[i].amount;

	return statistics;
});

//add the customer's payment details to the custom request
exports.addCustomRequestPaymentDetails = functions.https.onCall(async (input, context) => {
	const { customRequestID, paymentToken, cardData, checkingAccount } = input;

	// example credit card
	// card = {
	// 	number: '4000056655665556',
	// 	exp_month: 10,
	// 	exp_year: 2021,
	// 	cvc: '314',
    // 	currency: 'usd',
	// }

	//example bank account
	// account = {
	// 	country: 'US',
	// 	currency: 'usd',
	// 	account_number: '3497216841356',
	//	routing_number: '000000000'
	// }

	try {
		const business = (await businesses.doc(businessID).get()).data();

		let finalToken;
		if(paymentToken) finalToken = {id:paymentToken};
		else if(cardData) finalToken = await stripe.tokens.create({card:cardData});
		else if(checkingAccount) finalToken = await stripe.tokens.create({bank_account:checkingAccount});
		else throw {code:'invalid_card_type'};

		//updates the database payment information
		await customRequests.doc(customRequestID).update({
			paymentInformation: finalToken.id,
		});

		return 0;
	} catch (error) {
		//Handles the case that the user enters in a non-valid card for Stripe Connect (a credit card for example)
		if (error.code === 'invalid_card_type') {
			return 'invalid_card_type';
		} else {
			return -1;
		}
	}
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

//Method will take in a reference to a picture (the same as the business profile ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getBusinessProfilePictureByID = functions.https.onCall(async (input, context) => {
	const { businessID } = input;
	//Creates the reference
	const uri = storage.file('businessProfilePics/' + businessID);
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

//Method will take in a reference to a picture (the same as the business profile ID it is fetching)
//and return the download URL for the image which is used as an image source
exports.getEmployeeProfilePictureByID = functions.https.onCall(async (input, context) => {
	const { employeeID } = input;
	//Creates the reference
	const uri = storage.file('employeeProfilePics/' + employeeID);
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
		businessID,
		customerID,
		customerLocation,
		paymentInformation,
		cash,
		card,
		date,
		questions,
		price,
		priceText,
		review,
		serviceTitle,
		customerName,
		customerAddress,
		customerPhoneNumber,
		customerEmail,
		serviceDuration,
		requestedOn,
		serviceID,
		status,
		time,
	} = input;

	// Calculates the end time field for requests
	let startHours = parseInt(time.split(' ')[0].split(':')[0]);
	const startMinutes = parseInt(time.split(' ')[0].split(':')[1]);

	if (startHours !== 12 && time.split(' ')[1] === 'PM') {
		startHours += 12;
	}

	let endHours = startHours + Math.floor(serviceDuration);
	let endMinutes = Math.floor(startMinutes + 60 * (serviceDuration - Math.floor(serviceDuration)));
	let amPM = endHours >= 12 ? 'PM' : 'AM';
	if (amPM === 'PM' && endHours > 12) {
		endHours -= 12;
	}

	let endTime = endHours + ':' + endMinutes + ' ' + amPM;
	const result = await database.runTransaction(async (transaction) => {
		if(customerID){
			let customer = (await transaction.get(customers.doc(customerID))).data();
			customerName = customer.name;
			customerAddress = customer.address;
			customerPhoneNumber = customer.phoneNumber;
			customerEmail = customer.email;
		}

		const batch = database.batch();

		//If this is a request being edited, the old request document will be edited, else it will be added
		const newRequestDoc = await requests.add({
			businessID,
			customerID,
			cash,
			customerLocation,
			paymentInformation,
			card,
			date,
			price,
			priceText,
			questions,
			review,
			serviceTitle,
			customerName,
			customerAddress,
			customerPhoneNumber,
			customerEmail,
			requestedOn,
			serviceID,
			status,
			time,
			endTime,
			confirmed: false, //Since it is new requests it starts off as unconfirmed to allow a business to confirm it
		});

		const requestID = newRequestDoc.id;

		batch.update(requests.doc(requestID), { requestID });

		//Adds a reference to the request to the customer's array of currentRequests
		if(customerID) batch.update(customers.doc(customerID), {
			currentRequests: admin.firestore.FieldValue.arrayUnion({
				date,
				requestID,
				serviceID,
				serviceTitle,
				status,
				time,
				endTime,
			}),
		});

		await batch.commit();

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
		const dateDocPath = businesses.doc(businessID).collection('Private').doc('Private Data').collection('Schedule').doc(dateString);
		const dateDoc = await transaction.get(dateDocPath);
		//Increments the numRequests for the service. Also adds scheduling information for the business
		let business = (await transaction.get(businesses.doc(businessID))).data();
		const indexOfService = business.services.findIndex(
			(element) => element.serviceID === serviceID
		);
		business.services[indexOfService].numCurrentRequests =
			business.services[indexOfService].numCurrentRequests + 1;
		await transaction.update(businesses.doc(businessID), {
			services: business.services,
		});

		//Updates the analytics for the business
		const fieldName = serviceID + '.totalRequests';
		await transaction.update(
			businesses.doc(businessID).collection('Private').doc('Private Data').collection('Analytics').doc('TopServices'),
			{
				[fieldName]: admin.firestore.FieldValue.increment(1),
			}
		);

		if (dateDoc.exists === true) {
			await transaction.update(dateDocPath, {
				[requestID]: {
					date,
					time,
					endTime,
					requestID,
					serviceDuration,
					serviceTitle,
					serviceID,
					customerName,
				},
			});
		} else {
			await transaction.set(dateDocPath, {
				dateString,
				[requestID]: {
					date,
					time,
					endTime,
					requestID,
					serviceDuration,
					serviceTitle,
					serviceID,
					customerName,
				},
			});
		}

		return 0;
	});

	sendNotification('b-' + businessID, 'New Request', 'You have a new request for ' + serviceTitle);

	if(customerID){//Emails help team that there has been a new requeset
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
	}

	await AddAlertToBusiness(businessID, "New request", customerName+" has requested "+serviceTitle+" on "+date+" at "+time, "customer");

	return result;
});

//this function sets the confirmed variable to true in the request doc
exports.confirmRequest = functions.https.onCall(async (input, context) => {
	const { requestID } = input;
	const batch = database.batch();
	batch.update(requests.doc(requestID), { confirmed: true });
	await batch.commit();
	await database.runTransaction(async (transaction) => {
		const request = await (await transaction.get(requests.doc(requestID + ''))).data();
		const service = await (await transaction.get(services.doc(request.serviceID + ''))).data();
		sendEmail(
			request.customerEmail,
			'Your request has been accepted',
			`Your request for ${request.serviceTitle} has been accepted.\n`+
			`Service Name: ${request.serviceTitle}\n`+
			// `Employee Name: ${request.serviceTitle}\n`+
			`Service Date: ${request.date}\n`+
			`Service Time: ${request.time}\n`+
			`Estimated Cost: ${service.serviceDuration*service.price}\n`
		);
	});
});

//this function sets the confirmed variable to true in the request doc
exports.addEmployeeToRequest = functions.https.onCall(async (input, context) => {
	const { employeeID, requestID } = input;
	const batch = database.batch();
	await database.runTransaction(async (transaction) => {
		const employee = await (await transaction.get(employees.doc(employeeID + ''))).data();
		const request = await (await transaction.get(requests.doc(requestID + ''))).data();

		batch.update(employee.doc(employeeID), {
			currentRequests: admin.firestore.FieldValue.arrayUnion({
				date: request.date,
				requestID: request.requestID,
				serviceID: request.serviceID,
				customerID: request.customerID,
				customerName: request.customerName,
				questions: request.questions,
				serviceTitle: request.serviceTitle,
				status: request.status,
				time: request.time,
				endTime: request.endTime
			})
		});

		batch.update(requests.doc(requestID), {
			assignedTo: employee.name,
			employeeID,
		});

	});
	batch.update(requests.doc(requestID), { confirmed: true });
	await batch.commit();
	return 0;
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
		customerName,
	} = input;

	// Calculates the end time for the service
	let startHours = parseInt(time.split(' ')[0].split(':')[0]);
	const startMinutes = parseInt(time.split(' ')[0].split(':')[1]);

	if (startHours !== 12 && time.split(' ')[1] === 'PM') {
		startHours += 12;
	}

	let endHours = startHours + Math.floor(serviceDuration);
	let endMinutes = Math.floor(startMinutes + 60 * (serviceDuration - Math.floor(serviceDuration)));
	let amPM = endHours >= 12 ? 'PM' : 'AM';
	if (amPM === 'PM' && endHours > 12) {
		endHours -= 12;
	}

	let endTime = endHours + ':' + endMinutes + ' ' + amPM;

	const result = await database.runTransaction(async (transaction) => {
		//updates the request within the customer
		let customer = customerID ? (await transaction.get(customers.doc(customerID))).data() : null;
		if(customer){
			const indexOfCustomerRequest = customer.currentRequests.findIndex(
				(element) => element.requestID === requestID
			);
			customer.currentRequests[indexOfCustomerRequest] = {
				date,
				requestID,
				serviceID,
				serviceTitle,
				status,
				endTime,
				time,
			};
			await transaction.update(customers.doc(customerID), {
				currentRequests: customer.currentRequests,
			});
		}

		await transaction.update(requests.doc(requestID), {
			date,
			questions,
			customerLocation,
			endTime,
			time,
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
		await transaction.update(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Schedule').doc(dateString), {
			[requestID]: {
				date,
				time,
				endTime,
				requestID,
				serviceDuration,
				serviceTitle,
				serviceID,
				customerName,
			},
		});
	});

	//Sends notifications to the customer and the business
	if(customerID) sendNotification(
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

//Method is going to change the status of a request
exports.changeRequestStatus = functions.https.onCall(async (input, context) => {
	let {
		requestID,
		status,
	} = input;

	const result = await database.runTransaction(async (transaction) => {
		await transaction.update(requests.doc(requestID), {status});
	});

	return 0;
});

//Method taks in a requestID and completes that request in the database by giving it the status "complete", and addding it
//to the completed requests SubCollection in the customer and the business. It will also add the billing accordingly to the
//customer's side (unless the service was marked as cash). It will also mark the request as awaiting review from the customer
exports.completeRequest = functions.https.onCall(async (input, context) => {
	let { cash, requestID, billedAmount } = input;

	const batch = database.batch();
	let request;

	billedAmount = parseFloat(billedAmount);

	//If the service is purchased through cash, then the request will simply be marked as complete.
	if (cash === true) {
		//Marks the status in the requests collection
		batch.update(requests.doc(requestID), { billedAmount, status: 'COMPLETE' });
		await batch.commit();

		await database.runTransaction(async (transaction) => {
			request = (await transaction.get(requests.doc(requestID))).data();
			let customer = request.customerID ? (await transaction.get(customers.doc(request.customerID))).data() : null;
			let businessDoc = businesses.doc(request.businessID);
			let business = (await transaction.get(businessDoc)).data();

			//Moves the request from currentRequests to the subcollection in the customer document and adds the requestID to
			//the customer's isReviewDue array
			if(customer){
				await transaction.set(
					customers.doc(request.customerID).collection('CompletedRequests').doc(requestID),
					{
						date: request.date,
						requestID,
						serviceID: request.serviceID,
						serviceTitle: request.serviceTitle,
						endTime: request.endTime,
						time: request.time,
						billedAmount,
					}
				);
				const indexOfCustomerRequest = customer.currentRequests.findIndex(
					(element) => element.requestID === requestID
				);
				customer.currentRequests.splice(indexOfCustomerRequest, 1);
				await transaction.update(customers.doc(request.customerID), {
					currentRequests: customer.currentRequests,
					isReviewDue: admin.firestore.FieldValue.arrayUnion(requestID),
				});
			}

			//Moves the request from currentRequests to the subcollection in the service document
			await transaction.set(
				services.doc(request.serviceID).collection('CompletedRequests').doc(requestID),
				{
					customerID: request.customerID,
					customerName: request.customerName,
					date: request.date,
					requestID,
					time: request.time,
					endTime: request.endTime,
					billedAmount,
				}
			);

			//Decrements the numRequests for the service and updates current requests in the business document
			const indexOfService = business.services.findIndex(
				(element) => element.serviceID === request.serviceID
			);
			business.services[indexOfService].numCurrentRequests =
				business.services[indexOfService].numCurrentRequests - 1;
			await transaction.update(businessDoc, {
				services: business.services,
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
			await transaction.update(businessDoc.collection('Private').doc('Private Data').collection('Analytics').doc('Revenue'), {
				[year]: admin.firestore.FieldValue.increment(billedAmount),
				[year + '-' + month]: admin.firestore.FieldValue.increment(billedAmount),
			});

			//Updates the service analytics for this service
			const fieldName = request.serviceID + '.totalRevenue';
			await transaction.update(businessDoc.collection('Private').doc('Private Data').collection('Analytics').doc('TopServices'), {
				[fieldName]: admin.firestore.FieldValue.increment(billedAmount),
			});

			//Updates the customer analytics for this service
			if(customer){
				const cityFieldName = 'Cities.' + request.customerLocation.city;
				const stateFieldName = 'States.' + request.customerLocation.state;
				const countryFieldName = 'Countries.' + request.customerLocation.country;
				await transaction.update(businessDoc.collection('Private').doc('Private Data').collection('Analytics').doc('CustomerLocations'), {
					[cityFieldName]: admin.firestore.FieldValue.increment(1),
					[stateFieldName]: admin.firestore.FieldValue.increment(1),
					[countryFieldName]: admin.firestore.FieldValue.increment(1),
				});
			}

			await transaction.update(businessDoc.collection('Private').doc('Private Data').collection('Schedule').doc(dateString), {
				[requestID]: admin.firestore.FieldValue.delete(),
			});
		});
		await database.runTransaction(async (transaction) => {
			//Tests if this document should be deleted all together
			let businessDoc = businesses.doc(request.businessID);
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
			const scheduleDoc = (
				await transaction.get(businessDoc.collection('Schedule').doc(dateString))
			).data();
			if (Object.keys(scheduleDoc).length === 1) {
				await transaction.delete(businessDoc.collection('Schedule').doc(dateString));
			}
		});
	} else {
		//This means the service is through a card payment, through which billing will be correctly set up
		
		await database.runTransaction(async (transaction) => {
			request = (await transaction.get(requests.doc(requestID))).data();
		});
	}

	await AddAlertToBusiness(request.businessID, "Payment recieved", "Payment for "+request.serviceTitle+" by "+request.customerName+" has been recieved", "customer");

	return 0;
});


//Method will take in a service ID and a customer ID and then delete that customer's request from the collection and
//the corresponding array.
exports.deleteRequest = functions.https.onCall(async (input, context) => {
	const { requestID } = input;
	const deleted = await deleteRequest(requestID);
	return deleted;
});

//This function will record within a service's analytics that the service has been viewed by a user. It will
//take in a businessID and a serviceID so it can update the document accordingly.
exports.viewService = functions.https.onCall(async (input, context) => {
	const { serviceID, businessID } = input;

	const batch = database.batch();
	const fieldName = serviceID + '.totalViews';
	batch.update(businesses.doc(businessID).collection('Private').doc('Private Data').collection('Analytics').doc('TopServices'), {
		[fieldName]: admin.firestore.FieldValue.increment(1),
	});

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
		const service = (await transaction.get(services.doc(serviceID))).data();

		//Adds the review to the service subcollection
		await transaction.set(services.doc(serviceID).collection('Reviews').doc(requestID), {
			comment,
			customerID,
			customerName,
			requestID,
			reviewDate,
			stars,
		});

		//Calculates the new average rating for the service
		const a = service.averageRating * service.totalReviews;
		const b = a + stars;
		const c = service.totalReviews + 1;
		const newRating = b / c;
		await transaction.update(services.doc(serviceID), {
			averageRating: newRating,
			totalReviews: admin.firestore.FieldValue.increment(1),
		});

		//Adds the review to the request document itself
		await transaction.update(requests.doc(requestID), {
			review: {
				comment,
				customerID,
				customerName,
				requestID,
				reviewDate,
				stars,
			},
		});

		//Removes the requestID from the customer's isReviewDue field
		await transaction.update(customers.doc(customerID), {
			isReviewDue: admin.firestore.FieldValue.arrayRemove(requestID),
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
		isReviewDue: admin.firestore.FieldValue.arrayRemove(requestID),
	});

	batch.update(requests.doc(requestID), { review: 'SKIPPED' });

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
		blockedBusinesses: admin.firestore.FieldValue.arrayUnion(businessID),
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
		blockedBusinesses: admin.firestore.FieldValue.arrayRemove(businessID),
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
					body: "You're account has been verified and accepted. Create your first product now!",
				},
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
		...error,
	});
});
