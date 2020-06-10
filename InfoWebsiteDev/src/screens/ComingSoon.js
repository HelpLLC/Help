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
import { isMobile } from 'react-device-detect';
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
			style={{ display: 'flex', flexDirection: !isMobile ? 'row' : 'column' }}>
			<div className={isMobile ? 'gradientContainerMobile' : 'gradientContainer'}>
				<img
					alt={'Help - Get Things Done Logo'}
					src={HelpLogo}
					className={isMobile ? 'helpLogoMobile' : 'helpLogo'}
				/>
				<div className={isMobile ? 'bigTextStyle white' : 'subTextStyle white'}>
					{strings.HelpComingSoonMessage}
				</div>
				<div className={isMobile ? 'textSpacerMobile' : 'textSpacer'} />
			</div>
			<div className={isMobile ? 'whiteContainerMobile' : 'whiteContainer'}>
				<div className={isMobile ? 'topSpacerMobile' : 'topSpacer'} />
				<div
					className={
						isMobile ? 'bigSubTitleTextStyle darkBlue bold' : 'bigTextStyle darkBlue bold'
					}>
					{strings.WeAreComingSoon}
				</div>
				<div className={isMobile ? 'textSpacer' : 'textSpacerMobile'} />
				<div className={isMobile ? 'bigTextStyle darkBlue' : 'mainTextStyle darkBlue'}>
					{strings.SubscribeMessage}
				</div>
				<div className={isMobile ? 'subscribeRowMobile' : 'subscribeRow'}>
					<HelpTextInput
						height={isMobile ? '4vh' : '8vh'}
						width={isMobile ? '65vw' : '50vw'}
						isMultiline={false}
						placeholder={strings.EmailAddress}
						onChangeText={(text) => setEmailAddress(text)}
						value={emailAddress}
						autoCompleteType='email'
					/>
					{isMobile ? <div className={'textSpacerMobile'} /> : <div />}
					<HelpButton
						title={strings.NotifyMe}
						onPress={() => notifyMe()}
						fontStyle={isMobile ? 'bigTextStyle white bold' : 'mainTextStyle white bold'}
						width={isMobile ? '45vw' : '30vw'}
						height={isMobile ? '4vh' : '8vh'}
					/>
				</div>
				<div className={isMobile ? 'socialMediaRowMobile' : 'socialMediaRow'}>
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
