// This will contain any functions that are responsible with communicating with Firebase
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firebase-firestore';

var firebaseConfig = {
	apiKey: 'AIzaSyDOgt8k63g6SUWvrP-dvu4LEUIbGAwsWDc',
	authDomain: 'help-technologies-e4e1c.firebaseapp.com',
	databaseURL: 'https://help-technologies-e4e1c.firebaseio.com',
	projectId: 'help-technologies-e4e1c',
	storageBucket: 'help-technologies-e4e1c.appspot.com',
	messagingSenderId: '127668734841',
	appId: '1:127668734841:web:2e9114165d61025d653da8',
	measurementId: 'G-DPVW5284H2',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const addSubscriber = async (email) => {
	await firebase.firestore().collection('subscribers').add({
		email,
	});

	return 0;
};

export { addSubscriber };
