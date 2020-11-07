import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import TopBanner from '../../../../../components/TopBanner/TopBanner';
import HelpButton from '../../../../../components/HelpButton/HelpButton';
import style from './serviceRequestHistoryScreenStyle';
import fontStyles from 'config/styles/fontStyles';

//exporting the profileScreen class
export default function profileScreen(props) {
    // props = {navigation:{push:()=>{},state:{params:{serviceID:'S0bj90OvpgzjxQDUStYo'}}}}; //NOTE: this line is only for testing

    //a list of the options availible to click
    const options = [strings.ServiceInfo, strings.Requests, strings.RequestsHistory, strings.UnconfirmedRequests];
    const functions = [
        ()=>{props.navigation.push('serviceInfoScreen', {serviceID});}, 
        ()=>{props.navigation.push('serviceRequestsScreen', {serviceID});}, 
        ()=>{props.navigation.push('serviceRequestHistoryScreen', {serviceID});},  
        ()=>{props.navigation.push('serviceUnconfirmedRequestsScreen', {serviceID});}, 
    ];

    //a function for compiling the list of elements in a normalized style
    function renderTabs(){
        let elements = [];

        for(let i in options)
            elements.push(
                <TouchableWithoutFeedback onPress={()=>{if(i != currentTab) functions[i]();}} key={i}>
                    <View style={[
                        style.TabContainer,
                        i==currentTab?style.SelectedTab:style.UnselectedTab,
                        {width:screenWidth/options.length}]}>
                        <Text style={[
                            style.TabText,
                            i==currentTab?style.SelectedTabText:style.UnselectedTabText]}>
                            {options[i]}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );

        return elements;
    }

    //the state of the function
    const currentTab = 2;
    const [serviceID, setServiceID] = useState('');
    const [serviceInfo, setServiceInfo] = useState({});
    const [upcomingRequests, setUpcomingRequests] = useState({});
    const [requestHistory, setRequestHistory] = useState({});
    const [unconfirmedRequests, setUnconfirmedRequests] = useState({});
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
        const {
			serviceID:SID
        } = props.navigation.state.params;
        setServiceID(SID);
        
        const serviceInfoObj = await FirebaseFunctions.call('getServiceByID', {
			serviceID:SID
        });
        setServiceInfo(serviceInfoObj);
        
        // const upcomingRequestsObj = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
		// 	serviceID:SID
        // });
        // setUpcomingRequests(upcomingRequestsObj);
        
        const requestHistoryObj = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
			serviceID:SID
        });
        setRequestHistory(requestHistoryObj);
        
        // const unconfirmedRequestsObj = await FirebaseFunctions.call('getUnconfirmedRequestsByServiceID', {
		// 	serviceID:SID
        // });
        // setUnconfirmedRequests(unconfirmedRequestsObj);

        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function formatDate (date){
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function formatTime (startTime, endTime){
        return `${startTime.toLowerCase().replace(/\s/g, '')} - ${endTime.toLowerCase().replace(/\s/g, '')}`;
    }
    
    function renderItem(item){
        return (
            <View style={style.ItemContainer}>
                <View style={{...style.ColumnContainer, flex:3}}>
                    <Text style={style.RequestTitle}>{serviceInfo.serviceTitle}</Text>
                    <Text style={style.RequestText}>{formatDate(new Date(item.date))}</Text>
                    <Text style={style.RequestText}>{formatTime(item.time, item.endTime)}</Text>
                </View>
                <View style={{...style.ColumnContainer, flex:2}}>
                    <HelpButton
                        title={strings.ViewMore}
                        isLightButton={false}
                        width={110}
                        height={30}
                        bigText={true}
                        bold={true}
                        onPress={() => {
                            //TODO: this
                        }}
                    />
                </View>
            </View>
        );
    }

    //rendering the screen
    if(isScreenLoading) return (
        <View style={style.Body}>
            <TopBanner
                title={strings.Loading}
                leftIconName='angle-left'
                leftOnPress={() => props.navigation.goBack()}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <LoadingSpinner isVisible={true} />
            </View>
        </View>
    );
    else return (
        <View style={style.Body}>
            <TopBanner
				title={serviceInfo.serviceTitle}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
            <View style={style.MainTabContainer}>
                {renderTabs()}
            </View>
            <FlatList data={requestHistory}
                renderItem={({item}) => renderItem(item)}
                style={style.ListContainer}
            />
        </View>
    );
}
