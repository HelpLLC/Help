import React, { useState } from 'react';
import './ContactUsStyle.css';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import strings from '../../../config/strings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import map from './assets/map.svg';

export default function ContactUs() {
	const [email, setEmail] = useState('');
	const [businessName, setBusinessName] = useState('');
	const [message, setMessage] = useState('');

	const loadInBrowser = (url) => {
		window.open(url, '_blank');
	};

	return (
		<div className='contactUsContainer'>
			<div className='path'>
				<div className='textContainer'>
					<text className='bigSubTitleTextStyle white'>{strings.ContactUs}</text>
				</div>
				<div className='textContainer'>
					<text className='bigTitleTextStyle white'>{strings.LetsLaunch}</text>
				</div>
			</div>
			<div className='contactBorder'>
				<div className='heading1Container'>
					<div className='bigTitleTextStyle gray'>{strings.ContactInformation}</div>
					<div>
						<div className='rowContainer'>
							<div className='contactInfoIcon'>
								<FontAwesomeIcon icon={['fas', 'map-marker-alt']} size='2x' />
							</div>
							<a
								className='contactInfoText bigTextStyle darkBlue'
								href='https://www.google.com/maps/place/13543+NE+200th+St,+Woodinville,+WA+98072/@47.7726099,-122.1614489,17z/data=!3m1!4b1!4m5!3m4!1s0x54900e94272d1a0f:0x381c31df309db56d!8m2!3d47.7726063!4d-122.1592602'
								target='_blank'>
								{strings.HelpAddress}
							</a>
						</div>
						<div className='rowContainer'>
							<div className='contactInfoIcon'>
								<FontAwesomeIcon icon={['fas', 'envelope-square']} size='2x' />
							</div>
							<a
								className='contactInfoText bigTextStyle darkBlue'
								href='mailto:helpcocontact@gmail.com'
								target='_blank'>
								{strings.HelpEmail}
							</a>
						</div>
						<div className='rowContainer'>
							<div className='contactInfoIcon'>
								<FontAwesomeIcon icon={['fas', 'phone']} size='2x' />
							</div>
							<a
								className='contactInfoText bigTextStyle darkBlue'
								href='tel:4252299185'
								target='_blank'>
								{strings.HelpPhoneNumber}
							</a>
						</div>
					</div>
				</div>

				<div>
					<img src={map} className='mapImage' />
					<div className='mapButton'>
						<HelpButton
							width={'15vw'}
							title={strings.GoToMap}
							onPress={() =>
								loadInBrowser(
									'https://www.google.com/maps/place/13543+NE+200th+St,+Woodinville,+WA+98072/@47.7726099,-122.1614489,17z/data=!3m1!4b1!4m5!3m4!1s0x54900e94272d1a0f:0x381c31df309db56d!8m2!3d47.7726063!4d-122.1592602'
								)
							}
						/>
					</div>
				</div>
			</div>

			<div className='heading2Container'>
				<text className='bigTitleTextStyle gray'>{strings.LetsGrow}</text>
				<text className='subtitle2 bigSubTitleTextStyle blue'>
					{strings.ReadyToStartWorkingTogether}
				</text>
			</div>
			{/* </div> */}
			<div className='formContainer'>
				<div className='emailNameContainer'>
					<HelpTextInput
						height={'7vh'}
						width={'45vw'}
						placeholder={strings.EmailAddress}
						isMultiline={false}
						onChangeText={(email) => setEmail(email)}
					/>
					<HelpTextInput
						height='7vh'
						width={'45vw'}
						placeholder={strings.BusinessNameOptional}
						isMultiline={false}
						onChangeText={(name) => setBusinessName(name)}
					/>
				</div>

				<HelpTextInput
					height={'35vh'}
					width={'95vw'}
					placeholder={strings.Message}
					isMultiline={true}
					onChangeText={(message) => setMessage(message)}
				/>
			</div>
			<div className='submitContactButton'>
				<HelpButton
					title={strings.SubmitCapital}
					width={'15vw'}
					onPress={async () => {
						await FirebaseFunctions.call('sendEmail', {
							recepient: strings.HelpEmail,
							subject: 'Contact Us Form',
							text: message + '\n\nReply to: ' + email,
						});
					}}
				/>
			</div>
		</div>
	);
}
