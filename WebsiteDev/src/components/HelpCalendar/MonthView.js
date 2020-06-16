// This is going to contain the month view for the HelpCalendar. Used to increase code readability so not everything is in
// on file
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './HelpCalendar.css';
import '../../config/fontStyles.css';

// Creates the functional component
const MonthView = (props) => {
	// The global variables used in this component
	const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

	// The props that are passed into this component
	MonthView.propTypes = {
		monthSelected: PropTypes.object.isRequired,
		onDaySelected: PropTypes.func,
	};

	// Fetches the props for the component
	const { monthSelected, onDaySelected } = props;

	// The state fields of this component
	const [currentDaySelected, setCurrentDaySelected] = useState('');
	const [dates, setDates] = useState([]);

	// This next function is going to set the array of dates that are going to be displayed on the calendar. The function
	// is set to get called after every state update from HelpCalendar.js
	useEffect(() => {
		const currentMonth = monthSelected.getMonth();
		let allDates = [];
		let eachDate = new Date();
		eachDate.setDate(1);
		eachDate.setMonth(currentMonth);
		allDates.push(eachDate);
		let currentMonthIterated = currentMonth;
		let currentDay = 1;
		while (currentMonthIterated === currentMonth) {
			let newDate = new Date();
			newDate.setMonth(currentMonthIterated);
			newDate.setDate(currentDay + 1);
			currentMonthIterated = newDate.getMonth();
			if (currentMonthIterated === currentMonth) {
				allDates.push(newDate);
				currentDay++;
			}
		}

		// Adds the "hangover dates", so that the calendar is actually full from the top and the bottom
		const lastDate = allDates[allDates.length - 1];
		currentDay = lastDate.getDay();
		let k = 1;
		for (let i = currentDay; i < 6; i++) {
			const newDate = new Date();
			newDate.setMonth(currentMonth);
			newDate.setDate(lastDate.getDate() + k);
			allDates.push(newDate);
			k++;
		}
		const firstDate = allDates[0];
		currentDay = firstDate.getDay();
		k = 1;
		for (let i = 0; i < currentDay; i++) {
			const newDate = new Date();
			newDate.setMonth(currentMonth);
			newDate.setDate(firstDate.getDate() - k);
			allDates = [newDate].concat(allDates);
			k++;
		}
		setDates(allDates);
	}, [monthSelected.getMonth()]);

	// This method is going to render the grid of tiles in the MonthView that each represent a day
	const renderDays = () => {
		if (dates.length === 0) {
			return [];
		} else {
			const arrayOfRows = [];
			for (let i = 0; i < dates.length - 6; i += 7) {
				const row = dates.slice(i, i + 7);
				arrayOfRows.push(row);
			}
			return arrayOfRows;
		}
	};

	const dayRows = renderDays();

	// Renders the UI of this screen
	return (
		<div className='monthViewContainer'>
			<div className={'flexRow'}>
				{days.map((day, index) => (
					<div
						className={
							index === 6
								? 'mainTextStyle darkBlue bold dayTitleTileContainer noRightBorder'
								: 'mainTextStyle darkBlue bold dayTitleTileContainer'
						}>
						{day}
					</div>
				))}
			</div>
			{dayRows.map((eachRow, rowIndex) => {
				return (
					<div className='flexRow'>
						{eachRow.map((eachDay, dayIndex) => {
							// Creates the style based on where the current tile is
							let className = 'dayTileContainer';
							if (rowIndex === dayRows.length - 1) {
								className = className + ' noBottomBorder';
							}
							if (dayIndex === 6) {
								className = className + ' noRightBorder';
							}
							if (dayIndex === 0 && rowIndex === dayRows.length - 1) {
								className = className + ' bottomLeftRadius';
							}
							if (dayIndex === 6 && rowIndex === dayRows.length - 1) {
								className = className + ' bottomRightRadius';
							}
							if (dates.length === 35) {
								className = className + ' tall';
							} else {
								className = className + ' short';
							}
							if (eachDay.getMonth() !== monthSelected.getMonth()) {
								className = className + ' grayBackground';
							} else {
								className = className + ' whiteBackground';
							}

							let textClassName = 'mainTextStyle darkBlue bold';
							if (currentDaySelected === eachDay) {
								if (dates.length === 35) {
									textClassName = textClassName + ' daySelectedTall';
								} else {
									textClassName = textClassName + ' daySelectedShort';
								}
							}
							return (
								<div
									onClick={() => {
										setCurrentDaySelected(eachDay);
										onDaySelected(eachDay);
									}}
									className={className}>
									<div className={textClassName}>{eachDay.getDate()}</div>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

// Exports the component
export default MonthView;
