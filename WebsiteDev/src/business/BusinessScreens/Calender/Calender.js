// This is going to be the screen where the calendar will be presented to the business with their events
import React, { useState, useEffect } from 'react';
import SideMenu from '../../../components/SideMenu/SideMenu';
import './Calendar.css';
import strings from '../../../config/strings';
import '../../../config/fontStyles.css';
import HelpCalendar from '../../../components/HelpCalendar/HelpCalendar';

// Declares the funcitonal component
const Calendar = (props) => {
	// Declares the state fields used in this screen
	const [businessID, setBusinessID] = useState('');
	const [currentView, setCurrentView] = useState('MONTH');
	const [dayClicked, setDayClicked] = useState('');
	const [requestClicked, setRequestClicked] = useState('');
	const [isRightMenuOpen, setIsRightMenuClicked] = useState(false);

	// The useEffect method will fetch the business's current schedule and will set all the corresponding state
	// fields above. It will call a helper function becuase it can't be async
	useEffect(() => {
		fetchInfo();
	}, []);

	// The helper function for the useEffect method
	const fetchInfo = async () => {};

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
					onWeekChange={(weekStart, weekEnd) => {
						// console.log('Week Start: ' + weekStart);
					}}
					onMonthChange={(month) => {
						// console.log('Month: ' + month);
					}}
					onDaySelected={(day) => {
						// console.log('Day Selected: ' + day);
					}}
				/>
			</section>
		</div>
	);
};

// Exports the component
export default Calendar;
