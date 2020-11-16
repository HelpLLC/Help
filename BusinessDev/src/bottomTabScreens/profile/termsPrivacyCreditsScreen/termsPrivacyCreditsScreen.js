import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import style from './termsPrivacyCreditsScreenStyle';
import fontStyles from 'config/styles/fontStyles';

//exporting the termsPrivacyCredits class
export default function termsPrivacyCreditsScreen(props) {
    // props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

    //a list of the options availible to click
    const options = [strings.About, strings.Credits, strings.PrivacyPolicy, strings.TermsAndConditions];
    const functions = [
        ()=>{props.navigation.push('AboutScreen');}, 
        ()=>{props.navigation.push('CreditsScreen');}, 
        ()=>{props.navigation.push('PrivacyScreen');}, 
        ()=>{props.navigation.push('TermsAndConditionsScreen');}, 
    ];

    //a function for compiling the list of elements in a normalized style
    function renderOptions(){
        let elements = [];
        for(let i in options)
            elements.push(
                <TouchableOpacity onPress={functions[i]} key={options[i]}>
                    <View style={[style.OptionContainer, style.OptionNormal]}>
                        <Text style={[fontStyles.bigTextStyle, style.OptionText]}>{options[i]}</Text>
                        <Icon
                            name={'angle-right'}
                            type='font-awesome'
                            size={40}
                            color={colors.darkBlue}
                        />
                    </View>
                </TouchableOpacity>
            );
        return elements;
    }

    //the state of the function
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('TermsPrivacyCreditsScreen', 'termsPrivacyCreditsScreen');
        
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
        <View style={style.Body}>
            <View style={style.ContentContainer}>
                {renderOptions()}
            </View>
        </View>
    );
}
