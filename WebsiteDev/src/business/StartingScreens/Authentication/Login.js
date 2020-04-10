import React from 'react';
import loginImg from '../../../images/Login.svg';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
// import Modal from 'react-modal';
import HelpButton from '../../../components/HelpButton.js';
import TitleComponent from '../../../components/TitleComponent.js';
import EditText from '../../../components/EditText.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useHistory } from 'react-router-dom';

export function Login(props) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [loggedIn, setLoggedIn] = React.useState(false);
	let history = useHistory();

	const login = async () => {
		const businessID = await FirebaseFunctions.logIn(email, password);
		console.log(businessID);
		if (businessID) {
			setLoggedIn(true);
			console.log(props);
			history.push({ pathname: '/dashboard/:businessID', state: { businessID: businessID } });
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
							<label htmlFor='email'>Email</label>
							<input
								type='text'
								name='username'
								placeholder='email'
								value={email}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='password'>Password</label>
							<input
								type='password'
								name='password'
								placeholder='password'
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
								}}
							/>
						</div>
					</div>
				</div>
				<button className='btn' type='button' onClick={login}>
					Login
				</button>

				<br />
				<HelpButton
					fullWidth={false}
					label='Forgot Password'
					onClick={() => {
						handleClickOpen();
					}}
				/>
			</div>

			<Dialog open={open} onClose={handleClose} aria-labelledby='forgot-password-dialog'>
				<TitleComponent text={'Forgot Password?'} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						Please enter your email here and we will send you an email with a link to
						reset your password.
					</DialogContentText>
					<EditText
						labelText={'Email'}
						multiline={false}
						widthPercent={'100%'}
						onChange={setEmail}
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<HelpButton fullWidth={false} onClick={handleClose} label='Cancel' />
					<HelpButton fullWidth={false} onClick={submit} label='Email Me' />
				</DialogActions>
			</Dialog>

			<Dialog
				open={emailSentOpen}
				onClose={handleEmailSentClose}
				aria-labelledby='email-sent'>
				<TitleComponent text={'Email Sent!'} isCentered={true} textColor='#00B0F0' />
				<DialogContent>
					<DialogContentText>
						If a user with this email exists, then the email has been sent. Please go to
						your inbox for the link to reset your password. If you do not see it, check
						the spam folder.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton fullWidth={false} onClick={handleEmailSentClose} label='Ok' />
				</DialogActions>
			</Dialog>

			<Dialog open={errorOpen} onClose={handleErrorClose} aria-labelledby='error-dialog'>
				<TitleComponent
					text={'Error Sending Email'}
					isCentered={true}
					textColor='#00B0F0'
				/>
				<DialogContent>
					<DialogContentText>
						There was an error sending the email. Please make sure a user with this
						email exists, and try again.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<HelpButton fullWidth={false} onClick={handleErrorClose} label='Close' />
					<HelpButton
						fullWidth={false}
						onClick={(event) => (window.location.href = '/signUp')}
						label='Go to Sign Up'
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}
