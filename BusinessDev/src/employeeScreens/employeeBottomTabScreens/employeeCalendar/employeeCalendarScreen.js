import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import style from './employeeCalendarScreenStyle';
import fontStyles from 'config/styles/fontStyles';

export default function employeeCalendarScreen(props) {
    // props = {navigation:{push:()=>{},state:{params:{employeeID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

    //the state of the function
    const [employeeID, setEmployeeID] = useState('');
    // const [businessData, setBusinessData] = useState({});
    const [scheduleData, setScheduleData] = useState([]);
    const [focusedDate, setFocusedDate] = useState("");
    const [view, setView] = useState("");
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    
    async function getData(){
		//Declares the screen name in Firebase
        // FirebaseFunctions.setCurrentScreen('calendarScreen', 'calendarScreen');
        const {
			employeeID:EID
        } = props.navigation.state.params;
        
        const employee = await FirebaseFunctions.call('getEmployeeByID', {
            employeeID:EID,
        });

        // let employee = {currentRequests:[
        //     {
        //         date:"2021-3-10",
        //         serviceTitle:"Photography",
        //         time:"3:30 PM",
        //         endTime:"5:00 PM",
        //         requestID:'a'
        //     },
        //     {
        //         date:"2021-3-10",
        //         serviceTitle:"Photography",
        //         time:"5:30 PM",
        //         endTime:"6:30 PM",
        //         requestID:'b'
        //     },
        //     {
        //         date:"2021-3-12",
        //         serviceTitle:"Photography",
        //         time:"3:30 PM",
        //         endTime:"5:00 PM",
        //         requestID:'c'
        //     },
        // ], timeOff: [
        //     {
        //         date:"2021-3-13",
        //         startTime:"2:30 PM",
        //         endTime:"3:30 PM",
        //         status:"pending"
        //     },
        //     {
        //         date:"2021-3-13",
        //         startTime:"4:00 PM",
        //         endTime:"5:00 PM",
        //         status:"confirmed"
        //     },
        //     {
        //         date:"2021-3-13",
        //         startTime:"6:00 PM",
        //         endTime:"7:00 PM",
        //         status:"denied"
        //     },

        // ]};

        let scheduleObj = {};
        for(let i in employee.currentRequests){
            if(scheduleObj[employee.currentRequests[i].date] != undefined)
                scheduleObj[employee.currentRequests[i].date].push(employee.currentRequests[i]);
            else scheduleObj[employee.currentRequests[i].date] = [employee.currentRequests[i]];
        }
        for(let i in employee.timeOff){
            if(employee.timeOff[i].status == "denied") continue;
            employee.timeOff[i].time = employee.timeOff[i].startTime;
            if(scheduleObj[employee.timeOff[i].date] != undefined)
                scheduleObj[employee.timeOff[i].date].push(employee.timeOff[i]);
            else scheduleObj[employee.timeOff[i].date] = [employee.timeOff[i]];
        }
        for(let i in scheduleObj)
            scheduleObj[i].sort((a,b) => compareTimes(a.time,b.time));

        setEmployeeID(EID);
        setFocusedDate(getDateString(new Date()));
        setView("M");
        setScheduleData(scheduleObj);
        setIsScreenLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);

    function compareTimes(a, b){
        return parseTimeToHours(a) - parseTimeToHours(b);
    }

    function parseTimeToHours(time){
        let hours = parseInt(time.substring(0, time.indexOf(':'))) + parseFloat(time.substr(time.indexOf(':')+1, 2)) / 60.0;
        if(time.toLowerCase().includes("p")) hours += 12;

        return hours;
    }

    function getDateString(date){
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }

    function getDateFromString(string){
        let arr = string.split('-');
        return new Date(arr[0], arr[1]-1, arr[2]);
    }
    
    function SwitchScreens(){
        setView(view=='M'?'W':'M');
    }

    function LastMonth(){
        let date = getDateFromString(focusedDate);
        date.setMonth(date.getMonth()-1);
        setFocusedDate(getDateString(date));
    }

    function NextMonth(){
        let date = getDateFromString(focusedDate);
        date.setMonth(date.getMonth()+1);
        setFocusedDate(getDateString(date));
    }

    function LastWeek(){
        let date = getDateFromString(focusedDate);
        date.setDate(date.getDate()-7);
        setFocusedDate(getDateString(date));
    }

    function NextWeek(){
        let date = getDateFromString(focusedDate);
        date.setDate(date.getDate()+7);
        setFocusedDate(getDateString(date));
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    function GetMonthLabel(){
        let date = getDateFromString(focusedDate);
        return months[date.getMonth()]+" "+date.getFullYear();
    }

    function RenderWeekdayLabels(){
        let labels = [];
        for(let i in days){
            labels.push(
                <Text key={i} style={style.DayLabels}>{days[i].substring(0, 1)}</Text>
            );
        }
        return <View style={{...style.RowContainer, justifyContent:'space-around', marginVertical:5}}>{labels}</View>
    }

    function GetWeekLabel(){
        let sunDate = getDateFromString(focusedDate);
        sunDate.setDate(sunDate.getDate()-sunDate.getDay());

        let satDate = new Date(sunDate.getFullYear(), sunDate.getMonth(), sunDate.getDate());
        satDate.setDate(satDate.getDate()+6);

        return months[sunDate.getMonth()]+" "+(sunDate.getDate())+' - '+(satDate.getMonth() == sunDate.getMonth()?'':months[satDate.getMonth()])+' '+satDate.getDate();
    }

    function RenderWeekLabels(){
        let labels = [];
        let date = getDateFromString(focusedDate);
        let focused = getDateFromString(focusedDate);
        date.setDate(date.getDate()-date.getDay());

        for(let i = 0; i < 7; i++){
            let dateString = getDateString(date);
            labels.push(
                <TouchableWithoutFeedback key={date.getDate()} onPress={()=>{setFocusedDate(dateString)}}>
                    <View style={{...style.WeekDayLabelContainer, borderColor: date.getDate() == focused.getDate()?colors.white:colors.blue}}>
                        <Text key={i} style={style.WeekDayLabel}>{days[i].substring(0, 3)+'\n'+date.getDate()}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );

            date.setDate(date.getDate()+1);
        }
        return <View style={{...style.RowContainer, justifyContent:'space-between', marginVertical:5}}>{labels}</View>
    }

    function RenderDays(){
        let days = [];
        let date = getDateFromString(focusedDate);
        date = new Date(date.getFullYear(), date.getMonth());
        const month = date.getMonth();
        date.setDate(1-date.getDay());

        do{
            let week = [];
            for(let i = 0; i < 7; i++){
                if(date.getMonth() != month)
                    week.push(<View key={i} style={{width:style.MonthDay.width}}></View>);
                else{
                    week.push(
                        <View key={i} style={{...style.MonthDay, backgroundColor:scheduleData[getDateString(date)] != undefined?colors.deepBlue:colors.blue}}>
                            <Text style={{...style.MonthDayText}}>{date.getDate()}</Text>
                        </View>
                    );
                }
                date.setDate(date.getDate()+1);
            }
            days.push(
                <View key={date.getMonth()+"-"+date.getDate()} style={{...style.RowContainer, justifyContent:'space-around', marginVertical:10}}>
                    {week}
                </View>
            );
        } while(date.getMonth() == month);
        return days;
    }

    function RenderMonthRequests(){
        let days = [];
        let date = getDateFromString(focusedDate);
        date = new Date(date.getFullYear(), date.getMonth());
        const month = date.getMonth();

        while(date.getMonth() == month){
            if(scheduleData[getDateString(date)] != undefined){
                const obj = scheduleData[getDateString(date)];

                let requests = [];
                let a = "";
                for(let i in obj){
                    if(obj[i].serviceTitle == undefined){
                        if(obj[i].status == "pending") requests.push(
                            <View key={i} style={{...style.MonthRequestContainer, borderColor: colors.darkBlue, backgroundColor: colors.darkBlue}}>
                                <Text style={{...style.DayLabel, color: colors.white}}>{strings.TOpending}</Text>
                                <Text style={{...style.DayLabel, color: colors.white}}>{obj[i].startTime.toLowerCase().replace(' ', '')+" - "+obj[i].endTime.toLowerCase().replace(' ', '')}</Text>
                            </View>
                        );
                        else requests.push(
                            <View key={i} style={{...style.MonthRequestContainer, borderColor: colors.blue, backgroundColor: colors.blue}}>
                                <Text style={{...style.DayLabel, color: colors.white}}>{strings.TOrequest}</Text>
                                <Text style={{...style.DayLabel, color: colors.white}}>{obj[i].startTime.toLowerCase().replace(' ', '')+" - "+obj[i].endTime.toLowerCase().replace(' ', '')}</Text>
                            </View>
                        );
                    }
                    else requests.push(
                        <View key={obj[i].requestID} style={style.MonthRequestContainer}>
                            <Text style={style.DayLabel}>{obj[i].serviceTitle}</Text>
                            <Text style={style.DayLabel}>{obj[i].time.toLowerCase().replace(' ', '')+" - "+obj[i].endTime.toLowerCase().replace(' ', '')}</Text>
                        </View>
                    );
                }

                days.push(
                    <View key={date.getDate()} style={style.DayContainer}>
                        <Text style={style.DayLabel}>{months[month]+' '+date.getDate()}</Text>
                        {requests}
                    </View>
                );
            }

            date.setDate(date.getDate()+1);
        }

        if(days.length == 0)
            days.push(
                <View style={style.NoRequestsLabelContainer}>
                    <Text style={style.NoRequestsLabel}>{strings.NoRequests}</Text>
                </View>
            );

        return days;
    }

    function renderDayRequests(){ //TODO: this
        let date = getDateFromString(focusedDate);
        if(scheduleData[getDateString(date)] == undefined){
            return <View style={style.NoRequestsLabelContainer}>
                <Text style={style.NoRequestsLabel}>{strings.NoRequests}</Text>
            </View>
        }
        else{
            let elements = [];

            for(let i = 0; i < 24; i++)
                elements.push(
                    <Text key={i} style={{...style.TimeLabel}}>{(i == 0 ? 12 : (i > 12 ? i-12 : i)) + ' ' + (i > 11 ? 'PM' : 'AM')}</Text>
                );

            const obj = scheduleData[getDateString(date)];

            for(let i in obj){
                if(obj[i].serviceTitle == undefined){
                    if(obj[i].status == "pending") elements.push(
                        <View key={i} style={{...style.MonthRequestContainer, position:'absolute', left: 60, width:screenWidth-70, top:parseTimeToHours(obj[i].time) * style.TimeLabel.height, height:(parseTimeToHours(obj[i].endTime) - parseTimeToHours(obj[i].time)) * style.TimeLabel.height, borderColor: colors.darkBlue, backgroundColor: colors.darkBlue}}>
                            <Text style={{...style.DayLabel, color: colors.white}}>{strings.TOpending}</Text>
                            <Text style={{...style.DayLabel, color: colors.white}}>{obj[i].time.toLowerCase().replace(' ', '')+" - "+obj[i].endTime.toLowerCase().replace(' ', '')}</Text>
                        </View>
                    );
                    else elements.push(
                        <View key={i} style={{...style.MonthRequestContainer, position:'absolute', left: 60, width:screenWidth-70, top:parseTimeToHours(obj[i].time) * style.TimeLabel.height, height:(parseTimeToHours(obj[i].endTime) - parseTimeToHours(obj[i].time)) * style.TimeLabel.height, borderColor: colors.blue, backgroundColor: colors.blue}}>
                            <Text style={{...style.DayLabel, color: colors.white}}>{strings.TOrequest}</Text>
                            <Text style={{...style.DayLabel, color: colors.white}}>{obj[i].time.toLowerCase().replace(' ', '')+" - "+obj[i].endTime.toLowerCase().replace(' ', '')}</Text>
                        </View>
                    );
                }
                else elements.push(
                    <View key={obj[i].requestID} style={{...style.MonthRequestContainer, position:'absolute', left: 60, width:screenWidth-70, top:parseTimeToHours(obj[i].time) * style.TimeLabel.height, height:(parseTimeToHours(obj[i].endTime) - parseTimeToHours(obj[i].time)) * style.TimeLabel.height}}>
                        <Text style={style.DayLabel}>{obj[i].serviceTitle}</Text>
                        <Text style={style.DayLabel}>{obj[i].time.toLowerCase().replace(' ', '')+" - "+obj[i].endTime.toLowerCase().replace(' ', '')}</Text>
                    </View>
                );
                
            }

            return elements;
        }
    }

    //rendering the screen
    if(isScreenLoading) return (
        <View style={style.Body}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <LoadingSpinner isVisible={true} />
            </View>
        </View>
    );
    else if(view == 'M') return (
        <View style={style.Body}>
            <View style={[style.RowContainer, {backgroundColor: colors.blue, height:70, width:screenWidth, justifyContent:'flex-end'}]}>
                <TouchableWithoutFeedback onPress={SwitchScreens}>
                    <View style={style.ViewButton}>
                        <Text style={style.ViewText}>{strings.ViewWeek}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{...style.CollumnContainer, borderTopWidth:1, borderColor:colors.white, backgroundColor:colors.blue, width:screenWidth}}>
                <View style={{...style.RowContainer, justifyContent:'center', width:'100%', marginTop:5}}>
                    <TouchableWithoutFeedback onPress={LastMonth}>
                        <Icon
                            name={'angle-left'}
                            type='font-awesome'
                            size={40}
                            color={colors.white}
                        />
                    </TouchableWithoutFeedback>
                    <Text style={style.KeyLabel}>{GetMonthLabel()}</Text>
                    <TouchableWithoutFeedback onPress={NextMonth}>
                        <Icon
                            name={'angle-right'}
                            type='font-awesome'
                            size={40}
                            color={colors.white}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{marginBottom:5}}>
                    {RenderWeekdayLabels()}
                    {RenderDays()}
                </View>
            </View>
            <View style={{...style.ContentContainer, ...style.CollumnContainer, width:'100%'}}>
                <ScrollView style={{width:'100%', height:1}}>
                    {RenderMonthRequests()}
                </ScrollView>
            </View>
        </View>
    );
    else return (
        <View style={style.Body}>
            <View style={[style.RowContainer, {backgroundColor: colors.blue, height:70, width:screenWidth, justifyContent:'flex-end'}]}>
                <TouchableWithoutFeedback onPress={SwitchScreens}>
                    <View style={style.ViewButton}>
                        <Text style={style.ViewText}>{strings.ViewMonth}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{...style.CollumnContainer, borderTopWidth:1, borderColor:colors.white, backgroundColor:colors.blue, width:screenWidth}}>
                <View style={{...style.RowContainer, justifyContent:'center', width:'100%', marginTop:5}}>
                    <TouchableWithoutFeedback onPress={LastWeek}>
                        <Icon
                            name={'angle-left'}
                            type='font-awesome'
                            size={40}
                            color={colors.white}
                        />
                    </TouchableWithoutFeedback>
                    <Text style={style.KeyLabel}>{GetWeekLabel()}</Text>
                    <TouchableWithoutFeedback onPress={NextWeek}>
                        <Icon
                            name={'angle-right'}
                            type='font-awesome'
                            size={40}
                            color={colors.white}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{marginBottom:5}}>
                    {RenderWeekLabels()}
                </View>
            </View>
            <View style={{...style.ContentContainer, ...style.CollumnContainer, width:'100%'}}>
                <ScrollView style={{width:'100%', height:1}}>
                    {renderDayRequests()}
                </ScrollView>
            </View>
        </View>
    );
}