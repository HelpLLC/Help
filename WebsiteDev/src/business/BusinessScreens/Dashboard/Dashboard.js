import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import '../Header/Header.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import BusinessServiceCard from '../../../components/BusinessServiceCard/BusinessServiceCard';
import { useLocation, useHistory } from 'react-router-dom';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import UpcomingRequests from '../../../components/UpcomingRequests/UpcomingRequests';
import SideMenu from '../../../components/SideMenu/SideMenu';
import ReactLoading from 'react-loading';
import colors from '../../../config/colors';

export default function Dashboard(props) {

	// The state variables for this screen
	const [business, setBusiness] = useState();
	const [services, setServices] = useState();
	const [unconfirmedRequests, setUnconfirmedRequests] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const history = useHistory();

	// The useEffect method for this screen
	useEffect(() => {
		fetchFunc();
	}, []);

	// helper method for the useEffect because it can't be async
	const fetchFunc = async () => {
		const businessID = location.state.businessID;
		const results = await Promise.all([
			FirebaseFunctions.call('getBusinessByID', {
				businessID,
			}),
			FirebaseFunctions.call('getUnconfirmedRequestsByBusinessID', { businessID, limit: 3 }),
		]);
		const business = results[0];
		const unconfirmedRequests = results[1]; 
		setBusiness(business);
		setUnconfirmedRequests(unconfirmedRequests);
		setServices(business.services);
		setIsLoading(false);
	};

	// Shows a loading spinner if the method is still loading
	if (isLoading === true) {
		return (
			<div className='loadingContainer'>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='10vw' />
			</div>
		);
	}

	return (
		<div className='dashboardContainer'>
			<section className='sidebarHolder'>
				<SideMenu title='Dashboard' />
			</section>
			<section className='dashboardHolder'>
				<div className='dashboardTitleContainer'>
					<text className='darkGreen bold bigTextStyle'>Services</text>
				</div>
				<div className='cardsHolder'>
					<div>
						<div className='buttonContainer'>
							<HelpButton
								title='Add Service'
								isSmallButton={true}
								height={'4vh'}
								onPress={() => {
									history.push({
										pathname: '/CreateServiceScreen',
										state: { business: business },
									});
								}}
							/>
						</div>
						{services.map((service) => (
							<BusinessServiceCard
								title={service.serviceTitle}
								totalReviews={service.totalReviews}
								averageRating={service.averageRating}
								priceText={service.priceText}
								serviceDescription={service.serviceDescription}
								numCurrentRequests={service.numCurrentRequests}
								image={async () => {
									//Passes in the function to retrieve the image of this product
									return await FirebaseFunctions.call('getServiceImageByID', {
										serviceID: service.serviceID,
									});
								}}
								onPress={() => {
									history.push({
										pathname: '/serviceScreen',
										state: { business: business, service: service },
									});
								}}
							/>
						))}
					</div>
					<div className='upcomingRequestsContainer'>
						<UpcomingRequests />
					</div>
				</div>
			</section>
		</div>
	);
}
