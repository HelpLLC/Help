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

// Declares the functional component
const HelpCalendar = (props) => {
	// The prop types for this component to allow manipulation of the calendar
	HelpCalendar.propTypes = {
		onWeekChange: PropTypes.func,
		onMonthChange: PropTypes.func,
	};

	// Fetches the props used for this component
	const { onWeekChange, onMonthChange, onDaySelected } = props;

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

		setCurrentWeekStart(initialWeek);
		const oneWeekAwayDate = new Date();
		oneWeekAwayDate.setDate(initialWeek.getDate() + 6);
		setCurrentWeekEnd(oneWeekAwayDate);
		setIsLoading(false);
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
			<div className={'calendarHeader'}>
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
								onMonthChange(newMonth);
								setUpdateBoolean(!updateBoolen);
							} else {
								const newWeekStart = currentWeekStart;
								const newWeekEnd = currentWeekEnd;
								newWeekStart.setDate(currentWeekStart.getDate() + 7);
								newWeekEnd.setDate(currentWeekEnd.getDate() + 7);
								setCurrentWeekStart(newWeekStart);
								setCurrentWeekEnd(newWeekEnd);
								onWeekChange(newWeekStart, newWeekEnd);
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
						monthSelected={currentMonth}
						onDaySelected={(day) => {
							onDaySelected(day);
						}}
					/>
				) : (
					<WeekView startDate={currentWeekStart} />
				)}
			</div>
		</div>
	);
};

export default HelpCalendar;
