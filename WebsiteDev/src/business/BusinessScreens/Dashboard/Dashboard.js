import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import '../Header/Header.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import BusinessServiceCard from '../../../components/BusinessServiceCard/BusinessServiceCard';
import { useLocation, useHistory } from 'react-router-dom';
import colors from '../../../config/colors';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';
import ReactLoading from 'react-loading';
import strings from '../../../config/strings';
import fontStyles from '../../../config/fontStyles';

// Declares the functional component
const Dashboard = (props) => {
	const [business, setBusiness] = useState();
	const [services, setServices] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [unconfirmedRequests, setUnconfirmedRequests] = useState('');
	const [unconfirmedRequestsImages, setUnconfirmedRequestsImages] = useState('');
	const location = useLocation();
	const history = useHistory();

	// The useEffect method fetches the correct information
	useEffect(() => {
		fetchFunc();
	}, []);

	// Helper method for the useEffect method
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

		// Sets the unconfimred request images
		let imagePromises = unconfirmedRequests.map((eachRequest) =>
			FirebaseFunctions.call('getServiceImageByID', {
				serviceID: eachRequest.serviceID,
			})
		);
		imagePromises = await Promise.all(imagePromises);

		setUnconfirmedRequestsImages(imagePromises);
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
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={business}
					businessName={business.businessName}
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
						{unconfirmedRequests.map((eachRequest, index) => {
							let date = new Date(eachRequest.date);
							date =
								['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] +
								', ' +
								[
									'Jan',
									'Feb',
									'Mar',
									'Apr',
									'May',
									'Jun',
									'Jul',
									'Aug',
									'Sep',
									'Oct',
									'Nov',
									'Dec',
								][date.getMonth()] +
								' ' +
								date.getDate() +
								', ' +
								date.getFullYear();
							return (
								<div className='cardContainer'>
									<img className={'imageStyle'} src={unconfirmedRequestsImages[index].uri}></img>
									<div className='unconfirmedInfoCard'>
										<div className={'darkBlue bold mainTextStyle'}>{eachRequest.serviceTitle}</div>
										<div className={'darkBlue bold smallTextStyle'}>{date}</div>
										<div className={'darkBlue bold smallTextStyle'}>
											{eachRequest.time} - {eachRequest.endTime}
										</div>
										<HelpButton
											title={strings.ViewMore}
											fontStyle={{
												...fontStyles.subTextStyle,
												...fontStyles.white,
												...fontStyles.bold,
											}}
											height={'3vh'}
											width={'10vw'}
											onPress={() => {
												//Goes to the specific request screen
												history.push({
													pathname: '/viewrequest',
													state: { requestID: eachRequest.requestID },
												});
											}}
										/>
									</div>
								</div>
							);
						})}
						<div className={'viewAllButton'}>
							<HelpButton
								title={strings.ViewAll}
								fontStyle={{
									...fontStyles.subTextStyle,
									...fontStyles.white,
									...fontStyles.bold,
								}}
								height={'4vh'}
								width={'27vw'}
								onPress={() => {
									//Goes to the specific unconfirmedreqeusts  screen
									history.push({
										pathname: '/viewAll',
										state: {
											business: business,
											title: strings.UnconfirmedRequests,
										},
									});
								}}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

// Exports the component
export default Dashboard;
