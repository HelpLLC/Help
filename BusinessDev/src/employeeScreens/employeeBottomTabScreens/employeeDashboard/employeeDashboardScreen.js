import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../../components/TopBanner/TopBanner';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../components/HelpButton/HelpButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import style from './employeeDashboardScreenStyle';
import { diff } from 'react-native-reanimated';

export default function dashboardScreen(props) {
	// props = {navigation:{push:()=>{},state:{params:{employeeID:''}}}}; //NOTE: this line is only for testing

    //the state of the function
    // const [employeeID, setEmployeeID] = useState('');
    const [requests, setRequests] = useState([]);
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase

        // FirebaseFunctions.setCurrentScreen('calendarScreen', 'calendarScreen');
        const {
			employeeID:EID
        } = props.navigation.state.params;
        const employeeData = await FirebaseFunctions.call('getEmployeeByID', {
            employeeID:EID
        });

		// const employeeData = { currentRequests:[
		// 	{
		// 		address: "12345 67th Ave SE Bothell, WA 98012",
		// 		customerName: "Miranda Colburn",
		// 		serviceTitle: "Photography",
		// 		startTime: "4:00 AM",
		// 		endTime: "5:00 AM",
		// 		date:"2021-02-11"
		// 	},
		// 	{
		// 		serviceTitle: "Photography",
		// 		startTime: "8:00 AM",
		// 		endTime: "9:00 AM",
		// 		date:"2021-02-11"
		// 	},
		// 	{
		// 		serviceTitle: "Photography",
		// 		startTime: "6:00 AM",
		// 		endTime: "7:00 AM",
		// 		date:"2021-02-11"
		// 	},
		// 	{
		// 		serviceTitle: "Photography",
		// 		startTime: "3:00 AM",
		// 		endTime: "4:00 AM",
		// 		date:"2021-02-12"
		// 	},
		// 	{
		// 		serviceTitle: "Photography",
		// 		startTime: "3:00 AM",
		// 		endTime: "4:00 AM",
		// 		date:"2021-02-14"
		// 	},
		// ]};


		for(let i in employeeData.currentRequests){
			let obj = employeeData.currentRequests[i];
			let date = new Date(obj.date);
			date.setDate(date.getDate()+1);
			date.setHours(parseInt(obj.startTime.substr(0, obj.startTime[1] == ':' ? 1 : 2)) + (obj.startTime.toLowerCase().includes('p') ? 12 : 0));
			date.setMinutes(parseInt(obj.startTime.substr((obj.startTime[1] == ':' ? 2 : 3), 2)));
			employeeData.currentRequests[i].startDate = date;
		}
		
		employeeData.currentRequests.sort((a,b) => a.startDate - b.startDate);
        // setEmployeeID(EID);
		setRequests(employeeData.currentRequests);
        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);

	function findSectionDetails(startHours, endHours){
		let startDate = new Date();
		startDate.setHours(startDate.getHours() + startHours);
		let endDate = new Date();
		endDate.setHours(endDate.getHours() + endHours);

		let startIndex = 0;
		let endIndex = 0;
		let length = 0;

		for(let i = 0; i < requests.length && requests[i].startDate < endDate; i++){
			if(requests[i].startDate < startDate) startIndex = i + 1;
			endIndex = i + 1;
		}

		length = endIndex - startIndex;
		return {startIndex, endIndex, length};
	}

	function renderSection(startHours, endHours, detailed = false){
		let sectionDetails = findSectionDetails(startHours, endHours);
		let elements = [];
		for(let i = sectionDetails.startIndex; i < sectionDetails.endIndex; i++){
			let obj = requests[i];
			let difference = (requests[i].startDate.getTime() - new Date().getTime()) / (60 * 1000); //difference in minutes

			let timeText = 'In ';
			if(difference / (60 * 24 * 365) > 1) timeText += Math.round(difference / (60 * 24 * 365)) + 'yr';
			else if(difference / (60 * 24 * 30) > 1) timeText += Math.round(difference / (60 * 24 * 30)) + 'mth';
			else if(difference / (60 * 24) > 1) timeText += Math.round(difference / (60 * 24)) + 'dy';
			else if(difference / (60) > 1) timeText += Math.round(difference / (60)) + 'hr';
			else timeText += Math.round(difference) + 'min';

			elements.push(
				<View style={style.RequestContainer} key={i}>
					<View style={style.RowContainer}>
						<Text style={style.RequestText}>{obj.serviceTitle}</Text>
						<Text style={style.RequestText}>{formatTime(obj.startTime) + ' - ' + formatTime(obj.endTime)}</Text>
					</View>
					{detailed ? <View>
						<Text style={style.RequestDetailText}>{obj.customerName}</Text>
						<Text style={style.RequestDetailText}>{obj.address}</Text>
					</View>: null}
					<View style={style.RowContainer}>
						<Text style={style.RequestTimeText}>{timeText}</Text>
						<HelpButton
							title={strings.ViewRequest}
							isLightButton={false}
							width={150}
							height={25}
							bigText={true}
							bold={true}
							onPress={() => {
								props.navigation.push('employeeRequestDisplay', { requestID:obj.requestID });
							}}
						/>
					</View>
				</View>
			);
		}

		return elements;
	}

	function formatTime(time){
		return time.replace(' ', '').toLowerCase();
	}

	if(isScreenLoading) return (
        <View style={style.Body}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <LoadingSpinner isVisible={true} />
            </View>
        </View>
    );
    else return (
		<View>
			<TopBanner
				title={strings.Dashboard}
				size={30}
				leftOnPress={() => props.navigation.goBack()}/>

			<ScrollView style={{height:screenHeight * 0.9 - 20}}>
				{findSectionDetails(0, 1).length > 0 ? <View style={style.TimeSectionContainer}>
					<Text style={style.TimeSectionHeader}>{strings.nextHour}</Text>
					{renderSection(0, 1, true)}
				</View> : null}

				{findSectionDetails(1, 6).length > 0 ? <View style={style.TimeSectionContainer}>
					<Text style={style.TimeSectionHeader}>{strings.nextSixHours}</Text>
					{renderSection(1, 6)}
				</View> : null}
				{findSectionDetails(6, 24).length > 0 ? <View style={style.TimeSectionContainer}>
					<Text style={style.TimeSectionHeader}>{strings.nextDay}</Text>
					{renderSection(6, 24)}
				</View> : null}
				{findSectionDetails(24, 24*7).length > 0 ? <View style={style.TimeSectionContainer}>
					<Text style={style.TimeSectionHeader}>{strings.nextWeek}</Text>
					{renderSection(24, 24*7)}
				</View> : null}
				{findSectionDetails(24*7, 24*30).length > 0 ? <View style={style.TimeSectionContainer}>
					<Text style={style.TimeSectionHeader}>{strings.nextMonth}</Text>
					{renderSection(24*7, 24*30)}
				</View> : null}
			</ScrollView>
		</View>
	);
};