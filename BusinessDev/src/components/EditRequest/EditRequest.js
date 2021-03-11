import React, { Component, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import phoneCall from 'react-native-phone-call';
import maps from 'react-native-open-maps';
import colors from 'config/colors';
import strings from 'config/strings';
import style from './EditRequestStyle';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';
import { and } from 'react-native-reanimated';

//exporting the requestDisplay function
export default function editRequest(props) {
    //TODO: add input verification
    
    // const [refundRequested, setRefundRequested] = useState(false);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    //the state of the function
	const [details, setDetails] = useState({});
	const [answers, setAnswers] = useState([]);
	const [questions, setQuestions] = useState([]);

	async function getData() {
        let { //NOTE: the request and customer objects passed into this function are standard firebase objects
            request,
            customer,
            onDataChange,
        } = props;
    
        if(!request) request = {};
        if(!customer) customer = {};
        // if(!onRefund) onRefund = null;
    
        setDetails({
            date: request.date,
            time: request.time,
            endTime: request.endTime,
            // assignedTo: request.assignedTo,
            customerName: customer.name,
            customerAddress: customer.address,
            customerPhoneNumber: customer.phoneNumber,
            customerEmail: customer.email,
        });
        if(request.questions){
            let qs = [];
            let ans = [];
            for(let i in request.questions){
                qs.push(request.questions[i].question);
                ans.push(request.questions[i].answer);
            }
            setQuestions(qs);
            setAnswers(ans);
        }
		
	}
	useEffect(() => {
		getData();
	}, []);

    editRequest.propTypes = {
        request: PropTypes.object,
        customer: PropTypes.object,
        onDataChange: PropTypes.func,
    };

    let requestDate = details.date ? new Date(details.date) : null;
    let obj = details;
    details.answers = answers;
    return (
        <View style={style.ContentContainer}>
            {addSection('material', 'date-range', strings.Date, requestDate == null ? null : `${days[requestDate.getDay()]}, ${months[requestDate.getMonth()]} ${requestDate.getDate()}, ${requestDate.getFullYear()}`, "date")}
            {addSection('font-awesome', 'clock-o', strings.StartTime, details.time ? `${details.time.toLowerCase().replace(/\s/g, '')}` : null, "time")}
            {addSection('font-awesome', 'clock-o', strings.EndTime, details.endTime ? `${details.endTime.toLowerCase().replace(/\s/g, '')}` : null, "endTime")}
            {/* {addSection('material', 'account-circle', strings.Employee, details.assignedTo)} */}
            {addSection('material', 'account-circle', strings.Customer, details.customerName, "customerName")}
            {addSection('entypo', 'location', strings.Address, details.customerAddress ? details.customerAddress.replace(/, /, ',\n') : null, "customerAddress")}
            {addSection('font-awesome', 'mobile', strings.PhoneNumber, details.customerPhoneNumber ? `(${details.customerPhoneNumber.substring(0,3)}) ${details.customerPhoneNumber.substring(3,6)}-${details.customerPhoneNumber.substring(6)}` : null, "customerPhoneNumber")}
            {addSection('entypo', 'mail', strings.Email, details.customerEmail, "customerEmail")}
            {questions ? questionSection() : null}
        </View>
    );

    function addSection(iconType, iconName, title, content, detailField){
        if (content == null) content = "";
        return (
            <View style={[style.MainSectionContainer, style.MainBorder]} key={title}>
                <View style={style.SectionIcon}>
                    <Icon name={iconName}
                        type={iconType}
                        size={60}
                        color={colors.darkBlue}/>
                </View>
                <View style={style.SectionTextContainer}>
                    <View style={style.RowContainer}>
                        <Text style={[fontStyles.mainTextStyle, style.SectionTitleText]}>{title}</Text>
                    </View>
                    <TextInput style={[fontStyles.bigTextStyle, style.SectionContentText]} onChangeText={text => {
                        let obj = details;
                        details[detailField] = text;
                        setDetails(obj);
                        obj.answers = answers;
                        props.onDataChange(obj);
                    }} >{content}</TextInput>
                </View>
            </View>
        );
    }

    function questionSection(){
        let elements = []
        for(let i in questions){
            elements.push(
                <Text style={[fontStyles.bigTextStyle, style.SectionContentText]} key={i+1}>{questions[i]}</Text>
            );
            elements.push(
                <TextInput style={[fontStyles.bigTextStyle, style.SectionAnswerText]} key={-i} onChangeText={text => {
                    let obj = answers;
                    obj[i] = text;
                    setAnswers(obj);
                    let obj2 = details;
                    obj2.answers = obj;
                    props.onDataChange(obj2);
                }}>{answers[i] == null ? "" : questions[i].answer}</TextInput>
            );
        }

        return (
            <View style={[style.MainSectionContainer]} key={strings.AdditionalInformation}>
                <Icon name='comment'
                    type='material'
                    size={60}
                    color={colors.darkBlue}
                    style={style.SectionIcon}/>
                <View style={style.SectionTextContainer}>
                    <Text style={[fontStyles.mainTextStyle, style.SectionTitleText]}>{strings.AdditionalInformation}</Text>
                    {elements}
                </View>
            </View>
        );
    }
}
