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
import style from './viewDetailsScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import {Picker} from '@react-native-community/picker';
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

        const {
			businessID:BID
        } = props.navigation.state.params;

        let funds = {
            current:150000,
            pending:150,
        };

        let transfers = [
            {
                amount:80,
                total:530.2,
                service:'Photography',
                customer:'John Doe',
                date:'Sep 2, 2020'
            },
            {
                amount:150.2,
                total:450.2,
                service:'Cleaning',
                customer:'Patricia Cebotari',
                date:'Aug 1, 2020'
            },
            {
                amount:200,
                total:300,
                service:'Cleaning',
                customer:'Patricia Cebotari',
                date:'Jul 18, 2020'
            },
            {
                amount:50,
                total:100,
                service:'Photography',
                customer:'John Doe',
                date:'Jun 20, 2020'
            },
            {
                amount:50,
                total:50,
                service:'Cleaning',
                customer:'John Doe',
                date:'Mar 5, 2020'
            },
        ];

        setBusinessID(BID);
        setBalance(funds);
        setTransactions(transfers);
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
                <Text style={style.ItemDate}>{item.date}</Text>
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
                title={strings.AccountBalance}
                size={30}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>

            <View style={style.HeaderContainer}>
                <View style={style.RowContainer}>
                    <View style={style.RowObject}>
                        <Text style={style.HeaderSubject}>{strings.PendingFunds}</Text>
                    </View>
                    <View style={style.RowObject}>
                        <Text style={style.HeaderField}>{formatCurrency(balance.pending, true)}</Text>
                    </View>
                </View>
                <View style={style.RowContainer}>
                    <View style={style.RowObject}>
                        <Text style={style.HeaderSubject}>{strings.CurrentFunds}</Text>
                    </View>
                    <View style={style.RowObject}>
                        <Text style={style.HeaderField}>{formatCurrency(balance.current)}</Text>
                    </View>
                </View>
                <View style={style.RowContainer}>
                    <View style={style.RowObject}>
                        <Text style={style.MainHeaderSubject}>{strings.TotalBalance2}</Text>
                    </View>
                    <View style={style.RowObject}>
                        <Text style={style.HeaderField}>{formatCurrency(balance.pending + balance.current)}</Text>
                    </View>
                </View>
            </View>

            <Text style={style.RecentTransactions}>{strings.RecentTransactions}</Text>

            <FlatList data={transactions}
                renderItem={({item}) => renderItem(item)}
                style={style.ListContainer}
            />
        </View>
    );
}