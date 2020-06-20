// This is going to represent the specific week view component for the HelpCalendar component
import React, { useState, useEffect } from 'react';
import './HelpCalendar.css';
import PropTypes from 'prop-types'
import '../../config/fontStyles.css';

// Creates the functional component
const WeekView = (props) => {
	// The global variables that are going to be used in this component
	const dayStrings = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

	// The props that are passed into this component
	WeekView.propTypes = {
		startDate: PropTypes.object.isRequired,
		width: PropTypes.string,
		height: PropTypes.string
	};

	// Declares the props that will be used in this view
	const { startDate, width, height } = props;

	// The state variables that will be used in the component
	const [dates, setDates] = useState([]);

	// The useEffect method will construct the dates array for this component
	useEffect(() => {
		const datesArray = [];
		for (let i = startDate.getDate(); i < startDate.getDate() + 7; i++) {
			const newDate = new Date();
			newDate.setMonth(startDate.getMonth());
			newDate.setDate(i);
			datesArray.push(newDate);
		}
		setDates(datesArray);
	}, [startDate.getDate()]);

	// Renders the UI for the component
	return (
		<div style={{ width, height }} className='monthViewContainer'>
			<div className={'flexRow'}>
				{dates.map((date, index) => (
					<div
						className={
							index === 6 ? 'weekdayTitleTileContainer noRightBorder' : 'weekdayTitleTileContainer'
						}>
						<div className={'subTextStyle darkBlue bold'}>{dayStrings[date.getDay()]}</div>
						<div className={'smallTextStyle darkBlue bold'}>{date.getDate()}</div>
					</div>
				))}
			</div>
			<div className={'flexRow'}>
				{dates.map((date, index) => (
					<div
						className={
							index === 6 ? 'weekdayTileContainer noRightBorder' : 'weekdayTileContainer'
						}></div>
				))}
			</div>
		</div>
	);
};

// Exports the component
export default WeekView;
