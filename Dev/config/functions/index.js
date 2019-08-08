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
        /*
        clientId: '464417078624-gfi1r3et1r4e1sahqdrl9f8gb4u6bou6.apps.googleusercontent.com',
        clientSecret: '5Vu6tigkwOzOy8kDSl12NWUs',
        refreshToken: '1/K7Cf_NrQo3b36ItU8jKdV6oEgejVk_Nm725-U9AWzfQ',
        accessToken: 'ya29.GlteB6zHV96KbFqtvvOuwFo1kyY4Vxj_gk-qutSSYZ_IP8SS7dVXWizrFpHYhWm3GZSepdGS47TT38wTJpVBv0zI2iA95P3uKnIgF3dExorZrHnCFVVGt_M3Btlq'
        */
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
                body
            }
        }
    );
    return 0;

});

//This method sends an automated email to helpcocontact@gmail.com saying that a new business
//has signed up and requires verification
exports.sendNewBusinessEmail = functions.https.onCall(async (input, context) => {

    //Fetches the business's name and description from the params
    const { businessName, businessInfo } = input;

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
        'Go on the Firebase Firestore to approve the account by changing the "isVerified" property to true';

    await mailTransport.sendMail(mailOptions);

    return 0;
})
