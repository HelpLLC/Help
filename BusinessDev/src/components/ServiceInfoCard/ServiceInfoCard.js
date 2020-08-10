import React, {useState} from 'react';
import { Image, View, Text } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import PropTypes from 'prop-types';
import ServiceInfoCardStyle from './ServiceInfoCardStyle';
import HelpButton from '../HelpButton/HelpButton';

export default function ServiceInfoCard(props) {
    const [changeToText, setChangeToText] = useState(false);

    ServiceInfoCard.propTypes = {
        name: PropTypes.string,
        date: PropTypes.string,
        timeBegin: PropTypes.string,
        timeEnd: PropTypes.string,
        buttonName: PropTypes.string,
        onButtonPress: PropTypes.func,
    };

    const {
        name,
        date,
        timeBegin,
        timeEnd,
        buttonName,
        onButtonPress,
    } = props;

    return (
        <View>
            <View style={{ ...ServiceInfoCardStyle.infoCard }}>
                <View style={{ ...ServiceInfoCardStyle.serviceText}}>
                    <Text style={{ ...ServiceInfoCardStyle.nameText}}>{name}</Text>
                    <Text style={{ ...ServiceInfoCardStyle.text}}>{date}</Text>
                    <Text style={{ ...ServiceInfoCardStyle.text}}>{timeBegin} - {timeEnd}</Text>
                </View>
                <View style={{ ...ServiceInfoCardStyle.button }}>
                    <HelpButton 
                        title={buttonName}
                        width={screenWidth * 0.29}
                        height={screenHeight * 0.04}
                        bold={true}
                        onPress={onButtonPress}
                    />
                </View>
            </View>
        </View>
    );
}