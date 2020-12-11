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
import style from './payoutHistoryScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import {Picker} from '@react-native-community/picker';
import requestDisplay from '../../../components/RequestDisplay/RequestDisplay';

//exporting the profileScreen class
export default function viewDetailsScreen(props) {
    props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [balance, setBalance] = useState({});
    const [payouts, setPayouts] = useState([]);
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('ViewDetailsScreen', 'viewDetailsScreen');

        const {
			businessID:BID
        } = props.navigation.state.params;

        const balance = await FirebaseFunctions.call('retrieveConnectAccountBalance', {
            businessID: BID
        });

        const transfers = await FirebaseFunctions.call('retrieveConnectAccountPayoutHistory', {
            businessID: BID
        });

        setBusinessID(BID);
        setBalance(balance);
        setPayouts(transfers);
        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);

    function formatCurrency(number, explicit = false){
        let sign = number < 0 ? '-' : '+';
        let arr = (number+'').split('.');
        let num = arr[0];
        let dec = arr.length == 2 ? arr[1] : '';

        if(dec != ''){
            dec += dec.length == 1 ? '0' : '';
            dec = '.' + dec;
        }
        else dec = '.00';

        let initial = num.length;
        for(let i = num.length - 1; i >= 0; i--)
            if((initial - i) % 3 == 0 && i != 0)
                num = num.substring(0, i) + ',' + num.substring(i);

        if(sign == '+' && !explicit) sign = '';
        return sign + '$' + num + dec;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function formatDate (d){
        let date = new Date(d);
        return `${months[date.getMonth()]} ${date.getDate()+''}, ${date.getFullYear()+''}`;
    }

    function renderItem(item){
        return (
            <View style={style.ItemContainer} key={item.arrival_date}>
                <Text style={style.ItemDate}>{formatDate(item.created)}</Text>
                <Text style={style.ItemTranfer}>{formatCurrency(item.amount, true)}</Text>
            </View>
        );
    }

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
                title={strings.PayoutHistory}
                size={30}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>

            <FlatList data={payouts.data}
                renderItem={({item}) => renderItem(item)}
                style={style.ListContainer}
            />
        </View>
    );
}
