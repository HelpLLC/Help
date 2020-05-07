import React from 'react';
import FirebaseFunctions from '../../../../config/FirebaseFunctions';
import HelpButton from '../../../../components/HelpButton/HelpButton.js';
import strings from '../../../../config/strings';
import { useHistory } from 'react-router-dom';
import { screenWidth, screenHeight } from '../../../../config/dimensions';
import HelpTextInput from '../../../../components/HelpTextInput/HelpTextInput';
import TimePicker from '../../../../components/TimePicker/TimePicker';
import './SignUp.css';
import * as firebase from 'firebase';

export function SignUp(props) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [businessName, setBusinessName] = React.useState('');
	const [businessDescription, setBusinessDescription] = React.useState('');
	const [location, setLocation] = React.useState('');
	const [website, setWebsite] = React.useState('');
	const [phoneNumber, setPhoneNumber] = React.useState('');
	const [agreed, setAgreed] = React.useState(true);

	const [step1, setStep1] = React.useState(true);
	const [submitted, setSubmitted] = React.useState(false);
	const [failed, setFailed] = React.useState(false);

	const [mondayStartTime, setMondayStartTime] = React.useState();
	const [tuesdayStartTime, setTuesdayStartTime] = React.useState();
	const [wednesdayStartTime, setWednesdayStartTime] = React.useState();
	const [thursdayStartTime, setThursdayStartTime] = React.useState();
	const [fridayStartTime, setFridayStartTime] = React.useState();
	const [saturdayStartTime, setSaturdayStartTime] = React.useState();
	const [sundayStartTime, setSundayStartTime] = React.useState();
	const [mondayEndTime, setMondayEndTime] = React.useState();
	const [tuesdayEndTime, setTuesdayEndTime] = React.useState();
	const [wednesdayEndTime, setWednesdayEndTime] = React.useState();
	const [thursdayEndTime, setThursdayEndTime] = React.useState();
	const [fridayEndTime, setFridayEndTime] = React.useState();
	const [saturdayEndTime, setSaturdayEndTime] = React.useState();
	const [sundayEndTime, setSundayEndTime] = React.useState();

	const parseTime = (time) => {
		time = time.toTimeString();
		let hours = time.substring(0, 2);
		let minutes = time.substring(3, 5);
		let intHours = parseInt(hours);
		let ampm = '';
		if (intHours > 12) {
			ampm = 'PM';
			intHours = intHours - 12;
		} else {
			ampm = 'AM';
		}
		return intHours + ':' + minutes + ' ' + ampm;
	};

	const signup = async () => {
		if (
			email.length > 1 &&
			password &&
			businessName &&
			businessDescription &&
			location &&
			website &&
			phoneNumber &&
			mondayStartTime
		) {
			setFailed(false);
			const mondayFrom = parseTime(mondayStartTime);
			const mondayTo = parseTime(mondayEndTime);
			const tuesdayFrom = parseTime(tuesdayStartTime);
			const tuesdayTo = parseTime(tuesdayEndTime);
			const wednesdayFrom = parseTime(wednesdayStartTime);
			const wednesdayTo = parseTime(wednesdayEndTime);
			const thursdayFrom = parseTime(thursdayStartTime);
			const thursdayTo = parseTime(thursdayEndTime);
			const fridayFrom = parseTime(fridayStartTime);
			const fridayTo = parseTime(fridayEndTime);
			const saturdayFrom = parseTime(saturdayStartTime);
			const saturdayTo = parseTime(saturdayEndTime);
			const sundayFrom = parseTime(sundayStartTime);
			const sundayTo = parseTime(sundayEndTime);
			const businessHours = {
				sunday: {
					from: sundayFrom,
					to: sundayTo,
				},
				monday: {
					from: mondayFrom,
					to: mondayTo,
				},
				tuesday: {
					from: tuesdayFrom,
					to: tuesdayTo,
				},
				wednesday: {
					from: wednesdayFrom,
					to: wednesdayTo,
				},
				thursday: {
					from: thursdayFrom,
					to: thursdayTo,
				},
				friday: {
					from: fridayFrom,
					to: fridayTo,
				},
				saturday: {
					from: saturdayFrom,
					to: saturdayTo,
				},
			};
			let account = '';
			account = await firebase.auth().createUserWithEmailAndPassword(email, password);
			await FirebaseFunctions.logIn(email, password);
			await FirebaseFunctions.call('addBusinessToDatabase', {
				//Fields for the business
				businessName,
				businessDescription: businessDescription,
				businessHours,
				currentRequests: [],
				email,
				paymentSetupStatus: 'FALSE',
				location,
				services: [],
				website,
				phoneNumber,
				isVerified: false,
				businessID: account.user.uid,
				coordinates: {
					lat: 3,
					lng: 3,
				},
			});
			setSubmitted(true);
		} else {
			setFailed(true);
		}
	};
	if (step1) {
		return (
			<div id='content-container'>
				<div>
					<div id='header'>
						<a href='/' id='help'>
							Help
						</a>
						<a href='login' id='login_tab'>
							Login
						</a>
						<a href='signUp' id='signup_tab_selected'>
							Sign Up
						</a>
					</div>
					<div id='signup_title'>Sign Up</div>
					<div id='row'>
						<div id='split_edit'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.EmailAddress}
								isMultiline={false}
								onChangeText={(email) => setEmail(email)}
							/>
						</div>

						<div id='split_edit'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.BusinessNameOptional}
								isMultiline={false}
								onChangeText={(businessName) => setBusinessName(businessName)}
							/>
						</div>
					</div>
					<div id='row'>
						<div id='split_edit'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.BusinessWebsite}
								isMultiline={false}
								onChangeText={(website) => setWebsite(website)}
							/>
						</div>

						<div id='split_edit'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.PhoneNumber}
								isMultiline={false}
								onChangeText={(phone) => setPhoneNumber(phone)}
							/>
						</div>
					</div>

					<div id='edit'>
						<HelpTextInput
							height={'7vh'}
							width={'42vw'}
							placeholder={strings.BusinessLocation}
							isMultiline={false}
							onChangeText={(location) => setLocation(location)}
						/>
					</div>

					<div id='edit'>
						<HelpTextInput
							height={'7vh'}
							width={'42vw'}
							placeholder={strings.BusinessDescription}
							isMultiline={true}
							onChangeText={(description) => setBusinessDescription(description)}
						/>
					</div>

					<div id='row'>
						<div id='split_edit'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.Password}
								isMultiline={false}
								password={true}
								onChangeText={(password) => setPassword(password)}
							/>
						</div>

						<div id='split_edit'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.ConfirmPassword}
								isMultiline={false}
								password={true}
								onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
							/>
						</div>
					</div>

					<div id='signup_button'>
						<HelpButton title={strings.Next} width={'42vw'} onPress={() => setStep1(false)} />
					</div>
				</div>

				<div id='gradientBackground'>
					<div id='descriptionText'>Let us continue helping your business thrive!</div>
				</div>
			</div>
		);
	} else if (!step1 && !submitted) {
		return (
			<div id='content-container'>
				<div>
					<div id='header'>
						<a href='/' id='help'>
							Help
						</a>
						<a href='login' id='login_tab'>
							Login
						</a>
						<a href='signUp' id='signup_tab'>
							Sign Up
						</a>
					</div>
					<div id='business_schedule'>Business Schedule</div>
					<div className='days'>
						<label id='day_title'>Monday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={mondayStartTime}
							onChange={(time) => setMondayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={mondayEndTime}
							onChange={(time) => setMondayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title'>Tuesday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={tuesdayStartTime}
							onChange={(time) => setTuesdayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={tuesdayEndTime}
							onChange={(time) => setTuesdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title'>Wednesday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={wednesdayStartTime}
							onChange={(time) => setWednesdayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={wednesdayEndTime}
							onChange={(time) => setWednesdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title'>Thursday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={thursdayStartTime}
							onChange={(time) => setThursdayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={thursdayEndTime}
							onChange={(time) => setThursdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title'>Friday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={fridayStartTime}
							onChange={(time) => setFridayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={fridayEndTime}
							onChange={(time) => setFridayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title'>Saturday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={saturdayStartTime}
							onChange={(time) => setSaturdayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={saturdayEndTime}
							onChange={(time) => setSaturdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title'>Sunday</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={sundayStartTime}
							onChange={(time) => setSundayStartTime(time)}
						/>
						<label id='to_text'>to</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={sundayEndTime}
							onChange={(time) => setSundayEndTime(time)}
						/>
					</div>

					<label id='day_title'>
						<input type='checkbox' id='agree' onChange={(value) => setAgreed(value)} />I agree to
						Help's Terms and Conditions and Privacy Policy
					</label>

					<div id='signup_button'>
						<HelpButton title={strings.SignUp} width={'42vw'} onPress={signup} />
					</div>
				</div>

				<div id='gradientBackground'>
					<div id='descriptionText'>Let us continue helping your business thrive!</div>
				</div>
			</div>
		);
	} else {
		return (
			<div id='content-container'>
						<div>
							<div id='header'>
								<a href='/' id='help'>
									Help
								</a>
								<a href='login' id='login_tab'>
									Login
								</a>
								<a href='signUp' id='signup_tab'>
									Sign Up
								</a>
							</div>
		
							<div id='successText'>Success! You have been signed up!</div>
							</div>
		
						<div id='gradientBackground'>
							<div id='descriptionText'>Let us continue helping your business thrive!</div>
						</div>
					</div>
			);
	}
}
