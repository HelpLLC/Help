import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TopBanner from '../../../components/TopBanner/TopBanner';
import RequestDisplay from '../../../components/RequestDisplay/RequestDisplay';
import HelpButton from '../../../components/HelpButton/HelpButton';
import style from './paymentsScreenStyle';
import {Picker} from '@react-native-community/picker';
import fontStyles from 'config/styles/fontStyles';
import HelpAlert from '../../../components/HelpAlert';
import requestDisplay from '../../../components/RequestDisplay/RequestDisplay';
import ModalSelector from 'react-native-modal-selector';

//exporting the profileScreen class
export default function viewDetailsScreen(props) {
    props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [balance, setBalance] = useState(0);
    const [payoutInterval, setPayoutInterval] = useState('m');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountNumberLast4, setAccountNumberLast4] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [screenState, setScreenState] = useState(-1);
    const [invalidBAN, setInvalidBAN] = useState(false);
    const [selectPI, setSelectPI] = useState(false);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('ViewDetailsScreen', 'viewDetailsScreen');

        const {
			businessID:BID
        } = props.navigation.state.params;

        const balance = await FirebaseFunctions.call('retrieveConnectAccountBalance', {
            businessID: BID
        });

        const account = await FirebaseFunctions.call('retrieveConnectAccountDetails', {
            businessID: BID
        });

        setBusinessID(BID);
        setBalance(balance.available[0].amount + balance.pending[0].amount);
        setAccountNumberLast4(account.last4);
        setRoutingNumber(account.routing_number);
        setScreenState(0);
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
    function getNextPayout(){
        let date = new Date();
        switch(payoutInterval){
            case 'd':
                date.setDate(date.getDate()+1);
            break;
            case 'w':
                date.setDate(date.getDate()+(7 - date.getDay()));
            break;
            case 'm':
                date.setDate(1);
                date.setMonth(date.getMonth()+1);
            break;
            case 'y':
                date.setDate(1);
                date.setMonth(0);
                date.setFullYear(date.getFullYear()+1);
            break;
        }
        return `Next Payout: ${months[date.getMonth()]} ${date.getDate()+''}, ${date.getFullYear()}`;
    }

    function getPayoutInfo(){
        switch(payoutInterval){
            case 'd': return strings.DPayout;
            case 'w': return strings.WPayout;
            case 'm': return strings.MPayout;
            case 'y': return strings.YPayout;
        }

    }
    const payoutData = [
        {key:'d', label:'Daily'},
        {key:'w', label:'Weekly'},
        {key:'m', label:'Monthly'},
        {key:'y', label:'Yearly'},
    ];

    //rendering the screen
    if(screenState == -1) return (
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
    else if(screenState == 0) return (
        <View style={style.Body}>
            <View style={style.HeaderContainer}>
                <Text style={style.AccountNumber}>{'**** **** **** '+accountNumberLast4}</Text>
                <Text style={style.Balance}>{formatCurrency(balance)}</Text>
                <View style={style.RowContainer}>
                    <Text style={style.Content}>{getNextPayout()}</Text>
                    <HelpButton
                        title={strings.Edit}
                        isLightButton={false}
                        width={80}
                        height={30}
                        bigText={true}
                        bold={true}
                        onPress={() => {
                            setScreenState(1);
                        }}
                    />
                </View>
            </View>
            <View style={style.Spacer}/>
            <View>
                <HelpButton
                    title={'View '+strings.PayoutHistory}
                    isLightButton={false}
                    width={200}
                    height={30}
                    bigText={true}
                    bold={true}
                    onPress={() => {
                        props.navigation.push('payoutHistoryScreen', {businessID});
                    }}
                />
            </View>
            <View style={style.Spacer}/>
            <View>
                <HelpButton
                    title={'View '+strings.TransactionHistory}
                    isLightButton={false}
                    width={240}
                    height={30}
                    bigText={true}
                    bold={true}
                    onPress={() => {
                        props.navigation.push('transactionHistoryScreen', {businessID});
                    }}
                />
            </View>
        </View>
    );
    else if(screenState == 1) return (
        <View style={{...style.Body, paddingLeft:25}}>
            <Text style={style.Subject}>{strings.BAN}</Text>
            <TextInput style={style.AccountInput}
                onChangeText={text=>setAccountNumber(text.replace(/[\D]/g, ''))}
                keyboardType='number-pad'
                maxLength={16}>{accountNumber}</TextInput>
            <Text style={style.Subject}>{strings.RN}</Text>
            <TextInput style={style.AccountInput}
                onChangeText={text=>setRoutingNumber(text.replace(/[\D]/g, ''))}
                keyboardType='number-pad'
                maxLength={9}>{routingNumber}</TextInput>
            <Text style={style.Subject}>{strings.PayoutSchedule}</Text>
            <Text style={style.Content}>{getNextPayout()}</Text>
            <View style={{...style.RowContainer, marginVertical:10}}>
                <Text style={{...style.Content, marginRight:40}}>{getPayoutInfo()}</Text>
                <HelpButton
                    title={strings.Change}
                    isLightButton={false}
                    width={80}
                    height={25}
                    bigText={true}
                    bold={true}
                    onPress={() => {
                        setSelectPI(true)
                    }}
                /> 
            </View>
            <View style={{marginTop:5}}>
                <HelpButton
                    title={strings.Done}
                    isLightButton={false}
                    width={80}
                    height={30}
                    bigText={true}
                    bold={true}
                    onPress={() => {
                        async function apply(){
                            if(accountNumber.length == 16){

                                await FirebaseFunctions.call('SetConnectAccountPayoutSchedule', {
                                    businessID: businessID,
                                    interval: payoutInterval,
                                    weekly_anchor: 'monday',
                                    monthly_anchor: 1,
                                });

                                await FirebaseFunctions.call('updateStripeConnectAccountPayment', {
                                    businessID: businessID,
                                    checkingAccount: {
                                        country: 'US',
                                        currency: 'usd',
                                        account_number: accountNumber,
                                        routing_number: routingNumber
                                    }
                                });

                                setAccountNumberLast4(accountNumber.substring(12));
                                
                                setScreenState(0);
                            }
                            else setInvalidBAN(true);
                        }
                        apply();
                    }}
                />
            </View>
            <HelpAlert
                isVisible={invalidBAN}
                title={strings.Error}
                message={strings.InvalidBAN}
                onPress={()=>{setInvalidBAN(false)}}/>
            <ModalSelector
                visible={selectPI}
                data={payoutData}
                onChange={(option)=>{ setPayoutInterval(option.key) }}
                onModalClose={()=>{setSelectPI(false)}}
                disabled={true}
                touchableStyle={{opacity:0}} />
        </View>
    );
}
