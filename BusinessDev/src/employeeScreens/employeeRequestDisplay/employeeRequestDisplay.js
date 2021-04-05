import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './employeeRequestDisplayStyle';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../../components/TopBanner/TopBanner';
import RequestDisplay from '../../components/RequestDisplay/RequestDisplay';
import LoadingSpinner from '../../components/LoadingSpinner';
import HelpButton from '../../components/HelpButton/HelpButton';

//exporting the confirmServiceScreen function
export default function employeeRequestDisplay(props) {
	
    //The intial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [requestTitle, setRequestTitle] = useState(strings.Loading);
	const [requestID, setRequestID] = useState('');
	const [requestData, setRequestData] = useState({});
	
	async function getData(){
		//Declares the screen name in Firebase
		props = {navigation:{state:{params:{requestID:'EKY0Winhxxb85GlXy1WX'}}}}; //NOTE: this line is only for testing
        FirebaseFunctions.setCurrentScreen('ConfirmServiceScreen', 'confirmServiceScreen');
        const {
			requestID
	 	} = props.navigation.state.params;
        setRequestID(requestID)
        //gets the firebase data and initalizes the state
        const requestData = await FirebaseFunctions.call('getRequestByID', {
            requestID
        });
		setRequestTitle(requestData.serviceTitle);
        setRequestData(requestData);
        setIsScreenLoading(false);

		// //NOTE: this is just for testing purposes
		// setRequestTitle("Photography");
        // setRequestData({
		// 	date: "December 17, 1995 03:24:00",
		// 	time: "5:00 AM",
		// 	endTime: "7:00AM",
		// 	assignedTo: "Fred Jones",
		// 	cash: true,
		// 	paymentInformation: "",
		// });
		// setCustomerData({
		// 	name: "Shaggy Rogers",
		// 	address: "14504 NE 2nd Pl, Bellevue, WA 98007",
		// 	phoneNumber: "8008888888",
		// 	email: "fakeemail@emailprovider.com"
		// });
        // setIsScreenLoading(false);
		
    }
    useEffect(() => {
        getData();
	}, []);

	//rendering the screen
	return (
        <View style={style.Body}>
            <TopBanner
				title={requestTitle}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
            {renderContent()}
            <View style={style.Footer}>
                {/*TODO: add footer here*/}
            </View>
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
					/>
				</ScrollView>
			</View>
		);
	}
}

