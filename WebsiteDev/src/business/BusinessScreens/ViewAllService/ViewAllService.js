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
import SideMenu from '../../../components/SideMenu/SideMenu';
import ViewAllServiceCard from '../../../components/ViewAllServiceCard/ViewAllServiceCard';
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from "../../../components/DropdownHeader/DropdownHeader";

//Declares the functional component
const ViewAllService = (props) => {
	//Declares all the state variables that will be used in this screen
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState('');
	const [serviceData, setServiceData] = useState('');
	const [title, setTitle] = useState('');
	const [businessID, setBusinessID] = useState();
	const [businessName, setBusinessName] = useState();
	const location = useLocation();
	const history = useHistory();

	//The useEffect method & the fetchData method will both fetch the correct data about the specific service that has
	//been clicked on based on the service ID, the current requests snippet, the request history snippet,
	//and will also fetch the image of the service.
	const fetchData = async () => {
		const serviceObject = location.state.service;
		// const businessObject = location.state.business;
		setService(serviceObject);
		// setBusiness(businessObject);
		const image = await FirebaseFunctions.call('getServiceImageByID', {
			serviceID: serviceObject.serviceID,
		});
		setServiceData(location.state.data);
		setTitle(location.state.title);
		setIsLoading(false);

		const business = await FirebaseFunctions.call("getBusinessByID", {
			businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2"
		  });
		  setBusinessID(business);
		  setBusinessName(business.businessName);
	};

	useEffect(() => {
		fetchData();
	}, []);

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
			  <section className="dropdownheader">
          <DropdownHeader
              businessID={businessID}
			  businessName={businessName}
            modalClassName="modal"
            divClassName="toprightcontainer"
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
										time={currentRequest.time}
										imageFunction={async() => await FirebaseFunctions.call('getServiceImageByID', {
											serviceID: service.serviceID,
										})}
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
