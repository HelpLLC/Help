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
	// useEffect(() => {
	// 	fetchFunc();
	// }, []);

	// const fetchFunc = async () => {
	// 	await FirebaseFunctions.call('updateCustomerRequest', {
	// 		requestID,
	// 		customerID,
	// 		businessID,
	// 		date,
	// 		customerLocation,
	// 		serviceDuration,
	// 		questions,
	// 		time,
	// 		serviceTitle,
	// 		status,
	// 		serviceID,
	// 		customerName,
	// 	});
	// };

	return (
		<BrowserRouter>
			<LandingPageNavigator />
		</BrowserRouter>
	);
};

export default App;
