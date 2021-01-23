import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpButton from '../../components/HelpButton/HelpButton';
import ToggleSwitch from 'toggle-switch-react-native'
import style from './requestTimeOffScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import { TextInput } from 'react-native-gesture-handler';

//exporting the profileScreen class
export default function requestTimeOffScreen(props) {

    //the state of the function
    const [businessID, setBusinessID] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [allDay, setAllDay] = useState(true);
    const [comments, setComments] = useState('');
    const [pickerState, setPickerState] = useState(0);
    
    async function getData(){
		//Declares the screen name in Firebase
        const {
			businessID:BID
        } = props.navigation.state.params;

        setBusinessID(BID);
    }
    useEffect(() => {
        getData();
    }, []);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function formatDate (date){
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    }

    function formatTime (date){
        return (date.getHours() % 12 == 0 ? 12 : date.getHours() % 12)+':'+(date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())+((date.getHours() % 24) >= 12 ? 'pm' : 'am');
    }

    //rendering the screen
    return (
        <View style={style.Body}>
            <TopBanner
				title={strings.RequestTimeOff}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
            <View style={style.ContentContainer}>
                <View style={style.RowContainer}>
                    <Text style={style.ContentSubject}>{strings.AllDay}</Text>
                    <ToggleSwitch
                        isOn={allDay}
                        onColor={colors.blue}
                        offColor={colors.darkBlue}
                        labelStyle={{ marginHorizontal:0}}
                        onToggle={(activated) => {
                            setStartTime('');
                            setEndTime('');
                            setAllDay(activated);
                        }}
                        style={{alignSelf:'center'}}
                    />
                </View>
                <View style={{...style.RowContainer, justifyContent:'flex-start'}}>
                    <Icon name={'date-range'}
                        type={'material'}
                        size={40}
                        color={colors.darkBlue}/>
                    <View style={style.CollumnContainer}>
                        {allDay ? <View>
                            <Text style={style.ContentSubject}>{strings.Date}</Text>
                            <TouchableOpacity onPress={()=>{setPickerState(1);}} style={style.DateContainer}>
                                <Text style={[style.Date, startTime != '' ? style.DateContent : style.DateInput]}>{startTime != '' ? startTime : strings.SelectDate}</Text> 
                            </TouchableOpacity>
                        </View> : <View>
                            <Text style={style.ContentSubject}>{strings.From}</Text>
                            <TouchableOpacity onPress={()=>{setPickerState(2);}} style={style.DateContainer}>
                                <Text style={[style.Date, startTime != '' ? style.DateContent : style.DateInput]}>{startTime != '' ? startTime : strings.SelectDateAndTime}</Text> 
                            </TouchableOpacity>
                            <Text style={style.ContentSubject}>{strings.To}</Text>
                            <TouchableOpacity onPress={()=>{setPickerState(3);}} style={style.DateContainer}>
                                <Text style={[style.Date, endTime != '' ? style.DateContent : style.DateInput]}>{endTime != '' ? endTime : strings.SelectDateAndTime}</Text> 
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
                <View style={{...style.RowContainer, flex:1}}>
                    <Icon name={'comment'}
                        type={'material'}
                        size={40}
                        color={colors.darkBlue}/>
                    <View style={{...style.CollumnContainer, flex:1}}>
                        <Text style={style.ContentSubject}>{strings.Comments}</Text>
                        <TextInput style={style.InputContent} 
                            onChangeText={value=>setComments(value)}
                            multiline={true}
                            value={comments}
                            placeholder='Type something here...'
                            textAlignVertical='top'/>
                    </View>
                </View>
                <View style={style.FooterButton}>
                    <HelpButton
                        title={strings.SendRequest}
                        isLightButton={false}
                        width={175}
                        height={40}
                        biggerText={true}
                        bold={true}
                        onPress={() => {
                            //TODO: this
                        }}
                    />
                </View>
            </View>
            <DateTimePickerModal
                is24Hour={false}
                isVisible={pickerState != 0}
                mode={pickerState != 1 ? 'datetime' : 'date'}
                onConfirm={(time) => {
                    //Sets the selected date, and makes the picker go away
                    setPickerState(0);
                    let value = pickerState != 1 ? formatDate(time) + ' ' + formatTime(time) : formatDate(time);
                    if(pickerState != 3) setStartTime(value);
                    else setEndTime(value);
                }}
                onCancel={() => {
                    //Makes the picker go away
                    setPickerState(0);
                    setPickerState(0);
                }}
            />
        </View>
    );
}
