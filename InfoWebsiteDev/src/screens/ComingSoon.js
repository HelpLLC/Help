// This screen will be the one where users will be displayed with some information about Help and what we do, then
// they will be able to stay notified to know when the app will be released by subscribing to a newsletter
import React, { useState } from 'react';
import './ComingSoon.css';
import HelpLogo from '../assets/Logo1PNG.png';
import strings from '../config/strings';
import { Platform } from 'react-native-web';
import '../config/fontStyles.css';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import HelpButton from '../components/HelpButton/HelpButton';
import HelpAlert from '../components/HelpAlert/HelpAlert';
import { SocialIcon } from 'react-social-icons';
import { addSubscriber } from '../config/FirebaseFunctions';

// Creates the functional component
const ComingSoon = (props) => {
	// Global fields
	const { OS } = Platform;

	// The state fields for the screen
	const [emailAddress, setEmailAddress] = useState('');
	const [emailAdded, setEmailAdded] = useState(false);

	// This method will subscribe the user by simply add their email to a collection in Firebase
	const notifyMe = async () => {
		addSubscriber(emailAddress);
		setEmailAdded(true);
		setEmailAddress('');
	};

	// Renders the component
	return (
		<div
			className='container'
			style={{ display: 'flex', flexDirection: OS === 'web' ? 'row' : 'column' }}>
			<div className='gradientContainer'>
				<img alt={'Help - Get Things Done Logo'}src={HelpLogo} className='helpLogo' />
				<div className='subTextStyle white'>{strings.HelpComingSoonMessage}</div>
				<div className='textSpacer' />
			</div>
			<div className='whiteContainer'>
				<div className='topSpacer' />
				<div className='bigTextStyle darkBlue bold'>{strings.WeAreComingSoon}</div>
				<div className='textSpacer' />
				<div className='mainTextStyle darkBlue'>{strings.SubscribeMessage}</div>
				<div className='subscribeRow'>
					<HelpTextInput
						height={'8vh'}
						width={'25vw'}
						isMultiline={false}
						placeholder={strings.EmailAddress}
						fontStyle={'mainTextStyle black bold'}
						onChangeText={(text) => setEmailAddress(text)}
						value={emailAddress}
						autoCompleteType='email'
					/>
					<HelpButton
						title={strings.NotifyMe}
						onPress={() => notifyMe()}
						fontStyle={'mainTextStyle white bold'}
						width={'15vw'}
						height={'8vh'}
					/>
				</div>
				<div className='socialMediaRow'>
					<SocialIcon url={'https://twitter.com/llc_help'} />
					<SocialIcon url={'https://www.instagram.com/realhelpllc/'} />
					<SocialIcon url={'https://www.facebook.com/realhelpllc/'} />
					<SocialIcon url={'https://www.linkedin.com/company/helpllc/'} />
				</div>
			</div>
			<HelpAlert
				isVisible={emailAdded}
				onClose={() => setEmailAdded(false)}
				titleText={strings.Great}
				messageText={strings.EmailAddedMessage}
			/>
		</div>
	);
};

// Exports the component
export default ComingSoon;
