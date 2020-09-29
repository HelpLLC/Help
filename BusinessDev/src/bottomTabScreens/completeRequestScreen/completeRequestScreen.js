import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './completeRequestScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../../components/TopBanner/TopBanner';
import RequestDisplay from '../../components/RequestDisplay/RequestDisplay';
import LoadingSpinner from '../../components/LoadingSpinner';
import HelpChoiceAlert from '../../components/HelpChoiceAlert';

//exporting the confirmServiceScreen function
export default function confirmServiceScreen(props) {
	
    //The intial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [requestTitle, setRequestTitle] = useState(strings.Loading);
	const [requestID, setRequestID] = useState('');
	const [requestData, setRequestData] = useState({});
	const [customerData, setCustomerData] = useState({});

	const [popupState, setPopupState] = useState(-1);
	const [travelStart, setTravelStart] = useState('');
	const [jobStart, setJobStart] = useState('');
	const [jobFinish, setJobFinish] = useState('');


	async function getData(){
		//Declares the screen name in Firebase
		props = {navigation:{state:{params:{requestID:'EKY0Winhxxb85GlXy1WX'}}}}; //NOTE: this line is only for testing
        const {
			requestID:RID
	 	} = props.navigation.state.params;
        setRequestID(RID)
        //gets the firebase data and initalizes the state
        const requestData = await FirebaseFunctions.call('getRequestByID', {
            requestID:RID
        });
        const customerData = await FirebaseFunctions.call('getCustomerByID', {
            customerID:requestData.customerID
		});
		setRequestTitle(requestData.serviceTitle);
        setRequestData(requestData);
		setCustomerData(customerData);
        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
	}, []);

	function formatDate(date){
		if(date == '') return ' ';
		let month = date.getMonth() + 1;
		let day = date.getDate();
		day = (day < 10 ? '0'+day:''+day);
		month = (month < 10 ? '0'+month:''+month);
		let hour = date.getHours();
		let minute = date.getMinutes();
		hour = (hour % 12 == 0 ? '12' : ''+(hour % 12));
		minute = (minute < 10 ? '0'+minute:''+minute);
		let ampm = ((date.getHours() % 24) >= 12 ? 'pm' : 'am')
		return `${month}/${day} - ${hour}:${minute}${ampm}`;
	}

	//rendering the screen
	return (
        <View style={style.Body}>
            <TopBanner
				title={requestTitle}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
            {renderContent()}
			<HelpChoiceAlert 
				isVisible={popupState == 1}
				onCancel={()=>{
					setPopupState(-1);
				}}
				onConfirm={()=>{
					setTravelStart(new Date());
					setPopupState(-1);
				}}
				message={strings.EnrouteText}
				confirmText={strings.Send}
				cancelText={strings.Cancel}
			/>
			<HelpChoiceAlert 
				isVisible={popupState == 2}
				onCancel={()=>{
					setPopupState(-1);
				}}
				onConfirm={()=>{
					setJobStart(new Date());
					setPopupState(-1);
				}}
				message={strings.StartJob}
				confirmText={strings.Start}
				cancelText={strings.Cancel}
			/>
			<HelpChoiceAlert 
				isVisible={popupState == 3}
				onCancel={()=>{
					setPopupState(-1);
				}}
				onConfirm={()=>{
					setJobFinish(new Date());
					setPopupState(4);
				}}
				message={strings.FinishJob}
				confirmText={strings.Finish}
				cancelText={strings.Cancel}
			/>
			<HelpChoiceAlert 
				isVisible={popupState == 4}
				onConfirm={()=>{
					//TODO: this; continue to next screen
				}}
				message={strings.JobCompleted}
				confirmText={strings.ContinueToPayment}
			/>
        </View>
	);
	
	function renderContent(){
		if(isScreenLoading) return (
			<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
				<LoadingSpinner isVisible={true} />
			</View>
		);
		else return (
			<View style={style.MainContainer}>
				<ScrollView style={style.RequestDetailsContainer}>
					<RequestDisplay
						request={requestData}
						customer={customerData}/>
				</ScrollView>
				<View style={style.FooterContainer}>
					<View style={style.CollumnContainer}>
						<TouchableOpacity onPress={()=>{setPopupState(1)}} disabled={travelStart != ''}>
							<Icon name={'truck'}
								type={'material-community'}
								size={60}
								color={colors.white}/>
							<Text style={style.FooterSubject}>{strings.OnMyWay}</Text>
							<Text style={style.FooterCaption}>{formatDate(travelStart)}</Text>
						</TouchableOpacity>
					</View>
					<View style={style.CollumnContainer}>
						<TouchableOpacity onPress={()=>{setPopupState(2)}} disabled={travelStart == '' || jobStart != ''}>
							<Icon name={'play'}
								type={'material-community'}
								size={60}
								color={colors.white}/>
							<Text style={style.FooterSubject}>{strings.Start}</Text>
							<Text style={style.FooterCaption}>{formatDate(jobStart)}</Text>
						</TouchableOpacity>
					</View>
					<View style={style.CollumnContainer}>
						<TouchableOpacity onPress={()=>{setPopupState(3)}} disabled={jobStart == '' || jobFinish != ''}>
							<Icon name={'thumb-up'}
								type={'material-community'}
								size={60}
								color={colors.white}/>
							<Text style={style.FooterSubject}>{strings.Done}</Text>
							<Text style={style.FooterCaption}>{formatDate(jobFinish)}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

