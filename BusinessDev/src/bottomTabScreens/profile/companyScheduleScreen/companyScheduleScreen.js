import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmFooter from '../../../components/ConfirmFooter/ConfirmFooter';
import HelpAlert from '../../../components/HelpAlert';
import TopBanner from '../../../components/TopBanner/TopBanner';
import style from './companyScheduleScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import { TextInput, ScrollView } from 'react-native-gesture-handler';

//exporting the profileScreen class
export default function profileScreen(props) {
    if(!props) props = {}
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // a function for compiling the list of elements in a normalized style
    function renderTimes(){
        if(loading) return null;
        let elements = [];
        for(let i in weekdays)
            elements.push(
                <View style={style.RowContainer} key={weekdays[i]}>
                    <Text style={{...style.DisplayText, flex:1}}>{weekdays[i]}</Text>
                    <TouchableOpacity onPress={()=>{setPickerDay(weekdays[i].toLowerCase()); setPickerTo(false); setPickerActive(true);}}>
                        <Text style={style.InputText}>
                            {businessData.businessHours[weekdays[i].toLowerCase()].from}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{...style.DisplayText, marginHorizontal:10,}}>{strings.To}</Text>
                    <TouchableOpacity onPress={()=>{setPickerDay(weekdays[i].toLowerCase()); setPickerTo(true); setPickerActive(true);}}>
                        <Text style={style.InputText}>
                            {businessData.businessHours[weekdays[i].toLowerCase()].to}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        return elements;
    }

    function changeTime(day, to, value){
        let obj = businessData;
        if(to) obj.businessHours[day].to = value;
        else obj.businessHours[day].from = value;
        setBusinessData(obj);
    }

    //this local function will convert a time object to a format that can be understood by us
	function convertTime(time) {
		let hours = time.getHours();
		let minutes = time.getMinutes();
		let AMPM = '';

		if (minutes < 10) {
			minutes = '0' + minutes;
		}

		if (hours < 12) {
			AMPM = ' AM';
		} else {
			AMPM = ' PM';
		}

		if (hours === 0) {
			hours = 12;
		} else if(hours > 12) {
			hours -= 12;
		}

		return hours.toString() + ':' + minutes.toString() + AMPM;
	}

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [businessData, setBusinessData] = useState({});
    const [pickerDay, setPickerDay] = useState('');
    const [pickerTo, setPickerTo] = useState(false);
    const [pickerActive, setPickerActive] = useState(false);
    const [loading, setLoading] = useState(true);

    async function getData(){
        FirebaseFunctions.setCurrentScreen('CompanyInfoScreen', 'companyInfoScreen');
        const {
            businessID:BID,
            businessData:businessObj
        } = props.navigation.state.params;
        
        // const BID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2'; //NOTE: this is just for testing purposes
        // const businessObj = await FirebaseFunctions.call('getBusinessByID', {
        //     businessID:BID
        // });

        setBusinessID(BID);
        setBusinessData(businessObj);
        setLoading(false);
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
                        <View style={style.TitleContainer}>
                            <Icon name={'clock'}
                                type={'material-community'}
                                size={40}
                                color={colors.darkBlue}/>
                            <Text style={style.TitleText}>{strings.ProfileBusinessSchedule}</Text>
                        </View>
                        {renderTimes()}
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
                                businessHours:businessData.businessHours
                            }
                        });
                        return true;
                    }}/>
            </View>
                <DateTimePickerModal
                    is24Hour={false}
                    isVisible={pickerActive}
                    mode='time'
                    onConfirm={(time) => {
                        //Sets the selected date, and makes the picker go away
                        changeTime(pickerDay, pickerTo, convertTime(time));
                        setPickerActive(false);
                    }}
                    onCancel={() => {
                        //Makes the picker go away
                        setPickerActive(false);
                    }}
                />
        </View>
    );
}
