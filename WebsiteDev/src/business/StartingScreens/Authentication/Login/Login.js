import React, {useState} from 'react';
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
import '../../../../config/fontStyles.css';

export function Login(props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [credentialsError, setCredentialsError] = useState(false);
	const [open, setOpen] = useState(false);
	const [emailSentOpen, setEmailSentOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	let history = useHistory();

	const login = async () => {
		if (email.trim().length > 0 && email.includes('@') && email.includes('.') && password.trim().length > 0) {
			const businessID = '';
			try {
				businessID = await FirebaseFunctions.logIn(email, password);
			} catch (error) {
				setCredentialsError(true);
			}

			if (businessID) {
				history.push({ pathname: '/dashboard', state: { businessID: businessID } });
			}
		} else {
			setCredentialsError(true);
		}
	};

	const submit = async () => {
		try {
			await FirebaseFunctions.forgotPassword(email);
			setEmailSentOpen(true);
		} catch (error) {
			setErrorOpen(true);
		}
		setOpen(false);
	};

	return (
		<div id='content-container'>
			<div>
				<div id='header'>
					<a href='/' id='help' className='bigTextStyle blue'>
						{strings.Help}
					</a>
					<a href='login' id='login_tab_selected' className='mainTextStyle blue'>
						{strings.LogIn}
					</a>
					<a href='signUp' id='signup_tab' className='mainTextStyle gray'>
						{strings.SignUp}
					</a>
				</div>
				<div id='login_title' className='bigTitleTextStyle gray'>
					{strings.LogIn}
				</div>
				<div id='email_address' className='mainTextStyle'>
					<HelpTextInput
						height={'7vh'}
						width={'40vw'}
						placeholder={strings.EmailAddress}
						isMultiline={false}
						onChangeText={(email) => setEmail(email)}
					/>
				</div>
				<div id='password' className='mainTextStyle'>
					<HelpTextInput
						height={'7vh'}
						width={'40vw'}
						password={true}
						placeholder={strings.Password}
						isMultiline={false}
						onChangeText={(password) => setPassword(password)}
					/>
				</div>
				<div id='login_button'>
					<HelpButton title={strings.LogIn} width={'40vw'} onPress={login} />
				</div>
				<button
					id='forgot_password_button'
					onClick={() => setOpen(true)}
					className='mainTextStyle blue'>
					{strings.ForgotPasswordQuestion}
				</button>
			</div>
			<div id='gradientBackground'>
				<div id='descriptionText' className='bigTitleTextStyle white'>
					{strings.LetUsHelp}
				</div>
			</div>

			<Dialog
				open={credentialsError}
				onClose={() => setCredentialsError(false)}
				aria-labelledby='forgot-password-dialog'>
				<TitleComponent
					text={strings.InvalidCredentials}
					isCentered={true}
					textColor='#00B0F0'
					fontSize='50px'
				/>
				<DialogActions>
					<HelpButton
						title={strings.Cancel}
						onPress={() => setCredentialsError(false)}
						width={'20vw'}
					/>
					<HelpButton
						title={strings.GoToSignUp}
						onPress={(event) => (window.location.href = '/signUp')}
						width={'20vw'}
					/>
				</DialogActions>
			</Dialog>

			<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='forgot-password-dialog'>
				<TitleComponent
					text={strings.ForgotPasswordQuestion}
					isCentered={true}
					textColor='#00B0F0'
					fontSize='50px'
				/>
				<DialogContent>
					<DialogContentText>
						{strings.EnterEmailHere}
					</DialogContentText>
					<HelpTextInput
						placeholder={strings.EmailAddress}
						isMultiline={false}
						width={'44vw'}
						onChangeText={(email) => setEmail(email)}
					/>
				</DialogContent>
				<DialogActions>
					<HelpButton
						title={strings.Cancel}
						onPress={() => setOpen(false)}
						width={'22vw'}
					/>
					<HelpButton title={strings.EmailMe} onPress={submit} width={'22vw'} />
				</DialogActions>
			</Dialog>

			<Dialog
				open={emailSentOpen}
				onClose={() => setEmailSentOpen(false)}
				aria-labelledby='email-sent'>
				<TitleComponent text={strings.EmailSentExclamation} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						{strings.EmailSentText}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton
						title={strings.Ok}
						onPress={() => setEmailSentOpen(false)}
						width={'45vw'}
					/>
				</DialogActions>
			</Dialog>

			<Dialog open={errorOpen} onClose={() => setErrorOpen(false)} aria-labelledby='error-dialog'>
				<TitleComponent text={strings.ErrorSendingEmail} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						{strings.EmailError}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton
						title={strings.Close}
						onPress={() => setErrorOpen(false)}
						width={'18vw'}
					/>
					<HelpButton
						title={strings.GoToSignUp}
						onPress={(event) => (window.location.href = '/signUp')}
						width={'18vw'}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}
