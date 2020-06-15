//This is going to be the screen where a specific service will be displayed for the business. It will render all the information
//about it, such as the name, description, and image. It will also display a snippet of both the request history of the service
//as well as a snippet of current requests. There will also be a button that allows the business to edit the service
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './ServiceScreen.css';
import '../../../config/fontStyles.css';
import strings from '../../../config/strings';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import ReactLoading from 'react-loading';
import colors from '../../../config/colors';
import { Image } from 'react-native-web';
import HelpButton from '../../../components/HelpButton/HelpButton';
import StarRatings from 'react-star-ratings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontStyles from '../../../config/fontStyles';
import SideMenu from '../../../components/SideMenu/SideMenu';

//Declares the functional component
const ServiceScreen = (props) => {
	//Declares all the state variables that will be used in this screen
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState('');
	const [business, setBusiness] = useState('');
	const [serviceImage, setServiceImage] = useState('');
	const [confirmedRequestsSnippet, setConfirmedRequestsSnippet] = useState('');
	const [unconfirmedRequestsSnippet, setUnconfirmedRequestsSnippet] = useState('');
	const [requestHistorySnippet, setRequestHistorySnippet] = useState('');
	const location = useLocation();
	const history = useHistory();

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
		let confirmedRequests = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
			limit: 2,
		});
		let unconfirmedRequests = await FirebaseFunctions.call('getUnconfirmedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
			limit: 2,
		});
		let requestHistory = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
			serviceID: serviceObject.serviceID,
			limit: 2,
		});
		setConfirmedRequestsSnippet(confirmedRequests);
		setUnconfirmedRequestsSnippet(unconfirmedRequests);
		setRequestHistorySnippet(requestHistory);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	//This function is going to take in three parameters. A customer name, a date, and a time, and then
	//will render a request card displaying that information
	const renderRequestCard = (customerName, date, time) => {
		return (
			<div className='requestCard'>
				<div className={'requestCardInformation'}>
					<text className={'smallTextStyle darkBlue bold'}>{customerName}</text>
					<text className={'smallTextStyle darkBlue'}>{date}</text>
					<text className={'smallTextStyle darkBlue'}>{time}</text>
				</div>
				<HelpButton
					onPress={() => {
						//Goes to the specific request screen
					}}
					title={strings.ViewMore}
					width={'8vw'}
					height={'4vh'}
					fontStyle={{
					  ...fontStyles.smallTextStyle,
					  ...fontStyles.white,
					}}
				/>
			</div>
		);
	};

	// Renders the UI of the screen. If the screen is loading, displays a loading state
	if (isLoading === true) {
		return (
			<div className='serviceScreen'>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='10vw' />
			</div>
		);
	}
	return (
		<div className='serviceScreen'>
			<section className='sidebarHolder'>
				<SideMenu title='Service' />
			</section>
			<div className='serviceScreenContainer'>
				<div className='titleSection'>
					<div
						className={'arrowBackButton'}
						onClick={() =>
							history.push({ pathname: '/dashboard', state: { businessID: business.businessID } })
						}
						>
						<FontAwesomeIcon color={colors.blue} size={'3x'} icon='arrow-left' />
					</div>
					<text className="mainTextStyle darkBlue bold">{service.serviceTitle}</text>
					<HelpButton
						onPress={() => {
							//Goes to the edit service screen
						}}
						title={strings.EditService}
						width={'17vw'}
						height={'5vh'}
					/>
				</div>
				<div className='middleSection'>
					<img className={'serviceScreenImage'} src={serviceImage.uri} />
					<div className={'serviceScreenDescriptionRating'}>
						<div className={'serviceScreenDescriptionRatingSection'}>
							<text className='subTextStyle darkBlue bold'>{strings.ServiceDescription}</text>
							<div className='spacer' />
							<text className='tinyTextStyle darkBlue'>{service.serviceDescription}</text>
						</div>
						<div className={'serviceScreenDescriptionRatingSection'}>
							<text className='subTextStyle darkBlue bold'>{strings.Rating}</text>
							<div className='spacer' />
							<StarRatings
								rating={service.averageRating}
								numberOfStars={5}
								starRatedColor={colors.yellow}
								starDimension={'2vw'}
								starSpacing={'0.25vw'}
							/>
						</div>
					</div>
					<div className='daysOfferedSection'>
						<text className='subTextStyle darkBlue bold'>{strings.DaysOffered}</text>
						<div className={'spacer'} />
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Sunday} {business.businessHours['sunday'].from}
							{' - '}
							{business.businessHours['sunday'].to}
						</text>
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Monday} {business.businessHours['monday'].from}
							{' - '}
							{business.businessHours['monday'].to}
						</text>
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Tuesday} {business.businessHours['tuesday'].from}
							{' - '}
							{business.businessHours['tuesday'].to}
						</text>
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Wednesday} {business.businessHours['wednesday'].from}
							{' - '}
							{business.businessHours['wednesday'].to}
						</text>
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Thursday} {business.businessHours['thursday'].from}
							{' - '}
							{business.businessHours['thursday'].to}
						</text>
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Friday} {business.businessHours['friday'].from}
							{' - '}
							{business.businessHours['friday'].to}
						</text>
						<text className='tinyTextStyle darkBlue bold'>
							{strings.Saturday} {business.businessHours['saturday'].from}
							{' - '}
							{business.businessHours['saturday'].to}
						</text>
					</div>
				</div>
				<div className='bottomSection'>
					{confirmedRequestsSnippet.length > 0 ? (
						<div className='currentRequests'>
							<text className='subTextStyle darkBlue bold'>{strings.CurrentRequests}</text>
							{confirmedRequestsSnippet.map((currentRequest) => {
								return renderRequestCard(
									currentRequest.customerName,
									currentRequest.date,
									currentRequest.time
								);
							})}
							<HelpButton
								onPress={() => {
									//Goes to all current requests screen
								}}
								title={strings.ViewAll}
								width={'18vw'}
								height={'4vh'}
							/>
						</div>
					) : (
						<div />
					)}
					{requestHistorySnippet.length > 0 ? (
						<div className='requestHistory'>
							<text className='subTextStyle darkBlue bold'>{strings.RequestsHistory}</text>
							{requestHistorySnippet.map((historyRequest) => {
								return renderRequestCard(
									historyRequest.customerName,
									historyRequest.date,
									historyRequest.time
								);
							})}
							<HelpButton
								onPress={() => {
									//Goes to all current requests screen
								}}
								title={strings.ViewAll}
								width={'18vw'}
								height={'4vh'}
							/>
						</div>
					) : (
						<div />
					)}
					{unconfirmedRequestsSnippet.length > 0 ? (
							<div className="unconfirmedrequests">
								<text className='subTextStyle darkBlue bold'>{strings.UnconfirmedRequests}</text> 
								{unconfirmedRequestsSnippet.map((unconfirmedRequest) => {
								return renderRequestCard(
									unconfirmedRequest.customerName,
									unconfirmedRequest.date,
									unconfirmedRequest.time
								);
						})}
						<HelpButton
						onPress={() => {
							//Goes to all unconfirmed requests screen
						}}
						title={strings.ViewAll}
						width={'18vw'}
						height={'4vh'}
						/>
					</div>
					) : (
						<div/>
					)}
				</div>
			</div>
		</div>
	);
};

//Exports the functional component
export default ServiceScreen;
