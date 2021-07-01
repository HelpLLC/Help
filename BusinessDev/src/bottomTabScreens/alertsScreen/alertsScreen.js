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
import HelpButton from '../../components/HelpButton/HelpButton';

//exporting the profileScreen class
export default function profileScreen(props) {
	// props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

	
	//the state of the function
	const [customerAlerts, setCustomerAlerts] = useState([]);
	const [employeeAlerts, setEmployeeAlerts] = useState([]);
	const [businessID, setBusinessID] = useState('');
	const [isScreenLoading, setIsScreenLoading] = useState(true);

	async function getData() {
		// const { businessID: BID } = props.navigation.state.params;

		// const alerts = await FirebaseFunctions.call('retrieveBusinessAlerts', {
		// 	businessID: BID,
		// });
		// let customerAlerts = [];
		// let employeeAlerts = [];
		// for(let i in alerts){
		// 	if(alerts[i].type == "employee")
		// 		employeeAlerts.push(alerts[i]);
		// 	else
		// 		customerAlerts.push(alerts[i]);
		// }
		// setCustomerAlerts(customerAlerts);
		// setEmployeeAlerts(employeeAlerts);

		setCustomerAlerts([
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			}
		]);
		setEmployeeAlerts([
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			},
			{
				title:"Payment Received",
				body:"John Doe has paid for Photography service on 09/30/21.",
				recieved:new Date().toUTCString(),
			}
		]);
		// setBusinessID(BID);
		setIsScreenLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);

	function getRecievedText(recieved){
		var date = Date.parse(recieved);
		var now = new Date();
		let units = [
			{u:"year", n:365 * 24 * 60 * 60 * 1000},
			{u:"month", n:30 * 24 * 60 * 60 * 1000},
			{u:"week", n:7 * 24 * 60 * 60 * 1000},
			{u:"day", n:24 * 60 * 60 * 1000},
			{u:"hour", n:60 * 60 * 1000},
			{u:"minute", n:60 * 1000},
			{u:"second", n:1000},
			{u:"millisecond", n:1},
		];

		var i = 0;
		for(; i < units.length - 1; i++)
			if((now - date + .0) / units[i].n >= 1)
				break;

		let n = Math.round((now - date + .0) / units[i].n);
		return "Recieved "+n+" "+units[i].u+(n > 1 ? "s" : "")+" ago";
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
				<View style={{...style.Row, justifyContent: 'space-between'}}>
					<Text style={style.RecievedText}>
						{getRecievedText(alerts[i].recieved)}
					</Text>
					{i == 0 ? <HelpButton
						title={strings.AlertRemove}
						isLightButton={false}
						width={70}
						height={30}
						bigText={true}
						bold={true}
						onPress={() => {
							deleteFunction();
						}}
					/> : null}
				</View>
			</View>);

			// if(i == 0) elements.push(
			// 	<Swipeable onSwipeableOpen={deleteFunction()}>{alert}</Swipeable>);
			// else elements.push(alert);

			elements.push(alert);
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
						FirebaseFunctions.call('deleteBusinessAlert', {
							businessID,
							alertID: customerAlerts[i].alertID,
						});

						customerAlerts.splice(i,1);
						setCustomerAlerts(customerAlerts);
					})}
					{renderSection(strings.Employees, employeeAlerts, i=>{
						FirebaseFunctions.call('deleteBusinessAlert', {
							businessID,
							alertID: employeeAlerts[i].alertID,
						});

						employeeAlerts.splice(i,1);
						setEmployeeAlerts(employeeAlerts);
					})}
				</View>
			</View>
		);
}
