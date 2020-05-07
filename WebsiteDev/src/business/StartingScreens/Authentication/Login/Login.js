import React from 'react';
import FirebaseFunctions from '../../../../config/FirebaseFunctions';
import HelpButton from '../../../../components/HelpButton/HelpButton.js';
import TitleComponent from '../../../../components/TitleComponent.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import strings from '../../../../config/strings';
import { useHistory } from 'react-router-dom';
import { screenWidth, screenHeight } from '../../../../config/dimensions';
import HelpTextInput from '../../../../components/HelpTextInput/HelpTextInput';
import './Login.css';

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
		<div id='content-container'>
			<div>
				<div id='header'>
					<a href='/' id='help'>
						Help
					</a>
					<a href='login' id='login_tab_selected'>
						Login
					</a>
					<a href='signUp' id='signup_tab'>
						Sign Up
					</a>
				</div>
				<div id='login_title'>Login</div>
				<div id='email_address'>
					<HelpTextInput
						height={'7vh'}
						width={'40vw'}
						placeholder={strings.EmailAddress}
						isMultiline={false}
						onChangeText={(email) => setEmail(email)}
					/>
				</div>
				<div id='password'>
					<HelpTextInput
						height={'7vh'}
						width={'40vw'}
						placeholder={strings.Password}
						isMultiline={false}
						onChangeText={(password) => setPassword(password)}
					/>
				</div>
				<div id='login_button'>
					<HelpButton title={strings.LogIn} width={'40vw'} onPress={login} />
				</div>
				<div id='forgot_password'>
					<button id='forgot_password_button' onClick={() => setOpen(true)}>
						Forgot Password?
					</button>
				</div>
			</div>
			<div id='gradientBackground'>
				<div id='descriptionText'>Let us continue helping your business thrive!</div>
			</div>

			<Dialog open={open} onClose={handleClose} aria-labelledby='forgot-password-dialog'>
				<TitleComponent
					text={strings.ForgotPasswordQuestion}
					isCentered={true}
					textColor='#00B0F0'
					fontSize='50px'
				/>
				<DialogContent>
					<DialogContentText>
						Please enter your email here and we will send you an email with a link to reset your
						password.
					</DialogContentText>
					<HelpTextInput
						placeholder={strings.EmailAddress}
						isMultiline={false}
						width={'44vw'}
						onChangeText={(email) => setEmail(email)}
					/>
				</DialogContent>
				<DialogActions>
					<HelpButton title={strings.Cancel} onPress={handleClose} width={screenWidth * 0.211} />
					<HelpButton title={strings.EmailMe} onPress={submit} width={screenWidth * 0.211} />
				</DialogActions>
			</Dialog>

			<Dialog open={emailSentOpen} onClose={handleEmailSentClose} aria-labelledby='email-sent'>
				<TitleComponent text={strings.EmailSentExclamation} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						If a user with this email exists, then the email has been sent. Please go to your inbox
						for the link to reset your password. If you do not see it, check the spam folder.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton title={strings.Ok} onPress={handleEmailSentClose} width={screenWidth * 0.3} />
				</DialogActions>
			</Dialog>

			<Dialog open={errorOpen} onClose={handleErrorClose} aria-labelledby='error-dialog'>
				<TitleComponent text={strings.ErrorSendingEmail} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						There was an error sending the email. Please make sure a user with this email exists,
						and try again.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton title={strings.Close} onPress={handleErrorClose} width={screenWidth * 0.2} />
					<HelpButton
						title={strings.GoToSignUp}
						onPress={(event) => (window.location.href = '/signUp')}
						width={screenWidth * 0.2}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}
