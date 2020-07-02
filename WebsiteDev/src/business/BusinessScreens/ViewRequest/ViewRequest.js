// This screen is the one that is used to display a specific request
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import colors from '../../../config/colors';
import HelpButton from '../../../components/HelpButton/HelpButton';
import './ViewRequest.css';
import '../../../config/fontStyles.css';
import strings from '../../../config/strings';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import profile_pic from './profile_pic.png'; // Tell webpack this JS file uses this image
import HelpAlert from '../../../components/HelpAlert/HelpAlert';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';
import ReactLoading from 'react-loading';

// Creates the functional component
const ViewRequest = (props) => {
  // The global variables used in this screen
	let location = useLocation();
	let history = useHistory();
	const requestID = location.state.requestID;
	const months = [
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
	const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

	// The state fields that are used in this screen
	const [isLoading, setIsLoading] = useState(true);
	const [request, setRequest] = useState('');
	const [confirmed, setConfirmed] = useState();
	const [clicked, isClicked] = useState(false);
	const [business, setBusiness] = useState();
	const [businessName, setBusinessName] = useState();
	const [formattedDate, setFormattedDate] = useState('');

	// The useEffect method that will be called when this screen is navigated to
	useEffect(() => {
		fetchFunc();
	}, []);

	// Helper function for useEffect
	const fetchFunc = async () => {
		const results = await Promise.all([
			FirebaseFunctions.call('getRequestByID', {
				requestID: requestID,
			}),
			FirebaseFunctions.call('getBusinessByID', {
				businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
			}),
		]);
		let datetime = new Date(results[0].date);
		let formatted_date =
			days[datetime.getDay()] +
			', ' +
			months[datetime.getMonth()] +
			' ' +
			(datetime.getDate() + 1) +
			', ' +
			datetime.getFullYear();

		setFormattedDate(formatted_date);
		setRequest(results[0]);
		setConfirmed(results[0].confirmed);
		setBusiness(results[1]);
		setBusinessName(results[1].businessName);
		setIsLoading(false);
	};

	// Method will handle the confirmation proecess of the request
	const confirmRequest = async () => {
		await FirebaseFunctions.call('confirmRequest', {
			requestID: requestID,
		});
		history.push({
			pathname: '/employees',
			state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
		});
	};

	// Method will complete the current request
	const completeRequest = () => {};

	// Method will cancel the current request
	const cancelRequest = async () => {
		await FirebaseFunctions.call('deleteRequest', {
			requestID: requestID,
		});
		history.push({
			pathname: '/dashboard',
			state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
		});
	};

	// If the isLoading field is true, this will return the loading state of the screen
	if (isLoading === true) {
		return (
			<div className='container'>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='10vw' />
			</div>
		);
	}

	// Returns the UI of the screen
	return (
		<div>
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={business.businessID}
					businessName={businessName}
					modalClassName='modal'
					divClassName='toprightcontainer'
				/>
			</section>

			<div id='container'>
				<div className='content_container'>
					<div id='rectangle_4'>
						<div className='content_container'>
							<div className='service_title bigTextStyle darkBlue'>{request.serviceTitle}</div>
							<div className='topRow'>
								<div className='profile_details'>
									<img className='profile_pic' src={profile_pic}></img>
									<div className='request_from'>
										<text className='smallTextStyle darkBlue'>{strings.RequestFromHeader}</text>
										<text className='mainTextStyle darkBlue'>{request.customerName}</text>
									</div>
								</div>
								<div className='request_details'>
									<div className='details_column'>
										<text className='mainTextStyle darkBlue'>
											{formattedDate}
											<br />
											{request.time} - {request.endTime}
										</text>
									</div>
								</div>
							</div>
							<div className='row2'>
								<div className='questions'>
									<text className='questions_title mainTextStyle darkBlue bold'>
										{strings.QuestionResponses}
									</text>
									{request.questions.map((eachQuestion) =>
										eachQuestion.answer.length < 30 ? (
											<div className='questions_asked'>
												<text className='subTextStyle darkBlue bold'>{eachQuestion.question}</text>
												<div className='question_response_box_smaller'>
													<p className='question_response'>{eachQuestion.answer}</p>
												</div>
											</div>
										) : (
											<div className='questions_asked'>
												<text className='subTextStyle darkBlue bold'>{eachQuestion.question}</text>
												<div className='question_response_box'>
													<p className='question_response'>{eachQuestion.answer}</p>
												</div>
											</div>
										)
									)}
								</div>

								<div className='payment_container'>
									<text className='mainTextStyle darkBlue bold'>{strings.Payment}</text>
									<div className='payment_background'>
										<div className='payment_column'>
											<div className='payment_method'>
												<text className='smallTextStyle darkBlue bold'>
													{request.card === true ? strings.Card : strings.Cash}
												</text>
												<text className='payment_right smallTextStyle darkBlue'>
													{request.paymentInformation}
												</text>
											</div>
										</div>
									</div>
								</div>
							</div>
							{confirmed == true ? (
								<div className='row3'>
									<HelpButton title={strings.CancelRequest} onPress={() => isClicked(true)} />
									<HelpButton title={strings.CompleteRequest} onPress={completeRequest} />
								</div>
							) : (
								<div className='confirmRequest'>
									<HelpButton
										width={'55vw'}
										title={strings.ConfirmRequest}
										onPress={confirmRequest}
									/>
								</div>
							)}
						</div>
						<HelpAlert
							isVisible={clicked}
							onClose={cancelRequest}
							titleText={strings.CancelRequest}
							messageText={strings.CancelRequestMessage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

// Exports the functional component
export default ViewRequest;
