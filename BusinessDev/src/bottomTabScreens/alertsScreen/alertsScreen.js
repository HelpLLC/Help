import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';
import style from './alertsScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../../components/TopBanner/TopBanner';
import Swipeable from 'react-native-gesture-handler/Swipeable';

//exporting the profileScreen class
export default function profileScreen(props) {
	// props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

	
	//the state of the function
	const [customerAlerts, setCustomerAlerts] = useState([]);
	const [employeeAlerts, setEmployeeAlerts] = useState([]);
	const [isScreenLoading, setIsScreenLoading] = useState(true);

	async function getData() {
		//Declares the screen name in Firebase
		// FirebaseFunctions.setCurrentScreen('ProfileScreen', 'profileScreen');
		// const { businessID: BID } = props.navigation.state.params;

		// const businessObj = await FirebaseFunctions.call('getBusinessByID', {
		// 	businessID: BID,
		// });

		// const profilePic = await FirebaseFunctions.call('getBusinessProfilePictureByID', {
		// 	businessID: BID,
		// });


		//TODO: connect this to backend
		setCustomerAlerts([
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"just now",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"5hrs ago",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"yesterday",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"tuesday",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"tuesday",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"tuesday",
			}
		]);
		setEmployeeAlerts([
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"just now",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"5hrs ago",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"yesterday",
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:"tuesday",
			}
		]);
		setIsScreenLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);

	function getRecievedText(recieved){
		var date = Date.parse(recieved);
		//TODO: this
		return "Recieved "+recieved;
	}

	function renderSection(title, alerts, deleteFunction){
		let elements = [];
		for(let i = 0; i < alerts.length; i++){
			if(i == 3){
				elements.push(
					<View style={{...style.AlertContainer, marginTop: (i==0 ? 0 : -80), zIndex: 5-i, elevation: 5-i}}>
						<Text style={style.AlertHeading}>
							{""}
						</Text>
						<Text style={style.AlertBody}>
							{""}
						</Text>
						<Text style={style.ContinuedText}>
							{"..."}
						</Text>
					</View>
				);
				break;
			}
			let alert = (<View style={{...style.AlertContainer, marginTop: (i==0 ? 0 : -80), zIndex: 5-i, elevation: 5-i}}>
				<Text style={style.AlertHeading}>
					{alerts[i].title}
				</Text>
				<Text style={style.AlertBody}>
					{alerts[i].body}
				</Text>
				<Text style={style.RecievedText}>
					{getRecievedText(alerts[i].recieved)}
				</Text>
			</View>);

			// if(i == 0) elements.push(
			// 	<Swipeable onSwipeableOpen={deleteFunction()}>{alert}</Swipeable>);
			// else elements.push(alert);

			elements.push(alert);
			//TODO: add some way to call the delete function (swiping, delete button, etc)
		}

		return(
			<View style={style.SectionContainer}>
				<View style={{...style.Row, marginBottom: 5,}}>
					<Text style={style.SectionHeading}>{title}</Text>
					<View style={{borderRadius:50, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{...fontStyles.bigTextStyle, fontWeight:'bold', color:colors.white, width:28, height:28, textAlign: 'center'}}>{alerts.length}</Text>
					</View>
				</View>
				<View>
					{elements}
				</View>
			</View>
		);
	}

	//rendering the screen
	if (isScreenLoading)
		return (
			<View style={style.Body}>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
					<LoadingSpinner isVisible={true} />
				</View>
			</View>
		);
	else
		return (
			<View style={style.Body}>
				<TopBanner
					title={strings.Alerts}
					leftIconName='angle-left'
					size={30}
					leftOnPress={() => navigation.goBack()}
				/>
				<View style={style.Content}>
					{renderSection(strings.Customers, customerAlerts, i=>{
						customerAlerts.splice(i,1);
						setCustomerAlerts(customerAlerts);
						//TODO: connect this to backend
					})}
					{renderSection(strings.Employees, employeeAlerts, i=>{
						employeeAlerts.splice(i,1);
						setCustomerAlerts(employeeAlerts);
						//TODO: connect this to backend
					})}
				</View>
			</View>
		);
}
