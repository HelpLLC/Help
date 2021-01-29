import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import TopBanner from '../../../../../components/TopBanner/TopBanner';
import HelpButton from '../../../../../components/HelpButton/HelpButton';
import style from './serviceUnconfirmedRequestsScreenStyle';
import fontStyles from 'config/styles/fontStyles';

//exporting the profileScreen class
export default function profileScreen(props) {
	// props = {navigation:{push:()=>{},state:{params:{serviceID:'S0bj90OvpgzjxQDUStYo'}}}}; //NOTE: this line is only for testing

	//the state of the function
	const [serviceID, setServiceID] = useState('');
	const [serviceInfo, setServiceInfo] = useState({});
	const [serviceIconUri, setServiceIconUri] = useState('');
	const [upcomingRequests, setUpcomingRequests] = useState({});
	const [requestHistory, setRequestHistory] = useState({});
	const [unconfirmedRequests, setUnconfirmedRequests] = useState({});
	const [isScreenLoading, setIsScreenLoading] = useState(true);

	async function getData() {
		const { serviceID: SID } = props.navigation.state.params;
		setServiceID(SID);

		const serviceInfoObj = await FirebaseFunctions.call('getServiceByID', {
			serviceID: SID,
		});
		setServiceInfo(serviceInfoObj);

		// const upcomingRequestsObj = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
		// 	serviceID:SID
		// });
		// setUpcomingRequests(upcomingRequestsObj);

		const requestHistoryObj = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
			serviceID: SID,
		});
		setRequestHistory(requestHistoryObj);

		// const unconfirmedRequestsObj = await FirebaseFunctions.call('getUnconfirmedRequestsByServiceID', {
		// 	serviceID:SID
		// });
		// setUnconfirmedRequests(unconfirmedRequestsObj);

		const serviceUri = await FirebaseFunctions.call('getServiceImageByID', {
			serviceID: SID,
		});
		setServiceIconUri(serviceUri);

		setIsScreenLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);

	const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'Sat'];
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	function formatDate(date) {
		return `${days[date.getDay()]}, ${
			months[date.getMonth()]
		} ${date.getDate()}, ${date.getFullYear()}`;
	}

	function formatTime(startTime, endTime) {
		return `${startTime.toLowerCase().replace(/\s/g, '')} - ${endTime
			.toLowerCase()
			.replace(/\s/g, '')}`;
	}

	function renderItem(item) {
		return (
			<View style={style.ItemContainer}>
				<Text style={style.RequestTitle}>{serviceInfo.serviceTitle}</Text>
				<View style={style.RowContainer}>
					<View style={{ ...style.ColumnContainer, ...style.IconContainer, flex: 2 }}>
						<Image source={serviceIconUri} style={style.RequestIcon} />
					</View>
					<View style={{ ...style.ColumnContainer, flex: 3 }}>
						<Text style={style.RequestText}>{formatDate(new Date(item.date))}</Text>
						<Text style={{ ...style.RequestText, marginBottom: 15 }}>
							{formatTime(item.time, item.endTime)}
						</Text>
						<HelpButton
							title={strings.ConfirmRequest}
							isLightButton={false}
							width={175}
							height={30}
							bigText={true}
							bold={true}
							onPress={() => {
								//TODO: this
							}}
						/>
					</View>
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
				<FlatList
					data={requestHistory}
					renderItem={({ item }) => renderItem(item)}
					style={style.ListContainer}
				/>
			</View>
		);
}
