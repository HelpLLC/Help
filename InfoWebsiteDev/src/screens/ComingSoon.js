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
import fontStyles from '../config/fontStyles';
import { SocialIcon } from 'react-social-icons';

// Creates the functional component
const ComingSoon = (props) => {
	// Global fields
	const { OS } = Platform;
	console.log(OS);

	// The state fields for the screen
	const [isLoading, setIsLoading] = useState(false);
	const [emailAddress, setEmailAddress] = useState('');

	// This method will subscribe the user by simply sending us an email with their email
	const notifyMe = async () => {
		setIsLoading(true);

		setIsLoading(false);
	};

	// Renders the component
	return (
		<div
			className='container'
			style={{ display: 'flex', flexDirection: OS === 'web' ? 'row' : 'column' }}>
			<div className='gradientContainer'>
				<img src={HelpLogo} className='helpLogo' />
				<text className='subTextStyle white'>{strings.HelpComingSoonMessage}</text>
                <div className='textSpacer' />
			</div>
			<div className='whiteContainer'>
				<div className='topSpacer' />
				<text className='bigTextStyle darkBlue bold'>{strings.WeAreComingSoon}</text>
				<div className='textSpacer' />
				<text className='smallTextStyle darkBlue'>{strings.SubscribeMessage}</text>
				<div className='subscribeRow'>
					<HelpTextInput
						height={'8vh'}
						width={'25vw'}
						placeholder={strings.EmailAddress}
						fontStyle={'mainTextStyle black bold'}
						onChangeText={(text) => setEmailAddress(text)}
						value={emailAddress}
						autoCompleteType='email'
					/>
					<HelpButton
						title={strings.NotifyMe}
						isLoading={isLoading}
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
		</div>
	);
};

// Exports the component
export default ComingSoon;
