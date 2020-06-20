// This is going to be the screen where the calendar will be presented to the business with their events
import React, { useState, useEffect } from 'react';
import SideMenu from '../../../components/SideMenu/SideMenu';
import './Calendar.css';
import strings from '../../../config/strings';
import '../../../config/fontStyles.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import HelpCalendar from '../../../components/HelpCalendar/HelpCalendar';
import { convertDateToString } from '../../../config/basicFunctions';
import ReactLoading from 'react-loading';
import HelpButton from '../../../components/HelpButton/HelpButton';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';

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

	// Declares the state fields used in this screen
	const [businessID, setBusinessID] = useState('zjCzqSiCpNQELwU3ETtGBANz7hY2');
	const [dayClicked, setDayClicked] = useState('');
	const [requestClicked, setRequestClicked] = useState('');
	const [arrayOfDayRequests, setArrayOfDayRequests] = useState([]);
	const [isRightMenuLoading, setIsRightMenuLoading] = useState(false);

	// The useEffect method will fetch the business's current schedule and will set all the corresponding state
	// fields above. It will call a helper function becuase it can't be async
	useEffect(() => {
		fetchInfo();
	}, []);

	// The helper function for the useEffect method
	const fetchInfo = async () => {};

	console.log(arrayOfDayRequests);

	// Renders the UI of the screen based on the state of the "currentView" field which renders either a week view or a
	// month view
	return (
		<div className='calendarContainer'>
			<section className='sidebarHolder'>
				<SideMenu title={strings.Calendar} />
			</section>
			<section className='calendarHolder'>
				<div>
					<text className='darkGreen bold bigTextStyle'>{strings.Calendar}</text>
				</div>
				<HelpCalendar
					width={'50vw'}
					height={'75vh'}
					onWeekChange={(weekStart, weekEnd) => {
						// console.log('Week Start: ' + weekStart);
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
										setRequestClicked(request);
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
