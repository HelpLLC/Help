import React from 'react';
import EditText from '../../../components/EditText';
import HelpButton from '../../../components/HelpButton';
import './Login.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';

export default function Login() {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const login = async () => {
		const businessID = await FirebaseFunctions.logIn(email, password);
		console.log(businessID);
	};

	return (
		<div>
			<section>
				<EditText className='input' labelText='Email' widthPercent={600} onChange={setEmail} />
				<EditText labelText='Password' widthPercent={600} onChange={setPassword} />
				<HelpButton label='Login' onClick={login} />
			</section>
		</div>
	);
}
