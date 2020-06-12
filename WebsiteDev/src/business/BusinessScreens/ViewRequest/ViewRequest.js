import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import HelpButton from '../../../components/HelpButton/HelpButton';
import SideMenu from '../../../components/SideMenu/SideMenu';
import './ViewRequest.css';
import '../../../config/fontStyles.css';
import strings from '../../../config/strings';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import profile_pic from './profile_pic.png'; // Tell webpack this JS file uses this image

export default function ViewRequest(props) {
	const [requestID, setRequestID] = useState(props.requestID);
	const [service, setService] = useState(props.service);
	const [name, setName] = useState(props.name);
	const [day, setDay] = useState('');
	const [date, setDate] = useState(props.date);
	const [time, setTime] = useState('');
	const [questions, setQuestions] = useState();
	const [paymentType, setPaymentType] = useState('Card');
	const [cardNumber, setCardNumber] = useState('');
	const [total, setTotal] = useState(props.total);
	const [response, setResponse] = useState(
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
	);
	const [response2, setResponse2] = useState('Lorem ipsum dolor sit amet.');
	const [confirmed, setConfirmed] = useState(props.total);
	let history = useHistory();

	const confirmRequest = async() => {
		// const confirm = await FirebaseFunctions.call('confirmRequest', { requestID: requestID });

		history.push({
			pathname: '/employees',
			state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
		})
	};
	const cancelRequest = () => {
		
	};
	const completeRequest = () => {
		
	};

	return (
		<div id='container'>
			<SideMenu />
			<div id='rectangle_4'>
				<div className='content_container'>
					<div className='service_title bigTitleTextStyle darkBlue'>{service}</div>
					<div className='topRow'>
						<div className='profile_details'>
							<img className='profile_pic' src={profile_pic}></img>
							<div className='request_from'>
								<text className='smallTextStyle darkBlue'> {strings.RequestFromHeader} </text>
								<text className='mainTextStyle darkBlue'> {name} </text>
							</div>
						</div>
						<div className='request_details'>
							<div className='details_column'>
								<text className='mainTextStyle darkBlue'>
									{' '}
									{day}, {date}{' '}
								</text>
								<text className='subTextStyle darkBlue'> {time} </text>
							</div>
						</div>
					</div>
					<div className='row2'>
						<div className='questions'>
							<text className='questions_title mainTextStyle darkBlue bold'>
								{strings.QuestionResponses}
							</text>
							<text className='mainTextStyle darkBlue bold'> What is your _____? </text>
							<div className='question_response'>
								<HelpTextInput
									height='15vh'
									width='35vw'
									editable={false}
									value={response}
									onChangeText={(response) => setResponse(response)}
									isMultiline={true} />
							</div>
							<text className='mainTextStyle darkBlue bold'> What is your _____? </text>
							<div className='question_response'>
								<HelpTextInput
									height='4vh'
									width='35vw'
									editable={false}
									value={response2}
									onChangeText={(response2) => setResponse2(response2)}
									isMultiline={false} />
							</div>
						</div>
						{paymentType == 'Card' ? (
							<div className='payment_container'>
								<text className='mainTextStyle darkBlue bold'> {strings.Payment} </text>
								<div className='payment_background'>
									<div className='payment_column'>
										<div className='payment_method'>
											<text className='smallTextStyle darkBlue bold'>{paymentType}</text>
											<text className='payment_right smallTextStyle darkBlue'>{cardNumber}</text>
										</div>
										<div className='payment_method'>
											<text className='smallTextStyle darkBlue bold'>{strings.total}</text>
											<text className='payment_right smallTextStyle darkBlue'>{total}</text>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='payment_container'>
								<text className='mainTextStyle darkBlue bold'> {strings.Payment} </text>
								<div className='payment_background'>
									<div className='payment_column'>
										<div className='payment_method'>
											<text className='smallTextStyle darkBlue bold'>{paymentType}</text>
											<text className='payment_right smallTextStyle darkBlue'>{total}</text>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					{confirmed == true ? (
						<div className='row3'>
							<HelpButton
								title={strings.CancelRequest}
								onPress={cancelRequest} />
							<HelpButton
								title={strings.CompleteRequest}
								onPress={completeRequest} />
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
			</div>
		</div>
	);
}
