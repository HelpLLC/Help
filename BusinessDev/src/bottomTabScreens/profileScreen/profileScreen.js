import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './profileScreenStyle';
import fontStyles from 'config/styles/fontStyles';

//a list of the options availible to click
const options = [strings.ProfileCompanyInfo, strings.ProfileBusinessSchedule, strings.ProfilePassword, strings.ProfileLogout];

//a function for compiling the list of elements in a normalized style
function renderOptions(){
    let elements = [];
    for(let i in options)
        elements.push(
            <View style={[style.OptionContainer, options[i]==strings.ProfileLogout?style.LogoutContainer:{}]} key={options[i]}>
                <Text style={[fontStyles.bigSubTitleStyle, style.OptionText, options[i]==strings.ProfileLogout?style.LogoutText:{}]}>{options[i]}</Text>
                <Icon
					name={'angle-right'}
					type='font-awesome'
					size={60}
                    color={options[i]==strings.ProfileLogout?colors.white:colors.darkBlue}
				/>
            </View>
        );
    return elements;
}

//exporting the profileScreen class
export default function profileScreen(props) {
    
    //rendering the screen
    return (
        <View style={style.Body}>
            <View style={style.Header}>
                {/*TODO: add header here*/}
            </View>
            <View style={style.ContentContainer}>
                <View style={style.MainContainer}>
                    <Image source={require('./profilePicture.png')} style={{width:100,height:100, margin:10}}/>
                    <Text style={[fontStyles.bigSubTitleStyle, style.MainText]}>{strings.ProfileDefaultBusinessName}</Text>
                </View>
                {renderOptions()}
            </View>
            <View style={style.Footer}>
                {/*TODO: add footer here*/}
            </View>
        </View>
    );
}
