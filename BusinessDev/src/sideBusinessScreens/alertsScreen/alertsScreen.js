import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './alertsScreenStyle';
import LoadingSpinner from '../../components/LoadingSpinner';
import fontStyles from 'config/styles/fontStyles';

//exporting the alertsScreen class
export default function alertsScreen(props) {

    //the state of the function
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('AlertsScreen', 'alertsScreen');
        setIsScreenLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);
    
    //rendering the screen
    if(isScreenLoading) return (
        <View style={style.Body}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <LoadingSpinner isVisible={true} />
            </View>
        </View>
    );
    else return (
        <View style={screenStyle.container}>
            <View style={style.NotifSection}>
                <View style={style.NotifSectionTitle}>
                    <Text style={style.NotifTypeText}>{strings.Customers}</Text>
                    <Text style={style.NotifNumText}>{2}</Text>
                </View>
            </View>
            <View style={style.NotifSection}>
                <View style={style.NotifSectionTitle}>
                    <Text style={style.NotifTypeText}>{strings.Employees}</Text>
                    <Text style={style.NotifNumText}>{2}</Text>
                </View>
            </View>
        </View>
    );
}