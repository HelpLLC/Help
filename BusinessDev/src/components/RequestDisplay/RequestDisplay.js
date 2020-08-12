import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import style from './RequestDisplayStyle';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';

function addSection(iconType, iconName, title, content){
    return (
		<View style={[style.MainSectionContainer, style.MainBorder]} key={title}>
            <View style={style.SectionIcon}>
                <Icon name={iconName}
                    type={iconType}
                    size={60}
                    color={colors.darkBlue}/>
            </View>
			<View style={style.SectionTextContainer}>
				<Text style={[fontStyles.mainTextStyle, style.SectionTitleText]}>{title}</Text>
				<Text style={[fontStyles.bigTextStyle, style.SectionContentText]}>{content}</Text>
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

//exporting the requestDisplay function
export default function requestDisplay(props) {

    requestDisplay.propTypes = {
        request: PropTypes.object,
        customer: PropTypes.object,
	};

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const { //NOTE: the request and customer objects passed into this function are standard firebase objects
        request,
        customer
    } = props;

    if(!request) throw new Error('the field "request" of the requestDisplay component is undefined');
    if(!customer) throw new Error('the field "customer" of the requestDisplay component is undefined');

    //rendering the screen
    let requestDate = request.date ? new Date(request.date) : null;
    return (
        <View style={style.ContentContainer}>
            {requestDate ? addSection('material', 'date-range', strings.Date, `${days[requestDate.getDay()]}, ${months[requestDate.getMonth()]} ${requestDate.getDate()}, ${requestDate.getFullYear()}`) : null}
            {request.time && request.endTime ? addSection('material-community', 'clock', strings.Time, `${request.time.toLowerCase().replace(/\s/g, '')} - ${request.endTime.toLowerCase().replace(/\s/g, '')}`) : null}
            {request.assignedTo ? addSection('material-community', 'account-circle', strings.Employee, request.assignedTo) : null}
            {customer.name ? addSection('material-community', 'account-circle', strings.Customer, customer.name) : null}
            {addSection('ionicon', 'logo-usd', strings.Payment, `${request.cash?'Cash':'Credit/Debit Card'} ${request.paymentInformation}`)}
            {customer.address ? addSection('entypo', 'location', strings.Address, customer.address.replace(/, /, ',\n')) : null}
            {customer.phoneNumber ? addSection('font-awesome', 'mobile', strings.PhoneNumber, `(${customer.phoneNumber.substring(0,3)}) ${customer.phoneNumber.substring(3,6)}-${customer.phoneNumber.substring(6)}`) : null}
            {customer.email ? addSection('entypo', 'mail', strings.Email, customer.email) : null}
            {request.questions ? questionSection(request.questions) : null}
        </View>
    );
}
