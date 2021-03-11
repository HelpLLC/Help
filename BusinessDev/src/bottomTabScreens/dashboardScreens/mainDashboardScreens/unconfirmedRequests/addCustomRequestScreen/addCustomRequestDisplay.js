import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './addCustomRequestDisplayStyle';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../../../../../components/TopBanner/TopBanner';
import EditRequest from '../../../../../components/EditRequest/EditRequest';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import HelpButton from '../../../../../components/HelpButton/HelpButton';

//exporting the confirmServiceScreen function
export default function employeeRequestDisplay(props) {
	
    //The intial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [serviceTitle, setServiceTitle] = useState(strings.Loading);
	const [serviceID, setServiceID] = useState('');
	const [serviceData, setServiceData] = useState({});
	const [requestData, setRequestData] = useState({});
	
	async function getData(){
		//Declares the screen name in Firebase
		// props = {navigation:{state:{params:{serviceID:'EKY0Winhxxb85GlXy1WX'}}}}; //NOTE: this line is only for testing
        // FirebaseFunctions.setCurrentScreen('ConfirmServiceScreen', 'confirmServiceScreen');
        // const {
		// 	SID
	 	// } = props.navigation.state.params;
        // setServiceID(SID)
        // //gets the firebase data and initalizes the state
        // const serviceData = await FirebaseFunctions.call('getServiceByID', {
        //     serviceID: SID
        // });
		// setServiceTitle(serviceData.serviceTitle);
		// setServiceData(serviceData);
        // setIsScreenLoading(false);

		setServiceTitle("Photography");
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
				title={serviceTitle}
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
		else {
			return (
				<View style={style.MainContainer}>
					<ScrollView style={style.RequestDetailsContainer}>
						<EditRequest
							request={serviceData}
							onDataChange={data => {
								setRequestData(data);
							}}/>
					</ScrollView>
					<View style={style.ButtonContainer}>
						<HelpButton
							title={strings.AddRequest}
							width={200}
							height={50}
							bigText={true}
							bold={true}
							style={style.Button}
							onPress={() => {
								return null; //NOTE: this is here for testing putposes
								//Navigates to the next screen
								let obj = serviceData.questions;
								for(let i in requestData.answers)
									obj[i].answer = requestData.answers[i];
								FirebaseFunctions.call('customRequestService', {
									...serviceData,
									businessID: props.navigation.state.params.businessID,
									customerLocation: requestData.customerAddress,
									// paymentInformation,
									// cash,
									// card,
									date: requestData.date,
									questions: obj,
									// price,
									// priceText,
									// review,
									serviceTitle: requestData.serviceTitle,
									customerName: requestData.customerName,
									// serviceDuration,
									requestedOn: new Date().toString(),
									serviceID,
									// status,
									time: requestData.time,
									endTime: requestData.endTime,
								});
								props.navigation.push('unconfirmedRequestsScreen', {

								});
							}}
						/>
					</View>
				</View>
			);
		}
	}
}

