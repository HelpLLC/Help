import React from 'react';
import { Image, View, Text } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import PropTypes from 'prop-types';
import EmployeeListItemStyle from './EmployeeListItemStyle';
import HelpButton from '../HelpButton/HelpButton';

export default function EmployeeListItem(props) {
    EmployeeListItem.propTypes = {
        buttonHeight: PropTypes.number,
        image: PropTypes.string,
        name: PropTypes.string,
        buttonText: PropTypes.string,
        buttonWidth: PropTypes.number,
    };

    const {
        buttonHeight,
        image,
        name,
        buttonText,
        buttonWidth,
    } = props;

    return (
        <View>
            <View style={{ ...EmployeeListItemStyle.listItem }}>
                <View>
                    <Image style={{ ...EmployeeListItemStyle.profileImage }} source={image} />
                </View>
                <View style={{ ...EmployeeListItemStyle.row }}>
                    <Text style={{ ...EmployeeListItemStyle.nameText }}>{name}</Text>
                    <View style={{ ...EmployeeListItemStyle.button }}>
                        <HelpButton 
                            title={buttonText}
                            width={buttonWidth}
                            height={buttonHeight}
                            style={{ ...EmployeeListItemStyle.assignButton }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}