import React from 'react';
import loginImg from '../../../images/Login.svg';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import HelpButton from '../../../components/HelpButton/HelpButton.js';
import TitleComponent from '../../../components/TitleComponent.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import strings from '../../../config/strings';
import { useHistory } from 'react-router-dom';
import { screenWidth, screenHeight } from '../../../config/dimensions';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';

export function Login(props) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [loggedIn, setLoggedIn] = React.useState(false);
	let history = useHistory();

	const login = async () => {
		const businessID = await FirebaseFunctions.logIn(email, password);
		if (businessID) {
			setLoggedIn(true);
			history.push({ pathname: '/dashboard', state: { businessID: businessID } });
		}
	};

	const submit = async () => {
		try {
			await FirebaseFunctions.forgotPassword(email);
			handleEmailSentOpen();
		} catch (error) {
			handleErrorOpen();
		}
		setOpen(false);
	};

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [emailSentOpen, setEmailSentOpen] = React.useState(false);

	const handleEmailSentOpen = () => {
		setEmailSentOpen(true);
	};

	const handleEmailSentClose = () => {
		setEmailSentOpen(false);
	};

	const [errorOpen, setErrorOpen] = React.useState(false);

	const handleErrorOpen = () => {
		setErrorOpen(true);
	};

	const handleErrorClose = () => {
		setErrorOpen(false);
	};

	return (
		<div>
			<div className='base-container'>
				<div className='header1'>Login</div>
				<div className='content'>
					<div className='image'>
						<img src={loginImg} alt='' />
					</div>
					<div className='form'>
						<div className='form-group'>
							<HelpTextInput
								placeholder='E-mail Address'
								isMultiline={false}
								width={'100%'}
								onChangeText={(email) => setEmail(email)}
							/>
						</div>
						<div className='form-group'>
							<HelpTextInput
								placeholder='Password'
								isMultiline={false}
								width={'100%'}
								password={true}
								onChangeText={(password) => setPassword(password)}
							/>
						</div>
					</div>
				</div>
				<HelpButton title={'Login'} onPress={login} width={screenWidth * 0.1} />

				<br />
				<HelpButton
					title={'Forgot Password'}
					onPress={() => {
						handleClickOpen();
					}}
					width={screenWidth * 0.15}
				/>
			</div>

			<Dialog open={open} onClose={handleClose} aria-labelledby='forgot-password-dialog'>
				<TitleComponent text={'Forgot Password?'} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						Please enter your email here and we will send you an email with a link to reset your
						password.
					</DialogContentText>
					<HelpTextInput
						placeholder='E-mail Address'
						isMultiline={false}
						width={'100%'}
						onChangeText={(email) => setEmail(email)}
					/>
				</DialogContent>
				<DialogActions>
					<HelpButton title={'Cancel'} onPress={handleClose} width={screenWidth * 0.1} />
					<HelpButton title={'Email Me'} onPress={submit} width={screenWidth * 0.1} />
				</DialogActions>
			</Dialog>

			<Dialog open={emailSentOpen} onClose={handleEmailSentClose} aria-labelledby='email-sent'>
				<TitleComponent text={'Email Sent!'} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						If a user with this email exists, then the email has been sent. Please go to your inbox
						for the link to reset your password. If you do not see it, check the spam folder.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton title={'Ok'} onPress={handleEmailSentClose} width={screenWidth * 0.1} />
				</DialogActions>
			</Dialog>

			<Dialog open={errorOpen} onClose={handleErrorClose} aria-labelledby='error-dialog'>
				<TitleComponent text={'Error Sending Email'} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						There was an error sending the email. Please make sure a user with this email exists,
						and try again.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton title={'Close'} onPress={handleErrorClose} width={screenWidth * 0.1} />
					<HelpButton
						title={'Go to Sign Up'}
						onPress={(event) => (window.location.href = '/signUp')}
						width={screenWidth * 0.1}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}
