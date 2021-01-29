import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import HelpButton from '../../../components/HelpButton/HelpButton';
import style from './paymentsScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import {Picker} from '@react-native-community/picker';

//exporting the profileScreen class
export default function paymentsScreen(props) {
    props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [paymentData, setPaymentData] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('PaymentsScreen', 'paymentsScreen');
        const {
			businessID:BID
        } = props.navigation.state.params;
        
        // const businessObj = await FirebaseFunctions.call('getBusinessByID', {
        //     businessID:BID
        // });

        let data = [{ //NOTE: these variable initalizations are for testing purposes only
            amount:35,
            customer:'John Doe',
            date:'08/06/20',
            refund:false,
            requestID:''
        }, {
            amount:73,
            customer:'James Olson',
            date:'08/05/20',
            refund:true,
            requestID:''
        }, {
            amount:41,
            customer:'Henry Cavil',
            date:'08/02/20',
            refund:false,
            requestID:''
        }, {
            amount:80,
            customer:'Kevin Conroy',
            date:'07/25/20',
            refund:true,
            requestID:''
        }, {
            amount:20,
            customer:'Ezio Auditore Da Firenze',
            date:'07/19/20',
            refund:false,
            requestID:''
        }];
        let bal = 145789.45;

        setBusinessID(BID);
        setPaymentData(data);
        setBalance(bal);
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

    function renderItem(item){
        return (
            <View style={style.ItemContainer}>
                <View style={style.RowContainer}>
                    <HelpButton
                        title={strings.ViewMore}
                        isLightButton={false}
                        width={110}
                        height={30}
                        bigText={true}
                        bold={true}
                        onPress={() => {
                            props.navigation.push('viewMoreScreen', {requestID:item.requestID});
                        }}
                    />
                    <Text style={[style.ItemMarker, item.refund ? style.RefundMarker : style.SucceededMarker]}>{item.refund ? strings.RefundRequest : strings.Succeeded}</Text>
                </View>
                <View style={style.RowContainer}>
                    <View style={style.ColumnContainer}>
                        <Text style={style.ItemSubject}>{strings.Amount}</Text>
                        <Text style={style.ItemField}>{formatCurrency(item.amount)}</Text>
                    </View>
                    <View style={{...style.ColumnContainer, flexShrink:1}}>
                        <Text style={style.ItemSubject}>{strings.Customer}</Text>
                        <Text style={style.ItemField}>{item.customer}</Text>
                    </View>
                    <View style={style.ColumnContainer}>
                        <Text style={style.ItemSubject}>{strings.Date}</Text>
                        <Text style={style.ItemField}>{item.date}</Text>
                    </View>
                </View>
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
            <View style={style.Header}>
                {/*TODO: add header here*/}
            </View>
            <View style={style.ContentContainer}>
                <View style={style.HeaderContainer}>
                    <Text style={style.HeaderText}>{strings.TotalBalance}</Text>
                    <View style={style.HeaderDetailsContainer}>
                        <Text style={style.HeaderBalance}>{formatCurrency(balance)}</Text>
                        <TouchableOpacity onPress={()=>{
                            props.navigation.push('viewDetailsScreen', {businessID});
                        }}>
                            <Text style={style.HeaderViewDetails}>{strings.ViewDetails}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.DropdownContainer}>
                    <Picker
                        selectedValue={strings.All}
                        style={style.Dropdown}
                        onValueChange={(itemValue, itemIndex) =>{
                            //TODO: this
                        }}
                        mode='dropdown'>
                        <Picker.Item label={'Show '+strings.All} value={strings.All} />
                    </Picker>
                </View>
                <FlatList data={paymentData}
                    renderItem={({item}) => renderItem(item)}
                    style={style.ListContainer}
                />
            </View>
            <View style={style.Footer}>
                {/*TODO: add footer here*/}
            </View>
        </View>
    );
}
