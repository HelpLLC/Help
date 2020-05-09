import React, { useState } from 'react';
import FirebaseFunctions from '../../../../config/FirebaseFunctions';
import HelpButton from '../../../../components/HelpButton/HelpButton.js';
import strings from '../../../../config/strings';
import { useHistory } from 'react-router-dom';
import HelpTextInput from '../../../../components/HelpTextInput/HelpTextInput';
import TimePicker from '../../../../components/TimePicker/TimePicker';
import './SignUp.css';
import * as firebase from 'firebase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TitleComponent from '../../../../components/TitleComponent.js';

export function SignUp(props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [businessName, setBusinessName] = useState('');
	const [businessDescription, setBusinessDescription] = useState('');
	const [location, setLocation] = useState('');
	const [website, setWebsite] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [agreed, setAgreed] = useState(false);
	const [step1, setStep1] = useState(true);
	const [submitted, setSubmitted] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const [mondayStartTime, setMondayStartTime] = useState();
	const [tuesdayStartTime, setTuesdayStartTime] = useState();
	const [wednesdayStartTime, setWednesdayStartTime] = useState();
	const [thursdayStartTime, setThursdayStartTime] = useState();
	const [fridayStartTime, setFridayStartTime] = useState();
	const [saturdayStartTime, setSaturdayStartTime] = useState();
	const [sundayStartTime, setSundayStartTime] = useState();
	const [mondayEndTime, setMondayEndTime] = useState();
	const [tuesdayEndTime, setTuesdayEndTime] = useState();
	const [wednesdayEndTime, setWednesdayEndTime] = useState();
	const [thursdayEndTime, setThursdayEndTime] = useState();
	const [fridayEndTime, setFridayEndTime] = useState();
	const [saturdayEndTime, setSaturdayEndTime] = useState();
	const [sundayEndTime, setSundayEndTime] = useState();
	let history = useHistory();

	const goToStep2 = () => {
		if (
			email.trim().length > 0 &&
			email.includes('.') &&
			email.includes('@') &&
			password.trim().length > 6 &&
			confirmPassword == password &&
			businessDescription.trim().length > 150 &&
			location &&
			website.includes('.') &&
			phoneNumber.trim().length == 10 &&
			phoneNumber.trim().match(/^[0-9]+$/) != null
		) {
			setStep1(false);
		} else {
			setErrorOpen(true);
		}
	};

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
			agreed &&
			((mondayStartTime && mondayEndTime) ||
				(tuesdayStartTime && tuesdayEndTime) ||
				(wednesdayStartTime && wednesdayEndTime) ||
				(thursdayStartTime && thursdayEndTime) ||
				(fridayStartTime && fridayEndTime) ||
				(saturdayStartTime && saturdayEndTime) ||
				(sundayStartTime && sundayEndTime))
		) {
			try {
				const mondayFrom = mondayStartTime !== undefined ? parseTime(mondayStartTime) : '';
				const mondayTo = mondayEndTime !== undefined ? parseTime(mondayEndTime) : '';
				const tuesdayFrom = tuesdayStartTime !== undefined ? parseTime(tuesdayStartTime) : '';
				const tuesdayTo = tuesdayEndTime !== undefined ? parseTime(tuesdayEndTime) : '';
				const wednesdayFrom = wednesdayStartTime !== undefined ? parseTime(wednesdayStartTime) : '';
				const wednesdayTo = wednesdayEndTime !== undefined ? parseTime(wednesdayEndTime) : '';
				const thursdayFrom = thursdayStartTime !== undefined ? parseTime(thursdayStartTime) : '';
				const thursdayTo = thursdayEndTime !== undefined ? parseTime(thursdayEndTime) : '';
				const fridayFrom = fridayStartTime !== undefined ? parseTime(fridayStartTime) : '';
				const fridayTo = fridayEndTime !== undefined ? parseTime(fridayEndTime) : '';
				const saturdayFrom = saturdayStartTime !== undefined ? parseTime(saturdayStartTime) : '';
				const saturdayTo = saturdayEndTime !== undefined ? parseTime(saturdayEndTime) : '';
				const sundayFrom = sundayStartTime !== undefined ? parseTime(sundayStartTime) : '';
				const sundayTo = sundayEndTime !== undefined ? parseTime(sundayEndTime) : '';
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
				const businessID = await FirebaseFunctions.logIn(email, password);
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
				history.push({ pathname: '/dashboard', state: { businessID: businessID } });
				setSubmitted(true);
			} catch (error) {
				setErrorOpen(true);
			}
		} else {
			setErrorOpen(true);
		}
	};
	if (step1) {
		return (
			<div id='content-container'>
				<div>
					<div id='header'>
						<a href='/' id='helpSignup' className='bigTextStyle blue'>
							{strings.Help}
						</a>
						<a href='login' id='login_tab' className='mainTextStyle gray'>
							{strings.LogIn}
						</a>
						<a href='signUp' id='signup_tab_selected' className='mainTextStyle blue'>
							{strings.SignUp}
						</a>
					</div>
					<div id='signup_title' className='bigTitleTextStyle gray'>
						{strings.SignUp}
					</div>
					<div id='row'>
						<div id='split_edit' className='mainTextStyle gray'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.EmailAddress}
								isMultiline={false}
								value={email}
								onChangeText={(email) => setEmail(email)}
							/>
						</div>

						<div id='split_edit' className='mainTextStyle gray'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.BusinessNameOptional}
								isMultiline={false}
								value={businessName}
								onChangeText={(businessName) => setBusinessName(businessName)}
							/>
						</div>
					</div>
					<div id='row'>
						<div id='split_edit' className='mainTextStyle gray'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.BusinessWebsite}
								isMultiline={false}
								value={website}
								onChangeText={(website) => setWebsite(website)}
							/>
						</div>

						<div id='split_edit' className='mainTextStyle gray'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.PhoneNumber}
								isMultiline={false}
								value={phoneNumber}
								onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
							/>
						</div>
					</div>

					<div id='edit' className='mainTextStyle gray'>
						<HelpTextInput
							height={'7vh'}
							width={'42vw'}
							placeholder={strings.BusinessLocation}
							isMultiline={false}
							value={location}
							onChangeText={(location) => setLocation(location)}
						/>
					</div>

					<div id='edit' className='mainTextStyle gray'>
						<HelpTextInput
							height={'7vh'}
							width={'42vw'}
							placeholder={strings.BusinessDescription}
							isMultiline={true}
							value={businessDescription}
							onChangeText={(businessDescription) => setBusinessDescription(businessDescription)}
						/>
					</div>

					<div id='row'>
						<div id='split_edit' className='mainTextStyle gray'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.Password}
								isMultiline={false}
								password={true}
								value={password}
								onChangeText={(password) => setPassword(password)}
							/>
						</div>

						<div id='split_edit' className='mainTextStyle gray'>
							<HelpTextInput
								height={'7vh'}
								width={'20vw'}
								placeholder={strings.ConfirmPassword}
								isMultiline={false}
								password={true}
								value={confirmPassword}
								onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
							/>
						</div>
					</div>

					<div id='signup_button'>
						<HelpButton title={strings.Next} width={'42vw'} onPress={goToStep2} />
					</div>
				</div>

				<div id='gradientBackground'>
					<div id='descriptionText' className='bigTitleTextStyle white'>
						{strings.LetUsHelp}
					</div>
				</div>

				<Dialog open={errorOpen} onClose={() => setErrorOpen(false)} aria-labelledby='error-dialog'>
					<TitleComponent text={strings.Error} isCentered={true} textColor='#00B0F0' />
					<DialogContent>
						<DialogContentText>{strings.FieldsError}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<HelpButton title={strings.Close} onPress={() => setErrorOpen(false)} width={'44vw'} />
					</DialogActions>
				</Dialog>
			</div>
		);
	} else if (!step1 && !submitted) {
		return (
			<div id='content-container'>
				<div>
					<div id='header'>
						<a href='/' id='helpSignup' className='bigTextStyle blue'>
							{strings.Help}
						</a>
						<a href='login' id='login_tab' className='mainTextStyle gray'>
							{strings.LogIn}
						</a>
						<a href='signUp' id='signup_tab' className='mainTextStyle blue'>
							{strings.SignUp}
						</a>
					</div>
					<div id='business_schedule' className='bigTitleTextStyle gray'>
						{strings.BusinessSchedule}
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Monday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={mondayStartTime}
							onChange={(time) => setMondayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={mondayEndTime}
							onChange={(time) => setMondayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Tuesday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={tuesdayStartTime}
							onChange={(time) => setTuesdayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={tuesdayEndTime}
							onChange={(time) => setTuesdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Wednesday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={wednesdayStartTime}
							onChange={(time) => setWednesdayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={wednesdayEndTime}
							onChange={(time) => setWednesdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Thursday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={thursdayStartTime}
							onChange={(time) => setThursdayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={thursdayEndTime}
							onChange={(time) => setThursdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Friday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={fridayStartTime}
							onChange={(time) => setFridayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={fridayEndTime}
							onChange={(time) => setFridayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Saturday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={saturdayStartTime}
							onChange={(time) => setSaturdayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={saturdayEndTime}
							onChange={(time) => setSaturdayEndTime(time)}
						/>
					</div>
					<div className='days'>
						<label id='day_title' className='mainTextStyle gray'>
							{strings.Sunday}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={sundayStartTime}
							onChange={(time) => setSundayStartTime(time)}
						/>
						<label id='to_text' className='mainTextStyle gray'>
							{strings.to}
						</label>
						<TimePicker
							widthPercent={'10vw'}
							marginLeft='20px'
							value={sundayEndTime}
							onChange={(time) => setSundayEndTime(time)}
						/>
					</div>

					<label id='checkbox' className='smallTextStyle'>
						<input type='checkbox' id='agree' onChange={(value) => setAgreed(value)} />
						{strings.AgreeToPolicies}
					</label>

					<div id='signup_button'>
						<HelpButton title={strings.SignUp} width={'42vw'} onPress={signup} />
					</div>
					<div id='signup_button'>
						<HelpButton
							title={strings.BackWithArrow}
							width={'10vw'}
							onPress={() => setStep1(true)}
						/>
					</div>
				</div>

				<div id='gradientBackground'>
					<div id='descriptionText' className='bigTitleTextStyle white'>
						{strings.LetUsHelp}
					</div>
				</div>

				<Dialog open={errorOpen} onClose={() => setErrorOpen(false)} aria-labelledby='error-dialog'>
					<TitleComponent text={strings.Error} isCentered={true} textColor='#00B0F0' />
					<DialogContent>
						<DialogContentText>{strings.ErrorSigningUp}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<HelpButton title={strings.Close} onPress={() => setErrorOpen(false)} width={'44vw'} />
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
