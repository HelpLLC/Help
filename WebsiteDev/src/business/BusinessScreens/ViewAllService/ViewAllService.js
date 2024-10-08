//This is going to be the screen where a specific service will be displayed for the business. It will render all the information
//about it, such as the name, description, and image. It will also display a snippet of both the request history of the service
//as well as a snippet of current requests. There will also be a button that allows the business to edit the service
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './ViewAllService.css';
import '../../../config/fontStyles.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import ReactLoading from 'react-loading';
import colors from '../../../config/colors';
import ViewAllServiceCard from '../../../components/ViewAllServiceCard/ViewAllServiceCard';
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';
import strings from '../../../config/strings';

//Declares the functional component
const ViewAllService = (props) => {
	//Declares all the state variables that will be used in this screen
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState();
	const [serviceData, setServiceData] = useState();
	const [title, setTitle] = useState();
	const [business, setBusiness] = useState();
	// const [businessID, setBusinessID] = useState();
	// const [businessName, setBusinessName] = useState();
	const location = useLocation();
	const history = useHistory();
	let serviceObject = null;

	//The useEffect method & the fetchData method will both fetch the correct data about the specific service that has
	//been clicked on based on the service ID, the current requests snippet, the request history snippet,
	//and will also fetch the image of the service.
	const fetchData = () => {
		serviceObject = location.state.service;
		const businessObject = location.state.business;
		console.log('service all object = ' + JSON.stringify(serviceObject));
		console.log('business all object = ' + JSON.stringify(businessObject));
		setService(serviceObject);
		setBusiness(businessObject);
		setTitle(location.state.title);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();

		async function getData() {
			if (title == strings.ConfirmedRequests) {
				await getAllConfirmedRequests();
			} else if (title == strings.UnconfirmedRequests) {
				await getAllUnconfirmedRequests();
			} else {
				await getAllCompletedRequests();
			}
		}
		getData();
		console.log('service all = ' + JSON.stringify(service));
		console.log('business all = ' + JSON.stringify(business));
	}, []);

	async function getAllConfirmedRequests() {
		const data = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
		});
		setServiceData(data);
		console.log('data = ' + JSON.stringify(data));
	}

	async function getAllUnconfirmedRequests() {
		const data = await FirebaseFunctions.call('getUnconfirmedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
		});
		setServiceData(data);
		console.log('data = ' + JSON.stringify(data));
	}

	async function getAllCompletedRequests() {
		const data = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
		});
		setServiceData(data);
		console.log('data = ' + JSON.stringify(data));
	}

	// Renders the UI of the screen. If the screen is loading, displays a loading state
	if (isLoading === true) {
		return (
			<div className='ViewAllScreen'>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='10vw' />
			</div>
		);
	}
	return (
		<div className='ViewAllScreen'>
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={business.businessID}
					businessName={business.businessName}
					modalClassName='modal'
					divClassName='toprightcontainer'
				/>
			</section>
			<div className='ViewAllContainer'>
				<text className='mainTextStyle darkBlue bold'>{title}</text>
				<div className='bottomSection'>
					{serviceData.length > 0 ? (
						<div className='currentRequests'>
							{serviceData.map((currentRequest) => {
								return (
									<ViewAllServiceCard
										name={currentRequest.customerName}
										service={currentRequest.serviceTitle}
										date={currentRequest.date}
										time={currentRequest.time + 'to' + currentRequest.endTime}
										imageFunction={async () =>
											await FirebaseFunctions.call('getServiceImageByID', {
												serviceID: serviceObject.serviceID,
											})
										}
									/>
								);
							})}
						</div>
					) : (
						<div />
					)}
				</div>
			</div>
		</div>
	);
};

//Exports the functional component
export default ViewAllService;
