//This screen will be the about screen which will be accessed from the settings tab of the 
//app from both provider and requester screens. It will have information such as the version
//number, user info, and general app info
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import strings from 'config/strings';
import whiteCardStyle from '../../config/styles/componentStyles/whiteCardStyle';

class aboutScreen extends Component {
    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.About}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>
                
                <View style={{ paddingRight: 14, paddingLeft: 14, paddingTop: 25, flexDirection: 'column' }}>
                    <Text style={fontStyles.subTextStyleBlack}>{strings.MarketingMessage}</Text>
                </View>

                <View style={{flexDirection: 'column', paddingTop: 50}}>
                    <WhiteCard
                        style={whiteCardStyle.noMarginCard}
                        text={strings.Version}
                        mainTextStyle={fontStyles.subTextStyleBlack}
                        comp={<Text style={fontStyles.subTextStyleBlack}>
                            {strings.CurrentVersionNumber}</Text>}
                        onPress={() => {}}
                    />
                    <WhiteCard
                        style={whiteCardStyle.noMarginCard}
                        text={strings.PublishedBy}
                        mainTextStyle={fontStyles.subTextStyleBlack}
                        comp={<Text style={fontStyles.subTextStyleBlack}>
                            {strings.HelpLLC}</Text>}
                        onPress={() => {}}
                    />
                    <WhiteCard
                        style={whiteCardStyle.noMarginCard}
                        text={strings.Contact}
                        mainTextStyle={fontStyles.subTextStyleBlack}
                        comp={<Text style={fontStyles.subTextStyleBlack}>
                            {strings.ContactEmail}</Text>}
                        onPress={() => {}}
                    />
                </View>
            </View>
        )
    }
}

export default aboutScreen;