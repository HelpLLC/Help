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
import style from './transactionHistoryScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import requestDisplay from '../../../components/RequestDisplay/RequestDisplay';

//exporting the profileScreen class
export default function viewDetailsScreen(props) {
    props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [balance, setBalance] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('ViewDetailsScreen', 'viewDetailsScreen');

        //TODO: add backend requests for this data

        const {
			businessID:BID
        } = props.navigation.state.params;

        const balance = await FirebaseFunctions.call('retrieveConnectAccountBalance', {
            businessID: BID
        });

        let funds = {
            current:balance.available[0].amount,
            pending:balance.pending[0].amount,
        };

        const transactions = await FirebaseFunctions.call('retrieveConnectAccountTransactionHistory', {
            businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
        });

        // //test data
        // let transfers = [
        //     {
        //         amount:80,
        //         total:530.2,
        //         service:'Photography',
        //         customer:'John Doe',
        //         date:'Sep 2, 2020'
        //     },
        //     {
        //         amount:150.2,
        //         total:450.2,
        //         service:'Cleaning',
        //         customer:'Patricia Cebotari',
        //         date:'Aug 1, 2020'
        //     },
        //     {
        //         amount:200,
        //         total:300,
        //         service:'Cleaning',
        //         customer:'Patricia Cebotari',
        //         date:'Jul 18, 2020'
        //     },
        //     {
        //         amount:50,
        //         total:100,
        //         service:'Photography',
        //         customer:'John Doe',
        //         date:'Jun 20, 2020'
        //     },
        //     {
        //         amount:50,
        //         total:50,
        //         service:'Cleaning',
        //         customer:'John Doe',
        //         date:'Mar 5, 2020'
        //     },
        // ];

        setBusinessID(BID);
        setBalance(funds);
        setTransactions(transactions);
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
    function formatDate(date){
        date = new Date(date/1000);
        return `${months[date.getMonth()]} ${date.getDate()+''}, ${date.getFullYear()}`;
    }

    function renderItem(item){
        if(item.service == undefined) return null;
        return (
            <View style={style.ItemContainer}>
                <Text style={style.ItemDate}>{formatDate(item.date)}</Text>
                <View style={style.RowContainer}>
                    <View style={style.SubjectRowObject}>
                        <Text style={style.ItemSubjectText}>{item.service + ' Service for ' + item.customer}</Text>
                    </View>
                    <View style={style.AmountRowObject}>
                        <Text style={style.ItemTransaction}>{formatCurrency(item.amount, true)}</Text>
                        <Text style={style.ItemBalance}>{formatCurrency(item.total, false)}</Text>
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
            <TopBanner
                title={strings.TransactionHistory}
                size={30}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>

            <FlatList data={transactions}
                renderItem={({item}) => renderItem(item)}
                style={style.ListContainer}
            />
        </View>
    );
}
