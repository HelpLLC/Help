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
	const [requestData, setRequestData] = useState({});
	const [employees, setEmployees] = useState([]);
	const [employeeData, setEmployeeData] = useState([]);
	const [assignedEmployee, setAssignedEmployee] = useState('');
	const [popupVisible, setPopupVisible] = useState(false);
	
	async function getData(){ //TODO: get employees associated with the business
        //Declares the screen name in Firebase

        // //only for testing
		// props = {navigation:{state:{params:{requestID:'EKY0Winhxxb85GlXy1WX', employees:['Rick Astley', 'Jared Diamond', 'James Olson', 'Tim Burton']}}}};
        // const {
        //     requestID,
        //     employees,
	 	// } = props.navigation.state.params;
        // //gets the firebase data and initalizes the state
        // const requestData = await FirebaseFunctions.call('getRequestByID', {
        //     requestID
        // });
        
        const {
            requestData,
            employees,
	 	} = props.navigation.state.params;

		setRequestTitle(requestData.serviceTitle);
        setRequestData(requestData);
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
            {popupVisible ? (
                <View style={style.PopupContainer}> 
                    <View style={style.PopupTextContainer}>
                        <Text style={[fontStyles.bigTextStyle, style.PopupTitle]}>{strings.EmployeeAssigned}</Text>
                        <Text style={[fontStyles.mainTextStyle, style.PopupText]}>{strings.EmployeeAssignedMessage.replace(/NAME/, assignedEmployee)}</Text>

                        <Text style={[fontStyles.bigTextStyle, style.PopupDetails]}>{requestData.serviceTitle}</Text>
                        <Text style={[fontStyles.bigTextStyle, style.PopupDetails]}>{getDateString()}</Text>
                        <Text style={[fontStyles.bigTextStyle, style.PopupDetails]}>{`${formatTime(requestData.time)} - ${formatTime(requestData.endTime)}`}</Text>

                        <Text style={[fontStyles.mainTextStyle, style.PopupText]}>{strings.EmployeeAssignedCalenderMessage.replace(/NAME/, assignedEmployee)}</Text>
                        <HelpButton
                            title={strings.Close}
                            isLightButton={true}
                            width={100}
                            height={45}
                            bigText={true}
                            bold={true}
                            onPress={() => setPopupVisible(false)}
                        />
                    </View>
                </View>
            ) : null}
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
                    {item == assignedEmployee ? 
                    <Text style={[fontStyles.bigTextStyle, style.ItemAssignedText]}>{strings.Assigned}</Text>
                    : <HelpButton
						title={strings.Assign}
						width={125}
						height={35}
						bigText={true}
						bold={true}
						onPress={() => assignEmployee(item)}
					/>}
                </View>
            </View>
        );
    }

    function assignEmployee(employee){

        //TODO: fill out the backend for this method

        setAssignedEmployee(employee);
        setPopupVisible(true);
    }

    function getDateString(){
        let out = new Date(requestData.date).toDateString();
        out = out.substring(0,3).toUpperCase() + out.substring(3);
        out = out.substring(0,out.indexOf(' ')) + ',' + out.substring(out.indexOf(' '));
        out = out.substring(0,out.lastIndexOf(' ')) + ',' + out.substring(out.lastIndexOf(' '));
        return out;
    }

    function formatTime(str){
        return str.toLowerCase().replace(/\s/g, '');
    }
}

