const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://help-d194d.firebaseio.com'
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

//Method sends a notification with a custom title and body to a specific topic (user)
exports.sendNotification = functions.https.onCall(async (input, context) => {
	const { topic, title, body } = input;
	await admin.messaging().sendToTopic(topic, {
		notification: {
			title,
			body
		}
	});
	return 0;
});

//Method detects when a new business user has been verified & sends them a notification saying they're
//good to go
exports.businessGoodToGo = functions.firestore.document('providers/{providerID}').onUpdate(async (change, context) => {
	if (change.after.data().isVerified === true && change.before.data().isVerified === false) {
		const topic = 'p-' + change.after.data().providerID;
		await admin.messaging().sendToTopic(topic, {
			notification: {
				title: "You're good to go",
				body: "You're account has been verified and accepted. Create your first product now!"
			}
		});
	}

	return 0;
});

//This method sends an automated email to helpcocontact@gmail.com saying that a new business
//has signed up and requires verification
exports.sendNewBusinessEmail = functions.https.onCall(async (input, context) => {
	//Fetches the business's name and description from the params
	const { businessName, businessInfo, businessEmail, businessPhoneNumber, businessLocation, businessWebsite, providerID } = input;

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
			businessName +
			'\n\n' +
			'Business Description: ' +
			businessInfo +
			'\n\n' +
			'Business Email: ' +
			businessEmail +
			'\n\n' +
			'Business Phone Number: ' +
			businessPhoneNumber +
			'\n\n' +
			'This user is currently on an older version of the app. To approve or decline them, you must manually change the "isVerified" field in Cloud Firestore.' +
			'\n\nHelp LLC';
	} else {
		//The text of the email
		mailOptions.text =
			'A new business has signed up on Help. Here is its information.\n\n' +
			'Business Name: ' +
			businessName +
			'\n\n' +
			'Business Description: ' +
			businessInfo +
			'\n\n' +
			'Business Email: ' +
			businessEmail +
			'\n\n' +
			'Business Phone Number: ' +
			businessPhoneNumber +
			'\n\n' +
			'Business Location: ' +
			businessLocation +
			'\n\n' +
			'Business Site: ' +
			businessWebsite +
			'\n\n' +
			'To approve this busisness, click this link: \n' +
			'https://us-central1-help-d194d.cloudfunctions.net/verifyBusiness?businessEmail=' +
			businessEmail +
			'&providerID=' +
			providerID +
			'\n\n' +
			'To decline this business, click this link: \n' +
			'https://us-central1-help-d194d.cloudfunctions.net/declineBusiness?businessEmail=' +
			businessEmail +
			'&providerID=' +
			providerID +
			'\n\nHelp LLC';
	}

	await mailTransport.sendMail(mailOptions);

	return 0;
});

//This function is going to take in a providerID and verify them by changing the "isVerified" field
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

//This function is going to take in a providerID and email and decline their request to be a verified
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

		//Deletes the user object from firestore and deletes the user from Firebase Authentication
		const auth = admin.auth();
		await auth.deleteUser(providerID);

		const firestore = admin.firestore();
		const providerObject = firestore.collection('providers').doc(providerID);
		await providerObject.delete();

		res.send('Business has been declined');
	} catch (error) {
		res.send(error);
	}
	return 0;
});
