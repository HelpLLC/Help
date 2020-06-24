// This is going to be the screen where some information about the company is displayed for mobile users
import React, { useState } from 'react';
import { addSubscriber } from '../config/FirebaseFunctions';
import './ComingSoonMobile.css';
import HelpLogo from '../assets/Logo1PNG.png';
import strings from '../config/strings';
import '../config/fontStyles.css';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import HelpButton from '../components/HelpButton/HelpButton';
import HelpAlert from '../components/HelpAlert/HelpAlert';
import { SocialIcon } from 'react-social-icons';

// Creates the functional component
const ComingSoonMobile = (props) => {
	// The state fields for the screen
	const [emailAddress, setEmailAddress] = useState('');
	const [emailAdded, setEmailAdded] = useState(false);

	// This method will subscribe the user by simply add their email to a collection in Firebase
	const notifyMe = async () => {
		addSubscriber(emailAddress);
		setEmailAdded(true);
		setEmailAddress('');
	};

	// Will render the UI of the screen
	return <div />;
};

// Exports the component
export default ComingSoonMobile;
