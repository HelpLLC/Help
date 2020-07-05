// This is going to be the screen where the calendar will be presented to the business with their events
import React, { useState, useEffect } from 'react';
import './Calendar.css';
import strings from '../../../config/strings';
import '../../../config/fontStyles.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import HelpCalendar from '../../../components/HelpCalendar/HelpCalendar';
import { convertDateToString } from '../../../config/basicFunctions';
import ReactLoading from 'react-loading';
import { useLocation, useHistory } from 'react-router-dom';
import HelpButton from '../../../components/HelpButton/HelpButton';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';

// Declares the funcitonal component
const Calendar = (props) => {
	// Global variables that are going to be used in this screen
	const dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const monthStrings = [
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
	];
	const location = useLocation();
	const history = useHistory();

	// Declares the state fields used in this screen
	const [businessID, setBusinessID] = useState(location.state.businessID);
	const [businessName, setBusinessName] = useState();
	const [dayClicked, setDayClicked] = useState(new Date());
	const [requestClicked, setRequestClicked] = useState('');
	const [arrayOfDayRequests, setArrayOfDayRequests] = useState([]);
	const [isRightMenuLoading, setIsRightMenuLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState('');
	const [loaded, setLoaded] = useState(false);

	const getBusinessName = async () => {
		const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
		setBusinessName(business.businessName);
		setLoaded(true);
	};

	if (loaded === false) {
		getBusinessName();
	}

	// Renders the UI of the screen based on the state of the "currentView" field which renders either a week view or a
	// month view
	return (
		<div className='calendarContainer'>
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={businessID}
					businessName={businessName}
					modalClassName='calendarmodal'
					divClassName='toprightcontainercalendar'
				/>
			</section>
			<section className='sidebarHolder'>
				<SideMenuCard title='Help' businessID={businessID} />
			</section>
			<section className='calendarHolder'>
				<div>
					<text className='darkGreen bold bigTextStyle'>{strings.Calendar}</text>
				</div>
				<HelpCalendar
					width={'50vw'}
					height={'75vh'}
					weekEventLoader={(startDate, endDate) =>
						FirebaseFunctions.call('getBusinessCurrentRequestsByTimeFrame', {
							businessID: businessID,
							start: startDate,
							limit: endDate,
						})
					}
					onEventClick={async (request) => {
						setIsRightMenuLoading(true);
						setRequestClicked(request);
						const image = await FirebaseFunctions.call('getProfilePictureByID', {
							customerID: requestClicked.customerID,
						});
						setImagePreview(image.uri);
						setIsRightMenuLoading(false);
					}}
					onDaySelected={async (day) => {
						setIsRightMenuLoading(true);
						setDayClicked(day);
						const dateString = convertDateToString(day);
						const requestsForThisDay = await FirebaseFunctions.call(
							'getBusinessCurrentRequestsByDay',
							{
								businessID,
								day: dateString,
							}
						);
						setArrayOfDayRequests(requestsForThisDay);
						setRequestClicked('');
						setIsRightMenuLoading(false);
					}}
				/>
			</section>
			<section className={'rightMenuContainer'}>
				{isRightMenuLoading === true ? (
					<div className={'rightMenuLoading'}>
						<ReactLoading type={'bars'} color={colors.lightBlue} width='5vw' />
					</div>
				) : requestClicked !== '' ? (
					<div className={'column'}>
						<div className={'mainTextStyle darkBlue bold alignStart'}>
							{dayStrings[dayClicked.getDay()] +
								', ' +
								monthStrings[dayClicked.getMonth()] +
								' ' +
								dayClicked.getDate() +
								', ' +
								dayClicked.getFullYear()}
						</div>
						<div className={'spacer'} />
						<div className={'subTextStyle darkBlue bold alignStart'}>{requestClicked.time}</div>
						<div className={'blueSpacer'} />
						<div className={'subTextStyle darkBlue bold alignStart'}>{strings.RequestFrom}</div>
						<div className={'spacer'} />
						<div className={'customerInformationContainer'}>
							<img src={imagePreview} className={'customerImageContainer'} />
							<div className={'spacer'} />
							<div className={'spacer'} />
							<div className={'subTextStyle darkBlue bold'}>{requestClicked.customerName}</div>
						</div>
						<div className={'spacer'} />
						<div className={'blueSpacer'} />
						{requestClicked.assignedTo ? (
							<div>
								<div className={'mainTextStyle darkBlue bold alignStart'}>
									{strings.AssignedEmployees}
								</div>
								{requestClicked.assignedTo.map((employee) => (
									<div>
										<div className={'spacer'} />
										<div className={'subTextStyle darkBlue bold'}>{employee.employeeName}</div>
									</div>
								))}
							</div>
						) : (
							<div />
						)}
						<div className={'bigSpacer'} />
						<HelpButton
							title={strings.ViewMore}
							onClick={() => {}}
							width={'22.5vw'}
							height={'5vh'}
							fontStyle={{
								...fontStyles.white,
								...fontStyles.mainTextStyle,
								...fontStyles.bold,
							}}
						/>
						<div className={'spacer'} />
						<div className={'spacer'} />
						<HelpButton
							title={strings.MarkasComplete}
							onClick={() => {}}
							width={'22.5vw'}
							height={'5vh'}
							fontStyle={{
								...fontStyles.white,
								...fontStyles.mainTextStyle,
								...fontStyles.bold,
							}}
						/>
					</div>
				) : dayClicked !== '' ? (
					<div>
						<div className={'mainTextStyle darkBlue bold alignStart'}>
							{dayStrings[dayClicked.getDay()] +
								', ' +
								monthStrings[dayClicked.getMonth()] +
								' ' +
								dayClicked.getDate() +
								', ' +
								dayClicked.getFullYear()}
						</div>
						{arrayOfDayRequests.map((request) => (
							<div className={'requestCard'}>
								<div className={'mainTextStyle darkBlue bold alignStart'}>
									{request.serviceTitle}
								</div>
								<div className={'smallTextStyle darkBlue bold alignStart'}>{request.time}</div>
								<HelpButton
									title={strings.ViewMore}
									height={'4vh'}
									width={'9vw'}
									fontStyle={{
										...fontStyles.smallTextStyle,
										...fontStyles.white,
										...fontStyles.bold,
									}}
									onPress={() => {
										history.push({
											pathname: '/viewrequest',
											state: {
												businessID: businessID,
												requestID: request.requestID,
											},
										});
									}}
								/>
							</div>
						))}
					</div>
				) : (
					<div />
				)}
			</section>
		</div>
	);
};

// Exports the component
export default Calendar;
