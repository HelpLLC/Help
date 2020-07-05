import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import HelpButton from '../../../components/HelpButton/HelpButton';
import EmployeeListItem from '../../../components/EmployeeListItem/EmployeeListItem';
import './EmployeeList.css';
import strings from '../../../config/strings';
import fontStyles from '../../../config/fontStyles';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import profile_pic from './profile_pic.png'; // Tell webpack this JS file uses this image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import colors from '../../../config/colors';
import TitleComponent from '../../../components/TitleComponent.js';
import ReactLoading from 'react-loading';
import DialogActions from '@material-ui/core/DialogActions';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';

export default function EmployeeList(props) {
	// Declares the global variables
	const history = useHistory();
	const location = useLocation();
	const { businessID } = location.state;

	// Declares the state fields
	const [assigned, setAssigned] = useState(false);
	const [business, setBusiness] = useState('');
	const [confirmed, setConfirmed] = useState(false);
	const [search, setSearch] = useState('');
	const [confirmedDialog, setConfirmedDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// The useEffect method which loads the business information
	useEffect(() => {
		fetchFunc();
	}, []);

	// The helper function for the useEffect method becuase it can't be async
	const fetchFunc = async () => {
		const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID: businessID,
		});
		setBusiness(business);
		setIsLoading(false);
	};

	const confirmRequest = async () => {
		await FirebaseFunctions.call('confirmRequest', {
			requestID: location.state.requestID,
		});
		setConfirmed(true);
		setConfirmedDialog(true);
	};

	const cancelRequest = () => {
		setConfirmed(false);
	};

	// Shows a loading spinner if the method is still loading
	if (isLoading === true) {
		return (
			<div className='content_container'>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='10vw' />
			</div>
		);
	}
	
	return (
		<div>
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={business.businessID}
					businessName={business.businessName}
					modalClassName='modal'
					divClassName='toprightcontainer'
				/>
			</section>
			<div className='content_container'>
				<div id='background'>
					<div className='content_container'>
						<div className='service_title bigTitleTextStyle darkBlue'>Assign Employee(s)</div>
						<div className='searchBar'>
							<HelpTextInput
								height={'5vh'}
								width={'65vw'}
								isMultiline={false}
								onChangeText={() => setSearch(search)}
								additionalIcon={
									<FontAwesomeIcon
										icon={['fas', 'search']}
										size='2x'
										style={{ padding: 10, position: 'absolute' }}
									/>
								}></HelpTextInput>
						</div>

						<EmployeeListItem name='John Doe' image={profile_pic} />
						<EmployeeListItem name='Anne Ketcheva' image={profile_pic} />
						<EmployeeListItem name='Tricia Cebotari' image={profile_pic} />

						{confirmed == true ? (
							<div className='confirmedButtons'>
								<HelpButton title={strings.CancelRequest} onPress={cancelRequest} />
								<HelpButton title={strings.CompleteRequest} onPress={completeRequest} />
							</div>
						) : (
							<div className='confirmRequest'>
								<HelpButton
									width={'65vw'}
									title={strings.ConfirmRequest}
									onPress={confirmRequest}
								/>
							</div>
						)}
					</div>
				</div>
				<Dialog
					open={confirmedDialog}
					onClose={() => {
						setConfirmedDialog(false);
					}}>
					<TitleComponent
						fontSize={50}
						text={strings.RequestConfirmed}
						isCentered={true}
						textColor={colors.darkBlue}
					/>
					<DialogContent className='dialogContent'>
						<DialogContentText
							style={{ textAlign: 'center', ...fontStyles.subTextStyle, ...fontStyles.darkBlue }}>
							{strings.CustomerNotified}
						</DialogContentText>
						<DialogContentText
							style={{
								textAlign: 'center',
								...fontStyles.mainTextStyle,
								...fontStyles.darkBlue,
								...fontStyles.bold,
							}}>
							{props.service}
						</DialogContentText>
						<DialogContentText
							style={{
								textAlign: 'center',
								...fontStyles.mainTextStyle,
								...fontStyles.darkBlue,
								...fontStyles.bold,
							}}>
							{props.date}
						</DialogContentText>
						<DialogContentText
							style={{ textAlign: 'center', ...fontStyles.subTextStyle, ...fontStyles.darkBlue }}>
							{props.time}
						</DialogContentText>
						<DialogContentText
							style={{ textAlign: 'center', ...fontStyles.subTextStyle, ...fontStyles.darkBlue }}>
							{strings.RequestAddedToCalendar}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<HelpButton
							title={strings.Ok}
							onPress={() => setConfirmedDialog(false)}
							width={'100%'}
						/>
					</DialogActions>
				</Dialog>
				<Dialog
					open={confirmedDialog}
					onClose={() => {
						setConfirmedDialog(false);
					}}>
					<TitleComponent
						fontSize={50}
						text={strings.RequestConfirmed}
						isCentered={true}
						textColor={colors.darkBlue}
					/>
					<DialogContent className='dialogContent'>
						<DialogContentText
							style={{ textAlign: 'center', ...fontStyles.subTextStyle, ...fontStyles.darkBlue }}>
							{strings.CustomerNotified}
						</DialogContentText>
						<DialogContentText
							style={{
								textAlign: 'center',
								...fontStyles.mainTextStyle,
								...fontStyles.darkBlue,
								...fontStyles.bold,
							}}>
							{props.service}
						</DialogContentText>
						<DialogContentText
							style={{
								textAlign: 'center',
								...fontStyles.mainTextStyle,
								...fontStyles.darkBlue,
								...fontStyles.bold,
							}}>
							{props.date}
						</DialogContentText>
						<DialogContentText
							style={{ textAlign: 'center', ...fontStyles.subTextStyle, ...fontStyles.darkBlue }}>
							{props.time}
						</DialogContentText>
						<DialogContentText
							style={{ textAlign: 'center', ...fontStyles.subTextStyle, ...fontStyles.darkBlue }}>
							{strings.RequestAddedToCalendar}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<HelpButton
							title={strings.Ok}
							onPress={() => setConfirmedDialog(false)}
							width={'100%'}
						/>
					</DialogActions>
				</Dialog>
			</div>
		</div>
	);
}
