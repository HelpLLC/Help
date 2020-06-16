// This is going to represent the specific week view component for the HelpCalendar component
import React, { useState, useEffect } from 'react';
import './HelpCalendar.css';
import '../../config/fontStyles.css';

// Creates the functional component
const WeekView = (props) => {
	// The global variables that are going to be used in this component
	const dayStrings = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

	// Declares the props that will be used in this view
	const { startDate } = props;

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

	console.log(dates);
	// Renders the UI for the component
	return <div />;
};

// Exports the component
export default WeekView;
