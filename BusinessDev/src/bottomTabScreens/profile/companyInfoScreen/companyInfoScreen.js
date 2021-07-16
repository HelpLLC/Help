import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmFooter from '../../../components/ConfirmFooter/ConfirmFooter';
import HelpAlert from '../../../components/HelpAlert';
import TopBanner from '../../../components/TopBanner/TopBanner';
import style from './companyInfoScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import { TextInput, ScrollView } from 'react-native-gesture-handler';

//exporting the profileScreen class
export default function companyInfoScreen(props) {
    //a function for compiling the list of elements in a normalized style
    function addSection(iconType, iconName, title, content, onChangeText, border = true){
        return (
            <View style={[style.MainSectionContainer, border ? style.MainBorder : {}]} key={title}>
                <View style={style.SectionIcon}>
                    <Icon name={iconName}
                        type={iconType}
                        size={style.SectionIcon.width}
                        color={colors.darkBlue}/>
                </View>
                <View style={style.SectionTextContainer}>
                    <Text style={style.SectionTitleText}>{title}</Text>
                    {title != strings.BusinessDescription ? 
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={style.SectionContentScroll}>
                        <TextInput style={style.SectionContentText} 
                            onChangeText={value=>onChangeText(value)}
                            >{content}</TextInput>
                    </ScrollView> : 
                    <TextInput style={[style.SectionContentText, style.SectionContentScroll]} 
                        onChangeText={value=>onChangeText(value)}
                        multiline={true}
                        scrollEnabled={true}>{content}</TextInput>}
                </View>
            </View>
        );
    }

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [businessData, setBusinessData] = useState({});

    //the fields that can be input to
    const [businessName, setBusinessName] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [businessWebsite, setBusinessWebsite] = useState('');
    const [businessPhoneNumber, setBusinessPhoneNumber] = useState('');
    const [businessLocation, setBusinessLocation] = useState('');
    const [businessDescription, setBusinessDescription] = useState('');

    async function getData(){
        FirebaseFunctions.setCurrentScreen('CompanyInfoScreen', 'companyInfoScreen');
        const {
            businessID:BID
        } = props.navigation.state.params;
        
        // const BID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2'; //NOTE: this is just for testing purposes
        const businessObj = await FirebaseFunctions.call('getBusinessByID', {
            businessID:BID
        });

        setBusinessID(BID);
        setBusinessData(businessObj);

        setBusinessName(businessObj.businessName);
        setBusinessEmail(businessObj.email);
        setBusinessWebsite(businessObj.website);
        setBusinessPhoneNumber(businessObj.phoneNumber);
        setBusinessLocation(businessObj.location);
        setBusinessDescription(businessObj.businessDescription);
    }
    useEffect(() => {
        getData();
	}, []);

    //rendering the screen
    return (
        <View style={style.Body}>
            <View style={style.ContentContainer}>
                <ScrollView style={style.ScrollContainer}>
                    <View style={style.ScrollContent}>
                        {addSection('material-community', 'account-circle', strings.BusinessName, businessData.businessName, v=>setBusinessName(v))}
                        {addSection('entypo', 'mail', strings.Email, businessData.email, v=>setBusinessEmail(v))}
                        {addSection('material-community', 'web', strings.BusinessWebsite, businessData.website, v=>setBusinessWebsite(v))}
                        {addSection('font-awesome', 'mobile', strings.BusinessPhoneNumber, businessData.phoneNumber, v=>setBusinessPhoneNumber(v))}
                        {addSection('entypo', 'location', strings.BusinessLocation, businessData.location, v=>setBusinessLocation(v))}
                        {addSection('material', 'comment', strings.BusinessDescription, businessData.businessDescription, v=>setBusinessDescription(v), false)}
                    </View>
                </ScrollView>
                <ConfirmFooter
                    text={strings.SaveChanges}
                    confirmText={strings.ChangesSaved}
                    absolute={false}
                    confirmFunction={()=>{
                        FirebaseFunctions.call('updateBusinessInformation', {
                            businessID,
                            updates:{
                                businessName,
                                email:businessEmail,
                                website:businessWebsite,
                                phoneNumber:businessPhoneNumber,
                                location:businessLocation,
                                businessDescription
                            }
                        });
                        return true;
                    }}/>
            </View>
        </View>
    );
}
