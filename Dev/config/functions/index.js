const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://help-d194d.firebaseio.com"
});

//Configures email for automated emails
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'helpcocontact@gmail.com',
        pass: 'techBusiness123',
    },
    tls: {
        rejectUnauthorized: false
    }
});

//Method sends a notification with a custom title and body to a specific topic (user)
exports.sendNotification = functions.https.onCall(async (input, context) => {

    const { topic, title, body } = input;
    await admin.messaging().sendToTopic(topic,
        {
            notification: {
                title,
                body,
            }
        }
    );
    return 0;

});

//Method detects when a new business user has been verified & sends them a notification saying they're
//good to go
exports.businessGoodToGo = functions.firestore.document('providers/{providerID}').onUpdate(async (change, context) => {

    if (change.after.data().isVerified === true && change.before.data().isVerified === false) {
        const topic = "p-" + change.after.data().providerID;
        await admin.messaging().sendToTopic(topic,
            {
                notification: {
                    title: "You're good to go",
                    body: "You're account has been verified and accepted. Create your first product now!",
                }
            }
        );
    }

    return 0;

});

//This method sends an automated email to helpcocontact@gmail.com saying that a new business
//has signed up and requires verification
exports.sendNewBusinessEmail = functions.https.onCall(async (input, context) => {

    //Fetches the business's name and description from the params
    const { businessName, businessInfo, businessEmail, businessPhoneNumber } = input;

    //Configures the email subject, to, and from
    const mailOptions = {
        from: 'Help <helpcocontact@gmail.com>',
        to: "helpcocontact@gmail.com",
        subject: "New Business"
    };

    //The text of the email
    mailOptions.text = 'A new business has signed up on Help. Here is its information.\n\n' +
        'Business Name: ' + businessName + "\n\n" +
        'Business Description: ' + businessInfo + "\n\n" +
        'Business Email: ' + businessEmail + "\n\n" + 
        'Business Phone Number: ' + businessPhoneNumber + "\n\n" +
        'Go on the Firebase Firestore to approve the account by changing the "isVerified" property to true';

    await mailTransport.sendMail(mailOptions);

    return 0;
})
