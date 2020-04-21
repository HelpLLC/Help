import React, { useState } from 'react';
// import './ContactUs.css';
import { View, Image, Text, TouchableOpacity, Linking } from 'react-native-web';
import HelpButton from '../../../components/HelpButton/HelpButton';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import colors from '../../../config/colors';
import { screenHeight, screenWidth } from '../../../config/dimensions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconLookup, IconDefinition, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGlassMartiniAlt } from '@fortawesome/free-solid-svg-icons';

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
		<View
			style={{
				flexDirection: 'column',
				height: screenHeight,
				width: screenWidth,
				justifyContent: 'flex-start',
			}}>
			<View
				style={{
					alignItems: 'center',
				}}>
				<Image
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						height: '50%',
						opacity: 1,
					}}
					source={require('./images/path_1.png')}
				/>
				<View
					style={{
						marginTop: '5%',
					}}>
					<Text
						style={{
							fontFamily: 'Lucida Grande',
							fontSize: '87px',
							textAlign: 'left',
							color: '#ffffff',
						}}>
						Contact Us
					</Text>
				</View>
				<View
					style={{
						marginTop: '5%',
					}}>
					<Text
						style={{
							overflow: 'hidden',
							fontFamily: 'Lucida Grande',
							fontSize: '130px',
							textAlign: 'center',
							lineHeight: '130px',
							color: '#ffffff',
						}}>
						Let's launch your business into success!
					</Text>
				</View>
				<View
					style={{
						marginTop: '20%',
						borderRadius: '25px',
						border: '2px solid #5cc6bc',
						boxShadow: '0px 3px 5px 1px rgba(92, 198, 188, 2.55)',
						flexDirection: 'row',
						padding: '20px',
					}}>
					<View
						style={{
							flexDirection: 'column',
						}}>
						<View
							style={{
								fontFamily: 'Lucida Grande',
								fontSize: '56px',
								textAlign: 'left',
								color: '#567681',
							}}>
							Contact Information
						</View>

						<View>
							<View style={{ flexDirection: 'row' }}>
								<FontAwesomeIcon
									icon={['fas', 'map-marker-alt']}
									style={{
										overflow: 'hidden',
										fontFamily: 'Lucida Grande',
										fontSize: '35px',
										textAlign: 'left',
										color: '#000000',
										marginTop: '2.5%',
									}}
								/>
								<Text
									style={{
										overflow: 'hidden',
										fontFamily: 'Lucida Grande',
										fontSize: '40px',
										textAlign: 'left',
										color: '#567681',
										marginTop: '2%',
										marginLeft: '2%',
									}}>
									13543 NE 200th ST Woodinville, WA 98072
								</Text>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<FontAwesomeIcon
									icon={['fas', 'envelope-square']}
									style={{
										overflow: 'hidden',
										fontFamily: 'Lucida Grande',
										fontSize: '40px',
										textAlign: 'left',
										color: '#000000',
										marginTop: '2.5%',
									}}
								/>
								<TouchableOpacity
									style={{
										overflow: 'hidden',
										fontFamily: 'Lucida Grande',
										fontSize: '40px',
										textAlign: 'left',
										color: '#567681',
										marginTop: '2%',
										marginLeft: '2%',
									}}
									onPress={() => sendEmail}>
									helpcocontact@gmail.com
								</TouchableOpacity>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<FontAwesomeIcon
									icon={['fas', 'phone']}
									style={{
										overflow: 'hidden',
										fontFamily: 'Lucida Grande',
										fontSize: '35px',
										textAlign: 'left',
										color: '#000000',
										marginTop: '3%',
									}}
								/>
								<TouchableOpacity
									style={{
										overflow: 'hidden',
										fontFamily: 'Lucida Grande',
										fontSize: '40px',
										textAlign: 'left',
										color: '#567681',
										marginTop: '2%',
										marginLeft: '2%',
									}}
									onPress={() => {
										Linking.openURL('tel:4252299185');
									}}>
									+1 (425) 229-9185{' '}
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View>
						<Image
							source={require('./images/map.png')}
							style={{ width: '200px', height: '200px' }}
						/>
						<View
							style={{
								marginTop: '5%',
							}}>
							<HelpButton
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

				<View
					style={{
						justifyContent: 'flex-start',
						alignItems: 'center',
						flexDirection: 'column',
						marginTop: '5%',
					}}>
					<Text
						style={{
							fontFamily: 'Lucida Grande',
							fontSize: '79px',
							textAlign: 'left',
							color: '#567681',
						}}>
						Let's Grow Your Business
					</Text>

					<Text
						style={{
							overflow: 'hidden',
							fontFamily: 'Lucida Grande',
							fontSize: '50px',
							textAlign: 'center',
							lineHeight: '50px',
							color: '#00b0f0',
							marginTop: '2%',
						}}>
						Ready to start working together? Have a general question? We're only an email away.
					</Text>
				</View>
			</View>

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: '1%',
					marginTop: '2%',
				}}>
				<HelpTextInput
					height='150%'
					width='45%'
					placeholder='E-mail Address'
					isMultiline={false}
					onChangeText={(email) => setEmail(email)}
				/>
				<HelpTextInput
					style={{ marginLeft: '2%' }}
					height='150%'
					width='45%'
					placeholder='Business Name (Optional)'
					isMultiline={false}
					onChangeText={(name) => setBusinessName(name)}
				/>
			</View>
			<HelpTextInput
				height='30%'
				width='100%'
				placeholder='Message'
				isMultiline={true}
				onChangeText={(message) => setMessage(message)}></HelpTextInput>
			<View style={{ marginTop: '2%', alignItems: 'center' }}>
				<HelpButton
					title='SUBMIT'
					style={{ marginTop: '2%' }}
					width='30%'
					onPress={async () =>
						await FirebaseFunctions.call('sendEmail', {
							recepient: 'helpcocontact@gmail.com',
							subject: 'Contact Us Form from ' + businessName,
							text: message,
						})
					}
				/>
			</View>

			<View
				style={{
					marginTop: '5%',
					backgroundColor: '#000000',
				}}>
				<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => loadInBrowser('https://twitter.com/llc_help')}>
						<FontAwesomeIcon
							icon={['fab', 'twitter-square']}
							size='3x'
							color={colors.lightBlue}
							style={{ marginLeft: '2%' }}
							onPress={() => loadInBrowser('https://twitter.com/llc_help')}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => loadInBrowser('https://www.facebook.com/realhelpllc/')}
						style={{ marginLeft: '2%' }}>
						<FontAwesomeIcon icon={['fab', 'facebook-square']} size='3x' color={colors.lightBlue} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => loadInBrowser('https://www.instagram.com/realhelpllc/')}
						style={{ marginLeft: '2%' }}>
						<FontAwesomeIcon
							icon={['fab', 'instagram-square']}
							size='3x'
							color={colors.lightBlue}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => loadInBrowser('https://www.linkedin.com/company/helpllc/')}
						style={{ marginLeft: '2%' }}>
						<FontAwesomeIcon icon={['fab', 'linkedin']} size='3x' color={colors.lightBlue} />
					</TouchableOpacity>
				</View>

				<Text
					style={{
						overflow: 'hidden',
						fontFamily: 'Lucida Grande',
						fontSize: '30px',
						textAlign: 'left',
						color: '#ffffff',
						marginTop: '2%',
						marginLeft: '2%',
					}}>
					Click here to view our{' '}
					<TouchableOpacity
						style={{ textDecorationLine: 'underline' }}
						onPress={() => window.open('/privacypolicy', '_blank')}>
						Privacy Policy
					</TouchableOpacity>
					,
					<TouchableOpacity
						style={{ textDecorationLine: 'underline' }}
						onPress={() => window.open('/terms', '_blank')}>
						Terms and Conditions
					</TouchableOpacity>
					, and{' '}
					<TouchableOpacity
						style={{ textDecorationLine: 'underline' }}
						onPress={() => window.open('/credits', '_blank')}>
						Credits
					</TouchableOpacity>{' '}
				</Text>

				<View style={{ alignItems: 'center', justifyContent: 'center' }}>
					<Text
						style={{
							fontFamily: 'Lucida Grande',
							fontSize: '30px',
							color: '#ffffff',
							marginTop: '2%',
						}}>
						© 2020 by Help.
					</Text>
				</View>
			</View>
		</View>
	);
}