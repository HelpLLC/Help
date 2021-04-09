import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TopBanner from '../../../components/TopBanner/TopBanner';
import RequestDisplay from '../../../components/RequestDisplay/RequestDisplay';
import HelpButton from '../../../components/HelpButton/HelpButton';
import style from './paymentDetailsScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import {Picker} from '@react-native-community/picker';
import requestDisplay from '../../../components/RequestDisplay/RequestDisplay';

//exporting the profileScreen class
export default function viewMoreScreen(props) {
    props = {navigation:{push:()=>{},state:{params:{requestID:'EKY0Winhxxb85GlXy1WX'}}}}; //NOTE: this line is only for testing

    //the state of the function
    const [requestID, setRequestID] = useState('');
    const [requestData, setRequestData] = useState({});
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('ViewMoreScreen', 'viewMoreScreen');

        const {
			requestID:RID
        } = props.navigation.state.params;
        
        const requestObj = await FirebaseFunctions.call('getRequestByID', {
            requestID:RID
        });

        setRequestID(RID);
        setRequestData(requestObj);
        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);

    //rendering the screen
    if(isScreenLoading) return (
        <View style={style.Body}>
            <View style={style.Header}>
                {/*TODO: add header here*/}
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <LoadingSpinner isVisible={true} />
            </View>
            <View style={style.Footer}>
                {/*TODO: add footer here*/}
            </View>
        </View>
    );
    else return (
        <View style={style.Body}>
            <TopBanner
                title={requestData.serviceTitle}
                size={30}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
            <ScrollView style={style.ScrollView}>
                <RequestDisplay
                    request={requestData}
                    onRefund={()=>{
                        //TODO: this
                    }}/>
            </ScrollView>
        </View>
    );
}
