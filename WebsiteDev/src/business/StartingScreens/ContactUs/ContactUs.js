import React, { useState } from 'react';
import './ContactUsStyle.css';
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
						<text className='title'>{strings.ContactUs}</text>
					</div>
					<div className='textContainer'>
						<text className='explanation'>{strings.LetsLaunch}</text>
					</div>
				</div>
				<div className='contactBorder'>
					<div className='heading1Container'>
						<div className='heading1'>{strings.ContactInformation}</div>
						<div>
							<div className='rowContainer'>
								<div className='contactInfoIcon'>
									<FontAwesomeIcon icon={['fas', 'map-marker-alt']} size='2x' />
								</div>
								<a
									className='contactInfoText'
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
									className='contactInfoText'
									href='mailto:helpcocontact@gmail.com'
									target='_blank'>
									{strings.HelpEmail}
								</a>
							</div>
							<div className='rowContainer'>
								<div className='contactInfoIcon'>
									<FontAwesomeIcon icon={['fas', 'phone']} size='2x' />
								</div>
								<a className='contactInfoText' href='tel:4252299185' target='_blank'>
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
								title='Go To Map'
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
					<text className='heading2'>{strings.LetsGrow}</text>
					<text className='subtitle2'>
						{strings.ReadyToStartWorkingTogether}
					</text>
				</div>
			{/* </div> */}
			<div className='formContainer'>
				<div className='emailNameContainer'>
					<HelpTextInput
						height={'7vh'}
						width={'45vw'}
						placeholder='E-mail Address'
						isMultiline={false}
						onChangeText={(email) => setEmail(email)}
					/>
					<HelpTextInput
						height='7vh'
						width={'45vw'}
						placeholder='Business Name (Optional)'
						isMultiline={false}
						onChangeText={(name) => setBusinessName(name)}
					/>
				</div>

				<HelpTextInput
					height={'35vh'}
					width={'95vw'}
					placeholder='Message'
					isMultiline={true}
					onChangeText={(message) => setMessage(message)}
				/>
			</div>
			<div className='buttonContainer'>
				<HelpButton
					title='SUBMIT'
					width={'15vw'}
					onPress={async () => {
						await FirebaseFunctions.call('sendEmail', {
							recepient: strings.HelpEmail,
							subject:
								businessName !== '' ? 'Contact Us Form from ' + businessName : 'Contact Us Form',
							text: message + '\nReply to: ' + email,
						});
					}}
				/>
			</div>
		</div>
	);
}
