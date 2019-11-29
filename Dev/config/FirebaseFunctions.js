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
	static messages = this.database.collection('messages');
	static issues = this.database.collection('issues');
	static helpDev = this.database.collection('helpDev');

	//This method is going to test whether a provider object has all the fields required as of the 2.0 update
	//It will return a boolean true or false based on that
	static isProviderUpToDate(providerObject) {
		return providerObject.phoneNumber && providerObject.location && providerObject.coordinates;
	}

	//This method is going to test whether a requester object has all the fields required as of the 2.0 update
	//It will return a boolen true or false based on that
	static isRequesterUpToDate(requesterObject) {
		return requesterObject.city && requesterObject.coordinates && requesterObject.phoneNumber;
	}

	//This method will return an array containing an all products currently in the market
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

	//This method will take in an ID of a requester and an ID of a provider and return the object
	//containing the conversation between the two
	static async getConversationByID(providerID, requesterID) {
		const ref = this.messages
			.where('providerID', '==', providerID)
			.where('requesterID', '==', requesterID)
			.limit(1);
		const query = await ref.get();

		if (query.docs.length > 0) {
			const doc = query.docs[0];
			const docData = doc.data();
			//Sorts the conversation messages by time
			const conversationMessages = docData.conversationMessages.sort((a, b) => {
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
	static async addRequesterToDatabase(account, phoneNumber, coordinates, city, name) {
		const batch = this.database.batch();
		const uid = account.user.uid;
		const ref = this.requesters.doc(uid);

		const newRequester = {
			requesterID: uid,
			username: name,
			phoneNumber,
			coordinates,
			city,
			orderHistory: {
				inProgress: [],
				completed: []
			},
			blockedUsers: ['Example Business', 'MRWYHdcULQggTQlxyXwGbykY5r02']
		};

		batch.set(ref, newRequester);
		await batch.commit();

		//Logs the event in firebase analytics
		this.analytics.logEvent('requester_sign_up');
		//This is a promise that won't be resolved while offline
		return newRequester;
	}

	//This function will take in a new provider ID and then will add that new provider to the firestore
	//as a new provider with a unique provider ID and a username which will just be their email without
	//the "@". It will also have the companyName and the companyDescription that is passed along with a phone
	//number. Must wait for verfication by developers (default value for "isVerified" is false), when switched to true,
	//user can log in
	static async addProviderToDatabase(account, newProvider) {
		const batch = this.database.batch();
		const uid = account.user.uid;
		const ref = this.providers.doc(uid);

		batch.set(ref, newProvider);
		await batch.commit();

		this.functions.httpsCallable('sendNewBusinessEmail')({
			businessName: newProvider.companyName,
			businessInfo: newProvider.companyDescription,
			providerID: account.user.uid,
			businessEmail: account.user.email,
			businessPhoneNumber: newProvider.phoneNumber,
			businessLocation: newProvider.location,
			businessWebsite: newProvider.website
		});
		//Logs the event in firebase analytics
		this.analytics.logEvent('provider_sign_up');
		return newProvider;
	}

	//This method will take in an image respose & the desired reference in which to call the image and upload it
	//to the firebase storage. This async function will take some time since image are 5-10 MB. Will be
	//used to upload product images
	static async uploadImage(reference, response) {
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

	//This method will take information about a new product and add it to the firestore database. It will
	//first add it to the firestore containing products, then it will add the service IDs to the provider
	//products
	static async addProductToDatabase(providerID, newProductObject) {
		//Creates the product object & the pricing text to be displayed to users
		const { price, response } = newProductObject;
		let pricing =
			price.priceType === 'per'
				? '$' + price.price + ' ' + strings.per + ' ' + price.per
				: price.priceType === 'range'
				? '$' + price.min + ' ' + strings.to + ' $' + price.max
				: '$' + price.priceFixed;
		//Fetches the provider by their ID so they can get some required information
		const provider = await this.getProviderByID(providerID);
		const { coordinates, location, companyName } = provider;
		//Adds the remaining required fields to the object
		let product = {
			...newProductObject,
			requests: {
				currentRequests: [],
				completedRequests: []
			},
			pricing,
			offeredByID: providerID,
			coordinates,
			location,
			offeredByName: companyName,
			category: 'Cleaning',
			averageRating: 0,
			totalReviews: 0,
			reviews: []
		};

		//deletes the response field from the object going into firebase
		delete product.response;

		//Adds the product to the database of products
		const newProduct = await this.products.add(product);

		//Uploads the image to the database (longest process)
		await this.uploadImage(newProduct.id, response);

		//Will deal with the ID of the product by adding it as a field and pushing to the
		//provider's field
		await this.updateServiceByID(newProduct.id, {
			serviceID: newProduct.id
		});
		await this.updateProviderByID(providerID, {
			serviceIDs: firebase.firestore.FieldValue.arrayUnion(newProduct.id)
		});
		//Logs the event in firebase analytics
		this.analytics.logEvent('create_service');

		return 0;
	}

	//This function is going to remove a business's reference to a service as well as give this service
	//a "isDeleted" field of true to make sure it does not appear for customers. It will still remain in the database
	//so it can be referenced to in a customer's order history and/or reviews. Additionally, it is going to remove
	//all exisitng requests that are in this service & send customers notifications saying the service has been
	//deleted
	static async deleteService(serviceID, providerID) {
		await this.updateServiceByID(serviceID, {
			isDeleted: true
		});

		const provider = await this.getProviderByID(providerID);
		let { serviceIDs } = provider;
		let indexOfService = serviceIDs.findIndex((productID) => {
			return productID === serviceID;
		});
		serviceIDs.splice(indexOfService, 1);
		await this.updateProviderByID(providerID, {
			serviceIDs
		});

		//Deletes all current requests for the service & notifies the customers
		const service = await this.getServiceByID(serviceID);
		const currentRequests = service.requests.currentRequests;
		for (const request of currentRequests) {
			await this.deleteRequest(serviceID, request.requesterID);
			this.functions.httpsCallable('sendNotification')({
				topic: 'r-' + request.requesterID,
				title: strings.RequestRemoved,
				body:
					strings.YourRequestFor +
					' ' +
					service.serviceTitle +
					' ' +
					strings.HasBeenRemovedBecause +
					' ' +
					service.offeredByName +
					' ' +
					strings.NoLongerSellsThisService
			});
		}

		this.analytics.logEvent('delete_service');
		return 0;
	}

	//Sends a message by adding that conversation to the database. If the conversation is a new one,
	//then it will create a new messages object between the two communicators
	static async sendMessage(providerID, requesterID, message, isNewConversation) {
		if (isNewConversation === true) {
			const conversationMessages = [];
			const messageWithCorrectDate = {
				_id: message[0]._id,
				createdAt: new Date(message[0].createdAt).getTime(),
				text: message[0].text,
				user: message[0].user
			};
			conversationMessages.push(messageWithCorrectDate);
			//Retrieves the names of the requester and the provider so that can be added to the database
			//as well
			const provider = await this.getProviderByID(providerID);
			const requester = await this.getRequesterByID(requesterID);
			await this.messages.add({
				conversationMessages,
				providerID,
				requesterID,
				requesterName: requester.username,
				providerName: provider.companyName
			});
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
			const ref = this.messages
				.where('providerID', '==', providerID)
				.where('requesterID', '==', requesterID);
			const query = await ref.get();
			const doc = query.docs[0];
			const conversationID = doc.id;
			const messageWithCorrectDate = {
				_id: message[0]._id,
				createdAt: new Date(message[0].createdAt).getTime(),
				text: message[0].text,
				user: message[0].user
			};
			await this.updateCoversationByID(conversationID, {
				conversationMessages: firebase.firestore.FieldValue.arrayUnion(messageWithCorrectDate)
			});
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

	//This method is going to add a review to the array of reviews for a specified service. It will also
	//update the status of the review inside the requester's array of orderHistory.
	static async submitReview(serviceID, requesterID, stars, comment) {
		const requester = await this.getRequesterByID(requesterID);
		review = {
			requesterName: requester.username,
			stars,
			requesterID,
			comment
		};

		const service = await this.getServiceByID(serviceID);

		//Calculates the new average rating for the service
		const a = service.averageRating * service.totalReviews;
		const b = a + stars;
		const c = service.totalReviews + 1;
		const newRating = b / c;

		await this.updateServiceByID(serviceID, {
			reviews: firebase.firestore.FieldValue.arrayUnion(review),
			averageRating: newRating,
			totalReviews: service.totalReviews + 1
		});

		//Updates the requester object's completed array with the new review specific to this object
		let { orderHistory } = requester;
		const indexOfCompletedRequest = orderHistory.completed.findIndex((eachCompleted) => {
			return eachCompleted.serviceID === serviceID && eachCompleted.review === null;
		});
		orderHistory.completed[indexOfCompletedRequest].review = review;
		await this.updateRequesterByID(requesterID, {
			orderHistory
		});

		this.analytics.logEvent('submit_review');

		return 0;
	}

	//This method is going to update the review status of a specific product inside a requester object
	//to indicate that they have opted out of reviewing this product
	static async skipReview(serviceID, requesterID) {
		const requester = await this.getRequesterByID(requesterID);
		let { orderHistory } = requester;
		const indexOfCompletedRequest = orderHistory.completed.findIndex((eachCompleted) => {
			return eachCompleted.serviceID === serviceID && eachCompleted.review === null;
		});
		orderHistory.completed[indexOfCompletedRequest].review = 'None';
		await this.updateRequesterByID(requesterID, {
			orderHistory
		});

		this.analytics.logEvent('skip_review');
		return 0;
	}

	//Returns an array of all the conversation that this user has had, depending on if they are a
	//requseter or a provider
	static async getAllUserConversations(userID, isRequester) {
		let allUserConversations = [];
		if (isRequester === true) {
			const ref = this.messages.where('requesterID', '==', userID);
			const query = await ref.get();
			const docs = query.docs;
			allUserConversations = docs.map((doc) => doc.data());
		} else {
			const ref = this.messages.where('providerID', '==', userID);
			const query = await ref.get();
			const docs = query.docs;
			allUserConversations = docs.map((doc) => doc.data());
		}

		return allUserConversations;
	}

	//This method will update the information for a provider by taking in the new provider object and overwriting it in firebase
	static async updateProviderInfo(providerID, newProviderInfo) {
		await this.updateProviderByID(providerID, newProviderInfo);

		//Goes through and edits all of the products that belong to this business & updated the
		//field that connects them to the correct provider to the new businessName
		const query = this.products.where('offeredByID', '==', providerID);
		const result = await query.get();
		for (const doc of result.docs) {
			await this.updateServiceByID(doc.id, {
				offeredByName: newProviderInfo.companyName,
				coordinates: newProviderInfo.coordinates,
				location: newProviderInfo.location
			});
		}

		//Logs the event in firebase analytics
		this.analytics.logEvent('update_company_profile');
		return 0;
	}

	//This method will update the information for a specific product by taking in all of the new
	//product information and updating those fields in firestore
	static async updateServiceInfo(productID, newProductObject) {
		const { response, price } = newProductObject;
		//Creates the product object & the pricing text to be displayed to users
		let pricing =
			price.priceType === 'per'
				? '$' + price.price + ' ' + strings.per + ' ' + price.per
				: price.priceType === 'range'
				? '$' + price.min + ' ' + strings.to + ' $' + price.max
				: '$' + price.priceFixed;
		let updatedProductObjectWithPrice = {
			...newProductObject,
			pricing
		};
		//Deletes the response field from the product that is going into firebase
		delete updatedProductObjectWithPrice.response;
		await this.updateServiceByID(productID, updatedProductObjectWithPrice);

		//Removes the old image and then uploads the new one if the image has been changed
		if (response !== null) {
			const imageRef = this.storage.ref('products/' + productID);

			await imageRef.delete();
			await this.uploadImage(productID, response);
		}

		//Logs the event in firebase analytics
		this.analytics.logEvent('update_product_info');
		return 0;
	}

	//This method will take in a product ID and a requester ID and then delete that requester's request
	//from the array of the product's current requests. It will also remove the request from the inProgress section of
	//the requester's orders array
	static async deleteRequest(productID, requesterID) {
		const ref = this.products.doc(productID);
		const doc = await ref.get();

		//Creates a copy of the array of requests minus the request corresponding to this requester ID
		const oldRequests = doc.data().requests.currentRequests;
		const indexOfRequest = oldRequests.findIndex((request) => {
			return request.requesterID === requesterID;
		});

		oldRequests.splice(indexOfRequest, 1);
		await this.updateServiceByID(productID, {
			requests: {
				currentRequests: oldRequests,
				completedRequests: doc.data().requests.completedRequests
			}
		});

		const requester = await this.getRequesterByID(requesterID);
		let { inProgress } = requester.orderHistory;
		const indexOfRequestInOrderHistory = inProgress.findIndex((request) => {
			return request.serviceID === productID;
		});
		inProgress.splice(indexOfRequestInOrderHistory, 1);
		await this.updateRequesterByID(requesterID, {
			orderHistory: {
				inProgress,
				completed: requester.orderHistory.completed
			}
		});

		//Logs the event in firebase analytics
		this.analytics.logEvent('delete_request');
		return 0;
	}

	//This method will take in a product ID and a requester ID and then complete the request by removing
	//it from the array of current requests and adding it to the array of completed requests. It also removes
	//the service from the "inProgress" section of the orderHistory to the "completed section"
	static async completeRequest(productID, requesterID) {
		const ref = this.products.doc(productID);
		const doc = await ref.get();
		const product = doc.data();

		const requestToComplete = product.requests.currentRequests.find((eachRequest) => {
			return eachRequest.requesterID === requesterID;
		});

		//Gets the old array of completed requests and adds the new completed request to that array,
		//then sets that new array to it
		const newCompletedRequest = {
			dateCompleted: new Date().toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			}),
			...requestToComplete
		};

		let arrayOfCompletedRequests = product.requests.completedRequests;
		arrayOfCompletedRequests.push(newCompletedRequest);

		await this.updateServiceByID(productID, {
			requests: {
				completedRequests: arrayOfCompletedRequests,
				currentRequests: product.requests.currentRequests
			}
		});

		const requester = await this.getRequesterByID(requesterID);
		const { orderHistory } = requester;
		let { completed } = orderHistory;
		completed.push({
			...requestToComplete,
			dateCompleted: new Date().toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			}),
			review: null
		});

		await this.updateRequesterByID(requesterID, {
			orderHistory: {
				inProgress: orderHistory.inProgress,
				completed
			}
		});

		await this.deleteRequest(productID, requesterID);

		//Logs the event in firebase analytics
		this.analytics.logEvent('complete_request');
		return 0;
	}

	//This method will take in a request object, which may contain a schedule, answers to questions, or both.
	//It will add this request object to the right locations
	static async requestService(newRequest) {
		const ref = this.products.doc(newRequest.serviceID);
		const doc = await ref.get();
		const requester = await this.getRequesterByID(newRequest.requesterID);

		let arrayOfCurrentRequests = doc.data().requests.currentRequests;
		arrayOfCurrentRequests.push(newRequest);

		await this.updateServiceByID(newRequest.serviceID, {
			requests: {
				completedRequests: doc.data().requests.completedRequests,
				currentRequests: arrayOfCurrentRequests
			}
		});

		let { inProgress } = requester.orderHistory;
		inProgress.push(newRequest);
		await this.updateRequesterByID(requester.requesterID, {
			orderHistory: {
				inProgress,
				completed: requester.orderHistory.completed
			}
		});

		//Notifies the provider whose service this belongs to
		this.functions.httpsCallable('sendNotification')({
			topic: 'p-' + doc.data().offeredByID,
			title: strings.NewRequest,
			body: strings.YouHaveNewRequestFor + doc.data().serviceTitle
		});
		//Logs the event in firebase analytics
		this.analytics.logEvent('request_service');
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
	//to the requester or get in contact with them. It does this by addind the provider's ID to the array
	//of blocked users that belongs to the requesters
	static async blockCompany(requester, provider) {
		//Fetches the old array of blocked companies by this requester and appends this provider to
		//that list
		await this.updateRequesterByID(requester.requesterID, {
			blockedUsers: firebase.firestore.FieldValue.arrayUnion(provider.providerID)
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

	//This method is going to take in a requesterID and a providerID and will unblock that specific businesses from
	//the requester's blocked businesses
	static async unblockCompany(requesterID, providerID) {
		const requester = await this.getRequesterByID(requesterID);
		let blockedUsers = requester.blockedUsers;
		const indexOfBlockedBusiness = blockedUsers.findIndex((element) => {
			return element.providerID === providerID;
		});
		blockedUsers.splice(indexOfBlockedBusiness, 1);
		await this.updateRequesterByID(requesterID, {
			blockedUsers
		});
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

		if (requester === -1) {
			//Logs the event in firebase analytics
			this.analytics.logEvent('provider_log_in');
			//Subscribes to the provider channel
			const topicName = 'p-' + uid;
			await this.fcm.subscribeToTopic(topicName);
			return topicName;
		} else {
			//Logs the event in firebase analytics
			this.analytics.logEvent('customer_log_in');
			//Subscribes to the requester channel
			const topicName = 'r-' + uid;
			await this.fcm.subscribeToTopic(topicName);
			return topicName;
		}
	}

	//This method will log out the current user of the app & unsubscribed to the notification channel associated with
	//this user
	static async logOut(isRequester, uid) {
		//Logs the event in firebase analytics & unsubcribes from the notification service
		await firebase.auth().signOut();
		if (isRequester === true) {
			this.analytics.logEvent('customer_log_out');
			this.fcm.unsubscribeFromTopic('r-' + uid);
		} else {
			this.analytics.logEvent('provider_log_out');
			this.fcm.unsubscribeFromTopic('p-' + uid);
		}
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
