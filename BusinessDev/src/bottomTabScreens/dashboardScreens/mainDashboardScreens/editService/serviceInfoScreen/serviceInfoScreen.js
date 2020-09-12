import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import TopBanner from '../../../../../components/TopBanner/TopBanner';
import HelpButton from '../../../../../components/HelpButton/HelpButton';
import { Rating } from 'react-native-ratings';
import style from './serviceInfoScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import { TouchableHighlight } from 'react-native-gesture-handler';

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
    const currentTab = 0;
    const [serviceID, setServiceID] = useState('');
    const [serviceInfo, setServiceInfo] = useState({});
    const [businessInfo, setBusinessInfo] = useState({});
    const [serviceIconUri, setServiceIconUri] = useState('');
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
        
        const businessInfoObj = await FirebaseFunctions.call('getBusinessByID', {
			businessID:serviceInfoObj.businessID
        });
        setBusinessInfo(businessInfoObj);
        
        // const upcomingRequestsObj = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
		// 	serviceID:SID
        // });
        // setUpcomingRequests(upcomingRequestsObj);
        
        // const requestHistoryObj = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
		// 	serviceID:SID
        // });
        // setRequestHistory(requestHistoryObj);
        
        // const unconfirmedRequestsObj = await FirebaseFunctions.call('getUnconfirmedRequestsByServiceID', {
		// 	serviceID:SID
        // });
        // setUnconfirmedRequests(unconfirmedRequestsObj);
        
        const serviceUri = await FirebaseFunctions.call('getServiceImageByID', {
			serviceID:SID
        });
        setServiceIconUri(serviceUri);

        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);

    function formatDate (date){
        return `${weekdays[date.getDay()].substring(0,3).toUpperCase()}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function formatTime (startTime, endTime){
        return `${startTime.toLowerCase().replace(/\s/g, '')} - ${endTime.toLowerCase().replace(/\s/g, '')}`;
    }

    function formatDuration(float){
        return `${Math.floor(float)} hrs ${Math.round(60 * (float % 1))} mins`;
    }

    function stringifyPayment(){
        let cash = 'Cash';
        let card = 'Credit/Debit Card';
        if(serviceInfo.cash && serviceInfo.card) return cash + ' OR ' + card;
        else if(serviceInfo.cash) return cash;
        else if(serviceInfo.card) return card;
        else throw Error('No valid payment type');
    }

    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    function renderBusinessHours(){
        let days = [];
        let from = [];
        let dash = [];
        let to = [];
        for(let i in weekdays){
            if(businessInfo.businessHours[weekdays[i]] != undefined){
                days.push(<Text style={style.ServiceText}>{weekdays[i].substring(0,1).toUpperCase()+weekdays[i].substring(1)+'s \t'}</Text>);
                let times = formatTime(businessInfo.businessHours[weekdays[i]].from, businessInfo.businessHours[weekdays[i]].to).split(' - ');
                from.push(<Text style={style.ServiceText}>{times[0]}</Text>);
                dash.push(<Text style={style.ServiceText}>{'-'}</Text>);
                to.push(<Text style={style.ServiceText}>{times[1]}</Text>);
            }
        }
        return (
            <View style={style.RowContainer}>
                <View style={style.ColumnContainer}>{days}</View>
                <View style={style.RowContainer}>
                    <View style={{...style.ColumnContainer, alignItems:'center'}}>{from}</View>
                    <View style={{...style.ColumnContainer, alignItems:'center'}}>{dash}</View>
                    <View style={{...style.ColumnContainer, alignItems:'center'}}>{to}</View>
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
            <ScrollView style={style.ScrollView}>
                <View style={{...style.RowContainer, marginTop:20}}>
                    <View style={style.ColumnContainer}>
                        <View style={style.IconContainer}>
                            <Image source={serviceIconUri} style={style.ServiceIcon}/>
                        </View>
                        <TouchableOpacity onPress={()=>{
                            //TODO: this
                        }}>
                            <Text style={style.EditIcon}>{strings.EditServiceImage}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{...style.ColumnContainer, marginLeft:15, justifyContent:'center', paddingBottom:40, width:160,}}>
                        <Text style={style.EditIcon}>{`${137} requests in the past month`}</Text>
                        <Text style={style.Ratings}>{strings.Ratings}</Text>
                        <Rating
                            readonly={true}
                            startingValue={serviceInfo.averageRating}
                            showRating={false}
                            imageSize={20}
                            style={style.RatingObject}
                        />
                    </View>
                </View>
                <Text style={style.ServiceSubject}>{strings.Description}</Text>
                <Text style={style.ServiceText}>{serviceInfo.serviceDescription}</Text>
                <Text style={style.ServiceSubject}>{strings.DaysOffered}</Text>
                {renderBusinessHours()}
                <Text style={style.ServiceSubject}>{strings.ServiceDuration}</Text>
                <Text style={style.ServiceText}>{formatDuration(serviceInfo.serviceDuration)}</Text>
                <Text style={style.ServiceSubject}>{strings.PricingAndPayment}</Text>
                <Text style={style.ServiceText}>{stringifyPayment()}</Text>
                <Text style={{...style.ServiceText, marginBottom:20}}>{serviceInfo.priceText}</Text>
                <HelpButton
                    title={strings.EditService}
                    isLightButton={false}
                    width={style.EditServiceButton.width}
                    height={style.EditServiceButton.height}
                    biggerText={true}
                    bold={true}
                    onPress={() => {
                        //TODO: this
                    }}
                />
                <View style={{marginTop:20}}/>
            </ScrollView>
        </View>
    );
}
