// This component will be the calendar component that will allow for event displaying and day clicking
import React, { useState, useEffect } from 'react';
import '../../config/fontStyles.css';
import './HelpCalendar.css';
import strings from '../../config/strings';
import PropTypes from 'prop-types';
import colors from '../../config/colors';
import ReactLoading from 'react-loading';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { convertDateToString } from '../../config/basicFunctions';

// Declares the functional component
const HelpCalendar = (props) => {
	// The prop types for this component to allow manipulation of the calendar
	HelpCalendar.propTypes = {
		onWeekChange: PropTypes.func,
		onDaySelected: PropTypes.func,
		width: PropTypes.string,
		height: PropTypes.string,
		weekEventLoader: PropTypes.func,
		onEventClick: PropTypes.func,
	};

	// Fetches the props used for this component
	const { onDaySelected, width, height, weekEventLoader, onEventClick } = props;

	// Global variables used through out the calendar
	const monthList = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC',
	];

	// Declares the state fields for this component
	const [isLoading, setIsLoading] = useState(true);
	const [currentView, setCurrentView] = useState('MONTH');
	const [currentMonth, setCurrentMonth] = useState('');
	const [currentWeekStart, setCurrentWeekStart] = useState('');
	const [currentWeekEnd, setCurrentWeekEnd] = useState('');
	const [updateBoolen, setUpdateBoolean] = useState(false);
	const [eventsObject, setEventsObject] = useState('');
	const [eventsArray, setEventsArray] = useState('');
	const [fetched, setFetched] = useState([]);
	const [isLoadingWeek, setIsLoadingWeek] = useState(true);

	// UseEffect method will call a helper method to set the initial dates
	useEffect(() => {
		fetchInfo();
	}, []);

	// The helper function for the useEffect method
	const fetchInfo = async () => {
		// Sets the initial dates for the selectors
		const initialDate = new Date();
		setCurrentMonth(initialDate);
		const initialWeek = new Date();

		// Sets the date of the initial week to be the sunday of the week
		initialWeek.setDate(initialWeek.getDate() - initialWeek.getDay());

		// Gets the events for that week
		onWeekChange(initialWeek, 'FRONT');

		setCurrentWeekStart(initialWeek);
		const oneWeekAwayDate = new Date();
		oneWeekAwayDate.setDate(initialWeek.getDate() + 6);
		setCurrentWeekEnd(oneWeekAwayDate);
		setIsLoading(false);
	};

	// This helper function handles the event logic behind loading a specific week. It loads the previous week and the week
	// afterwards too in order to reduce loading speeds and show a better UI
	const onWeekChange = async (weekStart, direction) => {
		if (
			!fetched.find(
				(eachObject) =>
					eachObject.direction === direction &&
					eachObject.weekStart === convertDateToString(weekStart)
			)
		) {
			setIsLoadingWeek(true);
			if (eventsObject === '') {
				const twoWeeksBefore = new Date();
				twoWeeksBefore.setMonth(weekStart.getMonth());
				twoWeeksBefore.setDate(weekStart.getDate() - 14);
				const twoWeekBeforeDateString = convertDateToString(twoWeeksBefore);

				const twoWeeksAfter = new Date();
				twoWeeksAfter.setMonth(weekStart.getMonth());
				twoWeeksAfter.setDate(weekStart.getDate() + 14);
				const twoWeekAfterDateString = convertDateToString(twoWeeksAfter);

				const finalArray = await weekEventLoader(twoWeekBeforeDateString, twoWeekAfterDateString);

				const finalObject = {};
				// Constructs the final array as an object with dates as the key and the object as the value
				for (const day of finalArray) {
					finalObject[day[0].date] = day;
				}

				setEventsArray(finalArray);
				setEventsObject(finalObject);
			} else {
				let newEvents = '';
				if (direction === 'FRONT') {
					newEvents = eventsArray;

					const twoWeekAfter = new Date();
					twoWeekAfter.setMonth(weekStart.getMonth());
					twoWeekAfter.setDate(weekStart.getDate() + 14);
					const twoWeekAfterDateString = convertDateToString(twoWeekAfter);

					const threeWeekAfter = new Date();
					threeWeekAfter.setMonth(weekStart.getMonth());
					threeWeekAfter.setDate(weekStart.getDate() + 21);
					const threeWeekAfterDateString = convertDateToString(threeWeekAfter);

					const result = await weekEventLoader(twoWeekAfterDateString, threeWeekAfterDateString);

					const finalArray = newEvents.concat(result);

					const finalObject = {};
					// Constructs the final array as an object with dates as the key and the object as the value
					for (const day of finalArray) {
						finalObject[day[0].date] = day;
					}

					setEventsArray(finalArray);
					setEventsObject(finalObject);
				} else {
					newEvents = eventsArray;

					const twoWeekBefore = new Date();
					twoWeekBefore.setMonth(weekStart.getMonth());
					twoWeekBefore.setDate(weekStart.getDate() - 14);
					const twoWeekBeforeDateString = convertDateToString(twoWeekBefore);

					const threeWeekBefore = new Date();
					threeWeekBefore.setMonth(weekStart.getMonth());
					threeWeekBefore.setDate(weekStart.getDate() - 21);
					const threeWeekBeforeDateString = convertDateToString(threeWeekBefore);

					const result = await weekEventLoader(threeWeekBeforeDateString, twoWeekBeforeDateString);
					const finalArray = result.concat(newEvents);

					const finalObject = {};
					// Constructs the final array as an object with dates as the key and the object as the value
					for (const day of finalArray) {
						if (day.length > 0) {
							finalObject[day[0].date] = day;
						}
					}

					setEventsArray(finalArray);
					setEventsObject(finalObject);
				}
			}
			const newFetched = fetched.concat({ weekStart: convertDateToString(weekStart), direction });
			setFetched(newFetched);
			setIsLoadingWeek(false);
		}
	};

	// Renders a loading spinner if the screen is still loading
	if (isLoading === true) {
		return (
			<div className={'calendarLoadingScreen'}>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='10vw' />
			</div>
		);
	}

	// Renders the UI
	return (
		<div>
			<div style={{ width }} className={'calendarHeader'}>
				<div className={'weekMonth'}>
					<button
						onClick={() => {
							setCurrentView('WEEK');
						}}
						className={
							currentView === 'MONTH'
								? 'mainTextStyle darkBlue bold clickable'
								: 'mainTextStyle lightBlue bold clickable'
						}>
						{strings.Week}
					</button>
					<div className={'spacer'} />
					<div className={'spacer'} />
					<button
						onClick={() => {
							setCurrentView('MONTH');
						}}
						className={
							currentView === 'MONTH'
								? 'mainTextStyle lightBlue bold clickable'
								: 'mainTextStyle darkBlue bold clickable'
						}>
						{strings.Month}
					</button>
				</div>
				<div className={'weekMonthSelector'}>
					<button
						className={'bigTextStyle lightBlue bold clickable'}
						onClick={() => {
							// Updates the current date based on the type of view
							if (currentView === 'MONTH') {
								const newMonth = currentMonth;
								newMonth.setMonth(currentMonth.getMonth() - 1);
								setCurrentMonth(newMonth);
								setUpdateBoolean(!updateBoolen);
							} else {
								const newWeekStart = currentWeekStart;
								const newWeekEnd = currentWeekEnd;
								newWeekStart.setDate(currentWeekStart.getDate() - 7);
								newWeekEnd.setDate(currentWeekEnd.getDate() - 7);
								setCurrentWeekStart(newWeekStart);
								setCurrentWeekEnd(newWeekEnd);
								onWeekChange(newWeekStart, 'BACK');
								setUpdateBoolean(!updateBoolen);
							}
						}}>
						{'<'}
					</button>

					<div className={'spacer'} />

					{currentView === 'MONTH' ? (
						<div className={'mainTextStyle darkBlue bold'}>
							{monthList[currentMonth.getMonth()] + ' ' + currentMonth.getFullYear()}
						</div>
					) : (
						<div className={'subTextStyle darkBlue bold'}>
							{monthList[currentWeekStart.getMonth()] +
								' ' +
								currentWeekStart.getDate() +
								', ' +
								currentWeekStart.getFullYear() +
								' - ' +
								monthList[currentWeekEnd.getMonth()] +
								' ' +
								currentWeekEnd.getDate() +
								', ' +
								currentWeekEnd.getFullYear()}
						</div>
					)}

					<div className={'spacer'} />

					<button
						onClick={() => {
							// Updates the current date based on the type of view
							if (currentView === 'MONTH') {
								const newMonth = currentMonth;
								newMonth.setMonth(currentMonth.getMonth() + 1);
								setCurrentMonth(newMonth);
								setUpdateBoolean(!updateBoolen);
							} else {
								const newWeekStart = currentWeekStart;
								const newWeekEnd = currentWeekEnd;
								newWeekStart.setDate(currentWeekStart.getDate() + 7);
								newWeekEnd.setDate(currentWeekEnd.getDate() + 7);
								setCurrentWeekStart(newWeekStart);
								setCurrentWeekEnd(newWeekEnd);
								onWeekChange(newWeekStart, 'FRONT');
								setUpdateBoolean(!updateBoolen);
							}
						}}
						className={'bigTextStyle lightBlue bold clickable'}>
						{'>'}
					</button>
				</div>
			</div>
			<div className={'monthWeekView'}>
				{currentView === 'MONTH' ? (
					<MonthView
						width={width}
						height={height}
						monthSelected={currentMonth}
						onDaySelected={(day) => {
							onDaySelected(day);
						}}
					/>
				) : (
					<WeekView
						width={width}
						height={height}
						startDate={currentWeekStart}
						events={eventsObject}
						onEventClick={(request) => onEventClick(request)}
						isLoadingWeek={isLoadingWeek}
					/>
				)}
			</div>
		</div>
	);
};

export default HelpCalendar;
