import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Linking } from 'react-native-web';
import HelpButton from '../../../components/HelpButton/HelpButton';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContactUsStyle from './ContactUsStyle';

export default function ContactUs() {
	const [email, setEmail] = useState('');
	const [businessName, setBusinessName] = useState('');
	const [message, setMessage] = useState('');

	const sendEmail = () => {
		const url = 'mailto:helpcocontact@gmail.com';
		window.open(url, '_blank');
	};

	const loadInBrowser = (url) => {
		window.open(url, '_blank');
	};

	return (
		<div className='contactUsContainer'>
			<View style={ContactUsStyle.imageContainer}>
				<Image style={ContactUsStyle.path} source={require('./images/path_1.png')} />
				<View style={ContactUsStyle.textContainer}>
					<Text style={ContactUsStyle.title}>Contact Us</Text>
				</View>
				<View style={ContactUsStyle.textContainer}>
					<Text style={ContactUsStyle.explanation}>Let's launch your business into success!</Text>
				</View>
				<View style={ContactUsStyle.contactBorder}>
					<View style={ContactUsStyle.heading1Container}>
						<View style={ContactUsStyle.heading1}>Contact Information</View>

						<View>
							<View style={ContactUsStyle.rowContainer}>
								<View style={ContactUsStyle.contactInfoIcon}>
									<FontAwesomeIcon icon={['fas', 'map-marker-alt']} size='2x' />
								</View>
								<Text style={ContactUsStyle.contactInfoText}>
									13543 NE 200th ST Woodinville, WA 98072
								</Text>
							</View>
							<View style={ContactUsStyle.rowContainer}>
								<View style={ContactUsStyle.contactInfoIcon}>
									<FontAwesomeIcon icon={['fas', 'envelope-square']} size='2x' />
								</View>
								<TouchableOpacity style={ContactUsStyle.contactInfoText} onPress={() => sendEmail}>
									helpcocontact@gmail.com
								</TouchableOpacity>
							</View>
							<View style={ContactUsStyle.rowContainer}>
								<View style={ContactUsStyle.contactInfoIcon}>
									<FontAwesomeIcon icon={['fas', 'phone']} size='2x' />
								</View>
								<TouchableOpacity
									style={ContactUsStyle.contactInfoText}
									onPress={() => {
										Linking.openURL('tel:4252299185');
									}}>
									+1 (425) 229-9185{' '}
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View style={ContactUsStyle.imageContainer}>
						<Image source={require('./images/map.png')} style={ContactUsStyle.mapImage} />
						<View style={ContactUsStyle.textContainer}>
							<HelpButton
								width={'15vw'}
								title='Go To Map'
								onPress={() =>
									loadInBrowser(
										'https://www.google.com/maps/place/13543+NE+200th+St,+Woodinville,+WA+98072/@47.7726099,-122.1614489,17z/data=!3m1!4b1!4m5!3m4!1s0x54900e94272d1a0f:0x381c31df309db56d!8m2!3d47.7726063!4d-122.1592602'
									)
								}
							/>
						</View>
					</View>
				</View>

				<View style={ContactUsStyle.heading2Container}>
					<Text style={ContactUsStyle.heading2}>Let's Grow Your Business</Text>
					<Text style={ContactUsStyle.subtitle2}>
						Ready to start working together? Have a general question? We're only an email away.
					</Text>
				</View>
			</View>
			<View style={ContactUsStyle.formContainer}>
				<View style={ContactUsStyle.emailNameContainer}>
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
				</View>

				<HelpTextInput
					height={'35vh'}
					width={'95vw'}
					placeholder='Message'
					isMultiline={true}
					onChangeText={(message) => setMessage(message)}
				/>
			</View>
			<View style={ContactUsStyle.buttonContainer}>
				<HelpButton
					title='SUBMIT'
					width={'15vw'}
					onPress={async () =>
						await FirebaseFunctions.call('sendEmail', {
							recepient: 'helpcocontact@gmail.com',
							subject: 'Contact Us Form from ' + businessName,
							text: message,
						})
					}
				/>
			</View>
		</div>
	);
}
