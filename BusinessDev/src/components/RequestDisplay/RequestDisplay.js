import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import phoneCall from 'react-native-phone-call';
import maps from 'react-native-open-maps';
import colors from 'config/colors';
import strings from 'config/strings';
import style from './RequestDisplayStyle';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';

//exporting the requestDisplay function
export default function requestDisplay(props) {

    function addSection(iconType, iconName, title, content, func = null){
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
                        {func ? <TouchableOpacity onPress={()=>{
                            setRefundRequested(true);
                            func();
                        }}>
                            <Text style={[style.PaymentMarker, refundRequested ? style.RefundMarker : style.SucceededMarker]} >
                                {refundRequested ? strings.RefundRequested : strings.PaymentSuccessful}
                            </Text>
                        </TouchableOpacity> : null}
                    </View>
                    {
                        title == strings.Address ? <TouchableOpacity onPress={()=>maps({end:content})}><Text style={[fontStyles.bigTextStyle, style.SectionContentText, {color: colors.lightBlue}]}>{content}</Text></TouchableOpacity>
                        : (title == strings.PhoneNumber ? <TouchableOpacity onPress={()=>phoneCall({number:content.replace(/[\+ \(\)-]/g, ""), prompt:true})}><Text style={[fontStyles.bigTextStyle, style.SectionContentText, {color: colors.lightBlue}]}>{content}</Text></TouchableOpacity>
                        : <Text style={[fontStyles.bigTextStyle, style.SectionContentText]}>{content}</Text>)
                    }
                </View>
            </View>
        );
    }

    function questionSection(questions){
        let elements = []
        for(let i in questions){
            elements.push(
                <Text style={[fontStyles.bigTextStyle, style.SectionContentText]} key={i+1}>{questions[i].question}</Text>
            );
            elements.push(
                <Text style={[fontStyles.bigTextStyle, style.SectionAnswerText]} key={-i}>{questions[i].answer}</Text>
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

    requestDisplay.propTypes = {
        request: PropTypes.object,
        onRefund: PropTypes.func,
    };
    
    const [refundRequested, setRefundRequested] = useState(false);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let { //NOTE: the request object passed into this function are standard firebase objects
        request,
        onRefund,
    } = props;

    if(!request) throw new Error('the field "request" of the requestDisplay component is undefined');
    if(!onRefund) onRefund = null;

    //rendering the screen
    let requestDate = request.date ? new Date(request.date) : null;
    return (
        <View style={style.ContentContainer}>
            {requestDate ? addSection('material', 'date-range', strings.Date, `${days[requestDate.getDay()]}, ${months[requestDate.getMonth()]} ${requestDate.getDate()}, ${requestDate.getFullYear()}`) : null}
            {request.time && request.endTime ? addSection('font-awesome', 'clock-o', strings.Time, `${request.time.toLowerCase().replace(/\s/g, '')} - ${request.endTime.toLowerCase().replace(/\s/g, '')}`) : null}
            {request.assignedTo ? addSection('material', 'account-circle', strings.Employee, request.assignedTo) : null}
            {request.customerName ? addSection('material', 'account-circle', strings.Customer, request.customerName) : null}
            {addSection('font-awesome', 'usd', strings.Payment, `${request.cash?'Cash':'Credit/Debit Card'} ${request.paymentInformation}`, onRefund)}
            {request.customerAddress ? addSection('entypo', 'location', strings.Address, request.customerAddress.replace(/, /, ',\n')) : null}
            {request.customerPhoneNumber ? addSection('font-awesome', 'mobile', strings.PhoneNumber, `(${request.customerPhoneNumber.substring(0,3)}) ${request.customerPhoneNumber.substring(3,6)}-${request.customerPhoneNumber.substring(6)}`) : null}
            {request.customerEmail ? addSection('entypo', 'mail', strings.Email, request.customerEmail) : null}
            {request.questions ? questionSection(request.questions) : null}
        </View>
    );
}
