//This is going to be the screen where a specific service will be displayed for the business. It will render all the information
//about it, such as the name, description, and image. It will also display a snippet of both the request history of the service
//as well as a snippet of current requests. There will also be a button that allows the business to edit the service
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ServiceScreen.css';
import '../../../config/fontStyles.css';
import strings from '../../../config/strings';
import FirebaseFunctions from '../../../config/FirebaseFunctions';

//Declares the functional component
const ServiceScreen = (props) => {
	//Declares all the state variables that will be used in this screen
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState('');
	const [business, setBusiness] = useState('');
	const [serviceImage, setServiceImage] = useState('');
	const [fullCurrentRequests, setFullCurrentRequests] = useState('');
	const [fullCompletedRequests, setFullCompletedRequests] = useState('');
	const [currentRequestsSnippet, setCurrentRequestsSnippet] = useState('');
	const [requestHistorySnippet, setRequestHistorySnippet] = useState('');
	const location = useLocation();

	//The useEffect method & the fetchData method will both fetch the correct data about the specific service that has
	//been clicked on based on the service ID, the current requests snippet, the request history snippet,
	//and will also fetch the image of the service.
	const fetchData = async () => {
		const serviceObject = location.state.service;
		const businessObject = location.state.business;
		setService(serviceObject);
		setBusiness(businessObject);
		const image = await FirebaseFunctions.call('getServiceImageByID', {
			serviceID: serviceObject.serviceID,
		});
		setServiceImage(image);
		let currentRequests = await FirebaseFunctions.call('getCurrentRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
		});
		let requestHistory = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
		});
		currentRequests.sort((a, b) => {
			return new Date(a.date) - new Date(b.date);
		});
		requestHistory.sort((a, b) => {
			return new Date(a.date) - new Date(b.date);
		});
		setFullCurrentRequests(currentRequests);
		setFullCompletedRequests(requestHistory);
		if (currentRequests.length > 2) {
			currentRequests = currentRequests.slice(0, 3);
		}
		if (requestHistory.length > 2) {
			requestHistory = requestHistory.slice(0, 3);
		}
		setCurrentRequestsSnippet(currentRequests);
		setRequestHistorySnippet(requestHistory);
	};

	useEffect(() => {
		fetchData();
	}, []);
	//Renders the UI of the screen
	return <div>Hi</div>;
};

//Exports the functional component
export default ServiceScreen;
