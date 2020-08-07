import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './assignEmployeesScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpButton from '../../components/HelpButton/HelpButton';

//exporting the confirmServiceScreen function
export default function confirmServiceScreen(props) {
	
	
    //The intial state of the screen
	const [requestTitle, setRequestTitle] = useState(strings.Loading);
	const [requestID, setRequestID] = useState('');
	const [requestData, setRequestData] = useState({});
	const [customerData, setCustomerData] = useState({});
	const [employees, setEmployees] = useState([]);
	const [employeeData, setEmployeeData] = useState([]);
	
	async function getData(){ //TODO: get employees associated with the business
        //Declares the screen name in Firebase

        //only for testing
		props = {navigation:{state:{params:{requestID:'EKY0Winhxxb85GlXy1WX', employees:['Rick Astley', 'Jared Diamond', 'James Olson', 'Tim Burton']}}}};
        const {
            requestID,
            employees,
	 	} = props.navigation.state.params;
        //gets the firebase data and initalizes the state
        const requestData = await FirebaseFunctions.call('getRequestByID', {
            requestID
        });
        const customerData = await FirebaseFunctions.call('getCustomerByID', {
            customerID:requestData.customerID
        });
        
        // const {
        //     requestID,
        //     requestData,
        //     customerData,
        //     employees,
	 	// } = props.navigation.state.params;

        setRequestID(requestID)
		setRequestTitle(requestData.serviceTitle);
        setRequestData(requestData);
        setCustomerData(customerData);
        setEmployees(employees.sort((a, b) => {
            let res = a.substring(a.lastIndexOf(' ')).localeCompare(b.substring(b.lastIndexOf(' ')));
            return res != 0 ? res : a.localeCompare(b);
        }));
        setEmployeeData(employees)
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
            <View style={style.MainContainer}>
                <View style={style.SearchBarContainer}>
                    <View style={style.SearchBar}>
                        <Icon name='search'
                            type='font-awesome-5'
                            size={50}
                            color={colors.darkBlue}
                        />
                        <TextInput textAlignVertical='center'
                            onChangeText={(input) => filterData(input)}
                            style={[fontStyles.bigTextStyle, style.SearchBarText]}
                        />
                    </View>
                </View>
                <FlatList data={employeeData}
                    renderItem={({item}) => renderItem(item)}
                    style={style.ListContainer}
                />
			</View>
            <View style={style.Footer}>
                {/*TODO: add footer here*/}
            </View>
        </View>
    );
    
    function filterData(input){
        let data = [];
        for(let i in employees)
            if(employees[i].toLowerCase().includes(input.toLowerCase()))
                data.push(employees[i]);
        setEmployeeData(data);
    }

    function renderItem(item){
        return (
            <View style={style.ItemContainer}>
                <Icon name='account-circle'
                    type='material-community'
                    size={100}
                    color={'#D0D0D0'}
                />
                <View style={style.ItemTextContainer}>
                    <Text style={[fontStyles.bigTextStyle, style.ItemText]}>{item}</Text>
                    <HelpButton
						title={strings.Assign}
						width={125}
						height={35}
						bigText={true}
						bold={true}
						onPress={() => {
							//Navigates to the next screen
							//TODO: this
						}}
					/>
                </View>
            </View>
        );
    }
}

