import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import HelpButton from '../../../components/HelpButton/HelpButton';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import strings from '../../../config/strings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideMenu from '../../../components/SideMenu/SideMenu';

export default function ReactCalendar() {
	const [arrayOfRequests, setArrayOfRequests] = useState([]);
	const [upcomingBusinessRequest, getUpcomingBusinessRequest] = useState({});

	const fecthFunc = async () => {
		const upcomingBusinessRequest = await FirebaseFunctions.call('getUpcomingRequestByBusinessID', {
			businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
		});
		getUpcomingBusinessRequest(upcomingBusinessRequest);
		console.log(upcomingBusinessRequest);
	};

	useEffect(() => {
		fecthFunc();
	}, []);

	const array = [
		strings.TwelveAM,
		strings.OneAM,
		strings.TwoAM,
		strings.ThreeAM,
		strings.FourAM,
		strings.FiveAM,
		strings.SixAm,
		strings.SevenAM,
		strings.EightAM,
		strings.NineAM,
		strings.TenAM,
		strings.ElevenAM,
		strings.TwelvePM,
		strings.OnePM,
		strings.TwoPM,
		strings.ThreePM,
		strings.FourPM,
		strings.FivePM,
		strings.SixPM,
		strings.SevenPM,
		strings.EightPM,
		strings.NinePM,
		strings.TenPM,
		strings.ElevenPM,
	];

	return (
		<div className='top'>
			<section className='sidebarHolder'>
				<SideMenu title='Calendar' />
			</section>
			<div className='container'>
				<h1 className='header'>{strings.CalendarHeader}</h1>
				<Calendar
					onClickDay={async (value) => {
						const dateString =
							value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();

						const arrayOfRequests = await FirebaseFunctions.call(
							'getBusinessCurrentRequestsByDay',
							{
								day: dateString,
								businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
							}
						);
						setArrayOfRequests(arrayOfRequests);
					}}
				/>
				<div className='divcontainer'>
					<button>
						<h2 className='heading'>{strings.Day}</h2>
					</button>

					<button>
						<h2 className='heading'>{strings.Week}</h2>
					</button>

					<button>
						<h2 className='heading'>{strings.Month}</h2>
					</button>

					<button>
						<h2 className='heading'>{strings.Year}</h2>
					</button>
				</div>
				<div className='bottom'>
					<div className='dayscontainer'>
						<button className='daysheading'>{strings.Sunday}</button>
						<button className='daysheading'>{strings.Monday}</button>
						<button className='daysheading'>{strings.Tuesday}</button>
						<button className='daysheading'>{strings.Wednesday}</button>
						<button className='daysheading'>{strings.Thursday}</button>
						<button className='daysheading'>{strings.Friday}</button>
						<button className='daysheading'>{strings.Saturday}</button>
					</div>
					<Divider orientation='horizontal' />
					<div className='eventdetails'>
						<div className='timecarddiv'>
							<div className='timediv'>
								{array.map((eachString) => (
									<div className='arraydiv'>
										{eachString}
										<Divider orientation='horizontal' className='divider' />
									</div>
								))}
							</div>
						</div>

						<div className='carddiv'>
							<Card className='card'>
								<div>
									<h1 className='cardheader'>House Cleaning</h1>
									<p className='cardtext'>Woodinville</p>
								</div>
								<div className='cardtimetext'>
									<p className='timetext'>
										Tuesday, Mar 2, 2020
										<br /> repeats monthly
									</p>
									<p className='timetext2'>7:00 pm to 8:30 pm</p>
								</div>
								<hr />
								<div>
									<h3 className='cardadjust'>{strings.AdjustJobHeader}</h3>
									<FontAwesomeIcon className='arrow' icon='angle-right' />
								</div>
								<hr className='horiline' />
								<div className='cardrequestdiv'>
									<FontAwesomeIcon icon='user' className='person' size='2x' />
									<div>
										<h4 className='requestheaders'>{strings.RequestFromHeader}</h4>
										<h5 className='requestername'>Jim Halpert</h5>
									</div>
									<div className='arrow2div'>
										{' '}
										<FontAwesomeIcon icon='angle-right' className='arrow2' />{' '}
									</div>
								</div>
								<hr className='horiline2' />
								<div>
									<h3 className='assignedheader'>{strings.AssignedEmployeesHeader}</h3>
									<p className='assignedtext'>Dwight Shrute</p>
									<p className='assignedtext'>Pam Beasley</p>
									<FontAwesomeIcon icon='angle-right' className='arrow3' />
								</div>
								<hr className='horiline3' />
								<div>
									<h3 className='notesheader'>{strings.NotesHeader}</h3>
									<p className='notestext'>
										Make sure to get the job done and do a very good job most important people are
										the customers......
									</p>
									<h6 className='fullnotesheader'>{strings.ShowAllNotesSubHeader}</h6>
									<FontAwesomeIcon icon='angle-right' className='arrow4' />
								</div>
								<hr className='horiline3' />
								<div className='helpbutton'>
									<HelpButton title='Confirm Job' width='20vw' />
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
