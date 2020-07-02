import React, { Component } from 'react';
import './Dashboard.css';
import Header from '../Header/Header';
import '../Header/Header.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import BusinessServiceCard from '../../../components/BusinessServiceCard/BusinessServiceCard';
import { useLocation, useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import UpcomingRequests from '../../../components/UpcomingRequests/UpcomingRequests';
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';

export default function Dashboard(props) {
	const [business, setBusiness] = React.useState();
	const [businessName, setBusinessName] = React.useState();
	const [services, setServices] = React.useState();
	const [loaded, setLoaded] = React.useState(false);
	const [image, setImage] = React.useState('');
	const location = useLocation();
	const history = useHistory();

	const componentDidMount = async () => {
		const businessID = location.state.businessID;
		const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
		setBusiness(business);
		setBusinessName(business.businessName);
		setServices(business.services);
		setLoaded(true);
	};

	if (loaded === false) {
		componentDidMount();
	}

	return (
		<div className='dashboardContainer'>
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={business}
					businessName={businessName}
					modalClassName='modal'
					divClassName='toprightcontainer'
				/>
			</section>
			<section className='sidebarHolder'>
				<SideMenuCard title='Help' />
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
								width={'45vw'}
								height={'4vh'}
								onPress={() => {
									history.push({
										pathname: '/CreateServiceScreen',
										state: { business: business },
									});
								}}
							/>
						</div>
						{loaded
							? services.map((service) => (
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
							  ))
							: null}
					</div>
					<div className='upcomingRequestsContainer'>
						<UpcomingRequests />
					</div>
				</div>
			</section>
		</div>
	);
}
