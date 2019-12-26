//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. The class
//will connect with the firebase firestore in order to retrieve the necessary data.
import firebase from 'react-native-firebase';
import strings from 'config/strings';
import haversine from 'haversine';
import { Platform } from 'react-native';

//All methods should be labeled static. There will also be static variable that reference the collections
//in the cloud firestore
export default class FirebaseFunctions {
	//The collections & references that will be used by this class
	static database = firebase.firestore();
	static storage = firebase.storage();
	static fcm = firebase.messaging();
	static analytics = firebase.analytics();
	static functions = firebase.functions();
	static providers = this.database.collection('providers');
	static requesters = this.database.collection('requesters');
	static products = this.database.collection('products');
	static conversations = this.database.collection('conversations');
	static requests = this.database.collection('requests');
	static issues = this.database.collection('issues');
	static helpDev = this.database.collection('helpDev');

	//This method is going to test whether a requester object has all the fields required as of the 2.0 update
	//It will return a boolen true or false based on that
	static isRequesterUpToDate(requesterObject) {
		return requesterObject.city && requesterObject.coordinates && requesterObject.phoneNumber;
	}

	//This method is going to return a boolean value on whether the app is currently under maintenance
	//or not
	static async isUnderMaintenance() {
		const maintenance = await this.helpDev.doc('maintenance').get();
		return maintenance.data().GTD;
	}

	static async isServiceRequestedByRequester(serviceID, requesterID) {
		const queryResults = (
			await this.requests
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
	}

	//This method will return an array of category objects. Each object will contain two fields. The first field will be the name
	//of the category, and the second will be the location of the image as it is stored in Firebase Storage. The image will not actually
	//be downloaded with this method. Instead you must call the method "getCategoryImageByID" to return the downloaded image
	static async getCategoryObjects() {
		//Fetches the array from firestore containing the categories
		const categoriesDocument = await this.helpDev.doc('categories').get();
		const { arrayOfCategoriesWithImages } = categoriesDocument.data();
		return arrayOfCategoriesWithImages;
	}

	//This method will take in an ID of a category image and download it from Firebase Storage, storing its URI.
	static async getCategoryImageByID(ID) {
		//Creates the reference
		const uri = await this.storage.ref('categoryIcons/' + ID).getDownloadURL();
		return { uri };
	}

	//This method will take in all the unblocked products for a requester and then return
	//all the products associated with a certain category which will be passed in as a second
	//parameter
	//TODO: Make some kind of machine learning model to automatically filter the products
	//depending on features such as product name, description, the company offering it, etc.
	static getProductsByCategory(allProducts, categoryName) {
		//creates the new array
		const filteredProducts = allProducts.filter((element) => {
			return element.category === categoryName;
		});

		return filteredProducts;
	}

	//This method will take in a requester object and an array of products. It will return an array containing only the products
	//that are being offered by businesses that are within 50 miles of customer. In the future, this number of miles will be set
	//by the business, as some businesses are willing to travel further than others
	static async filterProductsByRequesterLocation(requester, products) {
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
	}

	static async filterProductsByRequesterBlockedUsers(requester, products) {
		const { requesterID } = requester;

		const filteredProducts = [];
		for (const service of products) {
			const { offeredByID } = service;
			const doc = await this.requesters
				.doc(requesterID)
				.collection('BlockedUsers')
				.doc(offeredByID)
				.get();
			if (!doc.exists) {
				filteredProducts.push(service);
			}
		}
		return filteredProducts;
	}

	static async getCompletedRequestsByRequesterID(requesterID) {
		const completedServices = await this.requests
			.where('requesterID', '==', requesterID)
			.where('isCompleted', '==', true)
			.get();
		const arrayOfCompletedServices = completedServices.docs.map((doc) => doc.data());
		return arrayOfCompletedServices;
	}

	static async getInProgressServicesByRequesterID(requesterID) {
		const inProgressServices = await this.requests
			.where('requesterID', '==', requesterID)
			.where('isCompleted', '==', false)
			.get();
		const arrayOfInProgressServices = inProgressServices.docs.map((doc) => doc.data());
		return arrayOfInProgressServices;
	}

	static async getReviewsByServiceID(serviceID) {
		const reviews = await this.products
			.doc(serviceID)
			.collection('Reviews')
			.get();
		const arrayOfReviews = reviews.docs.map((doc) => doc.data());
		return arrayOfReviews;
	}

	static async getCurrentRequestByID(serviceID, requesterID) {
		const allInProgressRequests = await this.getInProgressServicesByRequesterID(requesterID);
		const requestedService = allInProgressRequests.find((element) => {
			return element.serviceID === serviceID;
		});
		return requestedService;
	}

	static async getCompletedRequestByID(serviceID, requesterID) {
		const allCompletedRequests = await this.getCompletedRequestsByRequesterID(requesterID);
		const completedService = allCompletedRequests.find((element) => {
			return element.serviceID === serviceID;
		});
		return completedService;
	}

	//This method will return an array of all of the providers
	static async getAllProviders() {
		const snapshot = await this.providers.get();

		//Returns the array which contains all of the docs
		return snapshot.docs.map((doc) => doc.data());
	}

	//This method will return an array of all of the requesters
	static async getAllRequesters() {
		const snapshot = await this.requesters.get();

		//Returns the array which contains all of the docs
		return snapshot.docs.map((doc) => doc.data());
	}

	//This method will return an array of all of the message objects
	static async getAllMessages() {
		const snapshot = await this.messages.get();

		//Returns the array which contains all of the docs
		return snapshot.docs.map((doc) => doc.data());
	}

	//This method will return an array containing an all products currently in the market (excluding the deleted ones)
	static async getAllProducts() {
		const snapshot = await this.products.get();

		//Returns the array which contains all the docs
		const array = snapshot.docs.map((doc) => doc.data());

		//Removes the example from product from the array along with products that have been deleted
		const newArray = array.filter((element) => {
			return (
				element.serviceTitle !== 'Example Service' &&
				!(element.isDeleted && element.isDeleted === true)
			);
		});

		//Sorts the array by highest average rating
		newArray.sort((a, b) => {
			return b.averageRating - a.averageRating;
		});

		//Returns the correct array
		return newArray;
	}

	//This method will take in an ID of a requester and then retrieve the requester from the firestore
	//database by getting a reference to the doc and then calling it from the database. If the user
	//doesn't exist, then -1 will be returned
	static async getRequesterByID(requesterID) {
		const ref = this.requesters.doc(requesterID + '');
		const doc = await ref.get();

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	}

	//This method will take in an ID of a requester and update the object with the fields that are passed in using an object which will
	//be the second parameter of the method. If the requester doesn't exist, then the method will return -1.
	static async updateRequesterByID(requesterID, updates) {
		const ref = this.requesters.doc(requesterID);
		try {
			await ref.update(updates);
		} catch (error) {
			return -1;
		}
		return 0;
	}

	//This method will take in an ID of a requester and then call the firestore database and get the
	//provider. If the user isn't found, then -1 is returned
	static async getProviderByID(providerID) {
		const ref = this.providers.doc(providerID + '');
		const doc = await ref.get();

		if (doc.exists) {
			return doc.data();
		} else {
			return -1;
		}
	}

	//This method will take in an ID of a provider and update the object with the fields that are passed in using an object which will
	//be the second parameter of the method. If the provider doesn't exist, then the method will return -1.
	static async updateProviderByID(providerID, updates) {
		const ref = this.providers.doc(providerID);
		try {
			await ref.update(updates);
		} catch (error) {
			return -1;
		}
		return 0;
	}

	//This method will take in an ID of a service and then call the firestore and retrieve that product
	//object
	static async getServiceByID(serviceID) {
		const ref = this.products.doc(serviceID + '');
		const doc = await ref.get();

		if (doc.exists) {
			return doc.data();
		}
		return -1;
	}

	//This method will take in an ID of a product and update the object with the fields that are passed in using an object which will
	//be the second parameter of the method. If the product doesn't exist, then the method will return -1.
	static async updateServiceByID(serviceID, updates) {
		const ref = this.products.doc(serviceID);
		try {
			await ref.update(updates);
		} catch (error) {
			return -1;
		}
		return 0;
	}

	//This method will take in an ID of a request and return that request object if it exists. If it doesn't, then
	//it will return -1
	static async getRequestByID(requestID) {
		const ref = this.requests.doc(requestID + '');
		const doc = await ref.get();

		if (doc.exists) {
			return doc.data();
		}
		return -1;
	}

	//This method will take in an ID of a request and update that request object with the fields that are passed in
	//as a second parameter. If the request doesn't exist, the method will return -1.
	static async updateRequestByID(requestID, updates) {
		const ref = this.products.doc(requestID);
		try {
			await ref.update(updates);
		} catch (error) {
			return -1;
		}
		return 0;
	}
	//This method will take in an ID of a requester and an ID of a provider and return the object
	//containing the conversation between the two
	static async getConversationByID(providerID, requesterID) {
		const ref = this.conversations
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
	}

	//This method will take in an ID of a conversation and update the object with the fields that are passed in using an object which will
	//be the second parameter of the method. If the conversation doesn't exist, then the method will return -1.
	static async updateCoversationByID(conversationID, updates) {
		const ref = this.messages.doc(conversationID);
		try {
			await ref.update(updates);
		} catch (error) {
			return -1;
		}
		return 0;
	}

	//This functions will take in a new requester ID and then will add that requester to the firestore
	//as a new requester with a unique requester ID and a username which will just be their email
	//without the "@". It will also accept a phone number and an address which are optional for requesters
	static async addRequesterToDatabase(userID, phoneNumber, coordinates, city, name) {
		const uid = userID;
		const ref = this.requesters.doc(uid);

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
			.doc('Example Business')
			.set({
				providerID: 'Example Business'
			});
		await ref
			.collection('BlockedUsers')
			.doc('MRWYHdcULQggTQlxyXwGbykY5r02')
			.set({
				providerID: 'MRWYHdcULQggTQlxyXwGbykY5r02'
			});

		//Logs the event in firebase analytics
		this.analytics.logEvent('requester_sign_up');
		//This is a promise that won't be resolved while offline
		return newRequester;
	}

	//This method will take in an image respose & the desired reference in which to call the image and upload it
	//to the firebase storage. This async function will take some time since image are 5-10 MB. Will be
	//used to upload product images
	static async uploadProductImage(reference, response) {
		//Fetches the absolute path of the image (depending on android or ios)
		let absolutePath = '';
		if (Platform.OS === 'android') {
			absolutePath = 'file://' + response.path;
		} else {
			absolutePath = response.path;
		}

		//Creates the reference & uploads the image (async)
		await this.storage.ref('products/' + reference).putFile(absolutePath);

		//Logs the event in firebase analytics
		this.analytics.logEvent('upload_product_image');

		return 0;
	}

	static async uploadRequesterImage(reference, response) {
		//Fetches the absolute path of the image (depending on android or ios)
		let absolutePath = '';
		if (Platform.OS === 'android') {
			absolutePath = 'file://' + response.path;
		} else {
			absolutePath = response.path;
		}
		//Creates the reference & uploads the image (async)
		await this.storage.ref('profilePictures/' + reference).putFile(absolutePath);
		//Logs the event in firebase analytics
		this.analytics.logEvent('upload_requester_profile_image');

		return 0;
	}

	//This method will take in a reference to a picture (the same as the product ID it is fetching)
	//and return the download URL for the image which is used as an image source
	static async getProductImageByID(ID) {
		//Creates the reference
		const uri = await this.storage.ref('products/' + ID).getDownloadURL();
		return { uri };
	}

	//This method will take in a reference to a picture (the same as the profile ID it is fetching)
	//and return the download URL for the image which is used as an image source
	static async getProfilePictureByID(ID) {
		//Creates the reference
		const uri = this.storage.ref('profilePictures/' + ID);
		try {
			const downloadURL = await uri.getDownloadURL();
			return { uri: downloadURL };
		} catch (error) {
			const downloadURL = await this.storage
				.ref('profilePictures/defaultProfilePic.png')
				.getDownloadURL();
			return { uri: downloadURL };
		}
	}

	//Sends a message by adding that conversation to the database. If the conversation is a new one,
	//then it will create a new messages object between the two communicators
	static async sendMessage(providerID, requesterID, message, isNewConversation) {
		if (isNewConversation === true) {
			const messageWithCorrectDate = {
				_id: message[0]._id,
				createdAt: new Date(message[0].createdAt).getTime(),
				text: message[0].text,
				user: message[0].user
			};
			//Retrieves the names of the requester and the provider so that can be added to the database
			//as well
			const provider = await this.getProviderByID(providerID);
			const requester = await this.getRequesterByID(requesterID);
			const newDoc = await this.conversations.add({
				providerID,
				requesterID,
				requesterName: requester.username,
				providerName: provider.companyName
			});
			await newDoc
				.collection('Messages')
				.doc(messageWithCorrectDate._id)
				.set(messageWithCorrectDate);
			//Notifies the user who RECIEVED the message (the opposite of whoever message[0].user is)
			//Notifies the provider whose service this belongs to
			if (message[0].user._id === providerID) {
				this.analytics.logEvent('new_conversation_started_from_provider');
				this.functions.httpsCallable('sendNotification')({
					topic: 'r-' + requesterID,
					title: provider.companyName,
					body: message[0].text
				});
			} else {
				this.analytics.logEvent('new_conversation_started_from_requester');
				this.functions.httpsCallable('sendNotification')({
					topic: 'p-' + providerID,
					title: requester.username,
					body: message[0].text
				});
			}
		} else {
			const requester = await this.getRequesterByID(requesterID);
			const provider = await this.getProviderByID(providerID);
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
			//Notifies the user who RECIEVED the message (the opposite of whoever message[0].user is)
			//Notifies the provider whose service this belongs to
			if (message[0].user._id === providerID) {
				this.analytics.logEvent('existing_conversation_send_message_from_provider');
				this.functions.httpsCallable('sendNotification')({
					topic: 'r-' + requesterID,
					title: provider.companyName,
					body: message[0].text
				});
			} else {
				this.analytics.logEvent('existing_conversation_send_message_from_requester');
				this.functions.httpsCallable('sendNotification')({
					topic: 'p-' + providerID,
					title: requester.username,
					body: message[0].text
				});
			}
		}
		return 0;
	}

	//this method will check if a review is due for a customer. If there is not, the function will return false.
	//If there is, then the function will return an object containing the necessary information for the customer
	//to complete the review
	static async isReviewDue(requesterID) {
		const requestsSub = await this.requesters
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
			const request = await this.getRequestByID(requestID);
			const service = await this.getServiceByID(request.serviceID);
			return {
				requestID: requestID,
				serviceID: service.serviceID,
				serviceTitle: service.serviceTitle
			};
		}
	}

	//This method is going to add a review to the array of reviews for a specified service. It will also
	//update the status of the review inside the requester's array of orderHistory.
	static async submitReview(serviceID, requesterID, stars, comment, requestID) {
		const requester = await this.getRequesterByID(requesterID);
		review = {
			requesterName: requester.username,
			stars,
			requesterID,
			requestID,
			comment
		};

		const service = await this.getServiceByID(serviceID);

		//Calculates the new average rating for the service
		const a = service.averageRating * service.totalReviews;
		const b = a + stars;
		const c = service.totalReviews + 1;
		const newRating = b / c;

		await this.updateServiceByID(serviceID, {
			averageRating: newRating,
			totalReviews: service.totalReviews + 1
		});

		//Fetches the document of the service so it can add the review as an object to the subcollection
		await this.products
			.doc(serviceID)
			.collection('Reviews')
			.doc(requestID)
			.set(review);

		//Adds the review to the request document
		await this.updateRequestByID(requestID, {
			review: review
		});

		//Indicates that the user has completed the review
		await this.requesters
			.doc(requesterID)
			.collection('Requests')
			.doc(requestID)
			.update({
				review: 'Done'
			});

		this.analytics.logEvent('submit_review');

		return 0;
	}

	//This method is going to update the review status of a specific product inside a requester object
	//to indicate that they have opted out of reviewing this product
	static async skipReview(requestID, requesterID) {
		//Indicates that the user has skipped the review
		await this.requesters
			.doc(requesterID)
			.collection('Requests')
			.doc(requestID)
			.update({
				review: 'Skipped'
			});
		this.analytics.logEvent('skip_review');
		return 0;
	}

	//Returns an array of all the conversation that this user has had, depending on if they are a
	//requseter or a provider
	static async getAllUserConversations(userID) {
		let allUserConversations = [];
		const ref = this.conversations.where('requesterID', '==', userID);
		const query = await ref.get();
		const docs = query.docs;
		for (const doc of docs) {
			const obj = await doc.get();
			const objWithConversation = this.getConversationByID(obj.providerID, obj.reqeusterID);
			allUserConversations.push(objWithConversation);
		}

		return allUserConversations;
	}

	//This method will take in a product ID and a requester ID and then delete that requester's request
	//from the subcollection of the product's current requests. It will also remove the request from the inProgress section of
	//the requester's orders array
	static async deleteRequest(productID, requesterID, requestID) {
		//updates the subcollection by removing the request
		await this.products
			.doc(productID)
			.collection('Requests')
			.doc(requestID)
			.delete();
		await this.requesters
			.doc(requesterID)
			.collection('Requests')
			.doc(requestID)
			.delete();
		await this.requests.doc(requestID).delete();

		//Fetches the necessary data to send a notification
		const product = await this.getServiceByID(productID);
		const requester = await this.getRequesterByID(requesterID);

		//Notifies the business that the request has been deleted.
		this.functions.httpsCallable('sendNotification')({
			topic: 'p-' + product.offeredByID,
			title: strings.RequestCancelled,
			body:
				requester.username + ' ' + strings.HasCancelledTheirRequestFor + ' ' + product.serviceTitle
		});

		//Logs the event in firebase analytics
		this.analytics.logEvent('delete_request');
		return 0;
	}

	//This method will take in a request object, which may contain a schedule, answers to questions, or both.
	//It will add this request object to the right locations. It will also take in an "isEditing" parameter
	//that will overwrite an old request for this product with the new request
	static async requestService(newRequest, isEditing) {
		//If this is a request being edited, the old request document will be edited, else it will be added
		if (isEditing === true) {
			await this.updateRequestByID(newRequest.requestID, newRequest);
		} else {
			const newRequest = await this.requests.add(newRequest);
			const requestID = newRequest.id;
			//Adds the ID to the request document
			await this.updateRequestByID(requestID, {
				requestID: requestID
			});

			//Adds the request reference to the product's subcollection as well as the requester's subcollection
			await this.products
				.doc(newRequest.serviceID)
				.collection('Requests')
				.doc(requestID)
				.set({
					isCompleted: false,
					requestID: requestID
				});
			await this.requesters
				.doc(newRequest.requesterID)
				.collection('Requests')
				.doc(requestID)
				.set({
					isCompleted: false,
					requestID: requestID
				});
		}

		//Fetches the correct fields in order to send a notification
		const service = await this.getServiceByID(newRequest.serviceID);
		const requester = await this.getRequesterByID(newRequest.reqeusterID);

		//If the request is a new one, then business will be notified. If it is an old one being edited, the business
		//will be notified of that as well
		if (isEditing === true) {
			this.functions.httpsCallable('sendNotification')({
				topic: 'p-' + service.offeredByID,
				title: strings.RequestUpdated,
				body:
					requester.username + ' ' + strings.HasUpdatedTheirRequestFor + ' ' + service.serviceTitle
			});

			//Logs the event in firebase analytics
			this.analytics.logEvent('overwrite_request');
		} else {
			this.functions.httpsCallable('sendNotification')({
				topic: 'p-' + service.offeredByID,
				title: strings.NewRequest,
				body: strings.YouHaveNewRequestFor + service.serviceTitle
			});

			//Logs the event in firebase analytics
			this.analytics.logEvent('request_service');
		}
		return 0;
	}

	//This method will take in a username of a user, the user's UID, and a string containing the issue.
	//Then it will add the issue to be viewed in the database (in the future, should send an email to
	//the email of the company)
	static async reportIssue(user, issue) {
		//tests whether or not the user is a requester or a provider and adds a "r-" or "p-" before their
		//ID respectivly
		const userID = user.requesterID ? 'r-' + user.requesterID : 'p-' + user;

		await this.issues.add({
			issue,
			userID
		});

		//Logs the event in firebase analytics
		this.analytics.logEvent('report_issue');
		return 0;
	}

	//This method will take in a request and a provider and block that provider from being able to sell
	//to the requester or get in contact with them. It does this by addind the provider's ID as a new document in
	//the subcollection
	static async blockCompany(requester, provider) {
		//Fetches the old array of blocked companies by this requester and appends this provider to
		//that list
		await this.requesters
			.doc(requester.requesterID)
			.collection('BlockedUsers')
			.doc(provider.providerID)
			.set({
				providerID: provider.providerID
			});

		//Also sends us a report to make sure the company is appropriate
		this.reportIssue(requester, {
			report: 'Report against a company',
			companyID: provider.providerID,
			companyName: provider.companyName
		});

		//Logs the event in firebase analytics
		this.analytics.logEvent('block_company');
		return 0;
	}

	//This method is going to return an array of providers that have been blocked by a requester. The array
	//will contain objects containing two fields: the provider's ID and the provider's company name
	static async getBlockedBusinessesByRequesterID(requesterID) {
		const docs = await this.requesters
			.doc(requesterID)
			.collection('BlockedUsers')
			.get();
		const docData = docs.docs.map((doc) => doc.data());
		const finalArray = [];
		for (const blocked of docData) {
			const { providerID } = blocked;
			//Removes the default businesses from the list of blocked users (unless it is our test account)
			//No matter what, don't add the Example Provider Document
			if (providerID !== 'Example Provider') {
				//If it is the test business account, only add it if it is on the requester test account
				if (providerID === 'MRWYHdcULQggTQlxyXwGbykY5r02') {
					if (requesterID === 'IaRNsJxXE4O6gdBqbBv24bo39g33') {
						const provider = await this.getProviderByID(providerID);
						finalArray.push({
							providerID: provider.providerID,
							companyName: provider.companyName
						});
					}
					//If it is just normal blocked user, add them to array
				} else {
					const provider = await this.getProviderByID(providerID);
					finalArray.push({
						providerID: provider.providerID,
						companyName: provider.companyName
					});
				}
			}
		}
		return finalArray;
	}

	//This method is going to take in a requesterID and a providerID and will unblock that specific businesses from
	//the requester's blocked businesses
	static async unblockCompany(requesterID, providerID) {
		await this.requesters
			.doc(requesterID)
			.collection('BlockedUsers')
			.doc(providerID)
			.delete();
		//Logs the event in firebase analytics
		this.analytics.logEvent('unblock_company');
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
		const requester = await this.getRequesterByID(uid);
		const provider = await this.getProviderByID(uid);
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

	//This method will take in an error message and log it into firebase firestore where errors
	//are stored
	static logIssue(error, userID) {
		//Adds it to the report issue section
		this.issues.add({
			userID,
			appError: true,
			errorName: error.name,
			errorMessage: error.message
		});

		//Logs the event in firebase analytics
		this.analytics.logEvent('log_issue');
	}

	//This method will set the current screen to a specific name in firebase analytics
	static setCurrentScreen(screenName, screenClassOverride) {
		this.analytics.setCurrentScreen(screenName, screenClassOverride);
	}
}
