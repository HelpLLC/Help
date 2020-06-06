import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import LandingPageNavigator from './business/StartingScreens/LandingPage/LandingPageNavigator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import FirebaseFunctions from './config/FirebaseFunctions';

library.add(fab, fas);

//Declares the functional component
const App = () => {
	/*
	const testFunction = async () => {
		const result = await FirebaseFunctions.call('joinClassByClassInviteCode', {
			classInviteCode: 'jAjBb',
			studentID: 'SampleStudent',
		});
		console.log(result);
	};

	useEffect(() => {
		testFunction();
	}, []);

	return <div>HI</div>;

	*/
};

export default App;
