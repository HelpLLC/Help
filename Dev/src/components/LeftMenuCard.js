//This component will represent each Touchable Text in the Left Menu accessed by the hamburger Icon.
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import leftMenuCardStyle from 'config/styles/componentStyles/leftMenuCardStyle';
import fontStyles from 'config/styles/fontStyles';

class LeftMenuCard extends Component {

    render() {

        const { onPress, text, textColor, renderBorder } = this.props;

        return (
            <TouchableOpacity
                style={renderBorder === true ? leftMenuCardStyle.mainStyleWithBorderBottom : leftMenuCardStyle.mainStyle}
                onPress={() => { onPress() }}>
                <Text style={[fontStyles.mainTextStyleBlue, { color: textColor }]}>{text}</Text>
            </TouchableOpacity>
        )

    }

}

//This component will take four different props. The Text to display, the onPress method for when the touchable opacity is clicked,
//the color of the text, and whether to render a border at the bottom of the touchable opacity
LeftMenuCard.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    textColor: PropTypes.string.isRequired,
    renderBorder: PropTypes.bool.isRequired
}

export default LeftMenuCard;

