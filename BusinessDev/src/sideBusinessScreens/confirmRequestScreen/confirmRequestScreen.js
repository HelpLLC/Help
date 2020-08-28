import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './confirmRequestScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../../components/TopBanner/TopBanner';
import RequestDisplay from '../../components/RequestDisplay/RequestDisplay';
import LoadingSpinner from '../../components/LoadingSpinner';
import HelpButton from '../../components/HelpButton/HelpButton';

//exporting the confirmServiceScreen function
export default function confirmServiceScreen(props) {
	
	
    //The intial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [requestTitle, setRequestTitle] = useState(strings.Loading);
	const [requestID, setRequestID] = useState('');
	const [requestData, setRequestData] = useState({});
	const [customerData, setCustomerData] = useState({});
	const [employees, setEmployees] = useState([]);
	
	async function getData(){ //TODO: get employees associated with the business
		//Declares the screen name in Firebase
		// props = {navigation:{state:{params:{requestID:'EKY0Winhxxb85GlXy1WX'}}}}; //NOTE: this line is only for testing
        FirebaseFunctions.setCurrentScreen('ConfirmServiceScreen', 'confirmServiceScreen');
        const {
			requestID
	 	} = props.navigation.state.params;
        setRequestID(requestID)
        //gets the firebase data and initalizes the state
        const requestData = await FirebaseFunctions.call('getRequestByID', {
            requestID
        });
        const customerData = await FirebaseFunctions.call('getCustomerByID', {
            customerID:requestData.customerID
		});
        const employeeData = await FirebaseFunctions.call('getEmployeesByBusinessID', {
            businessID:requestData.businessID
		});
		setRequestTitle(requestData.serviceTitle);
        setRequestData(requestData);
		setCustomerData(customerData);
		setEmployees(employeeData)
        setIsScreenLoading(false);
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
						customer={customerData}/>
				</ScrollView>
				<View style={style.ButtonContainer}>
					<HelpButton
						title={strings.AssignEmployees}
						width={200}
						height={50}
						bigText={true}
						bold={true}
						style={style.Button}
						onPress={() => {
							//Navigates to the next screen
							props.navigation.push('assignEmployeesScreen', {
								requestID,
								requestData,
								customerData,
								employees,
							});
						}}
					/>
				</View>
			</View>
		);
	}
}

