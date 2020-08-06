import React from 'react';
import { Image, View, Text } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import PropTypes from 'prop-types';
import TimeOffInfoCardStyle from './TimeOffInfoCardStyle';
import HelpButton from '../HelpButton/HelpButton';

export default function TimeOffInfoCard(props) {
    TimeOffInfoCard.propTypes = {
        name: PropTypes.string,
        date: PropTypes.string,
        timeBegin: PropTypes.string,
        timeEnd: PropTypes.string,
    };

    const {
        name,
        date,
        timeBegin,
        timeEnd,
    } = props;

    return (
        <View>
            <View style={{ ...TimeOffInfoCardStyle.unconfirmedInfoCard }}>
                <View style={{ ...TimeOffInfoCardStyle.unconfirmedText}}>
                    <Text style={{ ...TimeOffInfoCardStyle.nameText}}>{name}</Text>
                    <Text style={{ ...TimeOffInfoCardStyle.text}}>{date}</Text>
                    <Text style={{ ...TimeOffInfoCardStyle.text}}>{timeBegin} - {timeEnd}</Text>
                </View>
                <View style={{ ...TimeOffInfoCardStyle.statusButtons }}>
                    <View style={{ ...TimeOffInfoCardStyle.requestButton }}>
                        <HelpButton 
                            title={strings.Approve}
                            width={screenWidth * 0.29}
                            height={screenHeight * 0.04}
                            bold={true}
                        />
                    </View>
                    <View style={{ ...TimeOffInfoCardStyle.requestButton }}>
                        <HelpButton 
                            title={strings.Deny}
                            width={screenWidth * 0.29}
                            height={screenHeight * 0.04}
                            bold={true}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}