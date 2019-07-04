//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import React, { Component } from 'React';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import topBannerStyle from 'config/styles/componentStyles/topBannerStyle';
import fontStyles from 'config/styles/fontStyles';

class TopBanner extends Component {
    render() {
        //The properties for the TopBannet components. There will be a left icon, banner title,
        //and right icon
        const { leftIconName, leftOnPress, title, rightIconName, rightOnPress } = this.props;
        return (
            <SafeAreaView>
                <View style={topBannerStyle.style}>
                    <View style={{ flex: 0.2 }}></View>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            height: (Dimensions.get('window').height * 0.12)
                        }}
                        onPress={() => { leftOnPress() }}>
                        <Icon
                            name={leftIconName}
                            type="font-awesome"
                            size={40}
                            color={colors.lightBlue} />
                    </TouchableOpacity>
                    <View style={{ flex: 0.2 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={fontStyles.bigTextStyleBlue}>{title}</Text>
                    </View>
                    <View style={{ flex: 0.2 }}></View>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            height: (Dimensions.get('window').height * 0.12)
                        }}
                        onPress={() => { rightOnPress() }}>
                        <Icon
                            name={rightIconName}
                            type="font-awesome"
                            size={40}
                            color={colors.lightBlue} />
                    </TouchableOpacity>
                    <View style={{ flex: 0.2 }}></View>
                </View>
            </SafeAreaView>
        );
    }
}

//These are the propTypes for the topBanner component. It defines whether they are required or not
//and what their types should be
TopBanner.propTypes = {
    leftIconName: PropTypes.string,
    leftOnPress: PropTypes.func,
    title: PropTypes.string.isRequired,
    rightIconName: PropTypes.string,
    rightOnPress: PropTypes.func,
}

//Exports the topBanner module
export default TopBanner;