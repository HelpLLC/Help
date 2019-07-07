//This screen will be the about screen which will be accessed from the settings tab of the 
//app from both provider and requester screens. It will have information such as the version
//number, user info, and general app info
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import strings from 'config/strings';
import whiteCardStyle from '../../config/styles/componentStyles/whiteCardStyle';
import HelpView from '../components/HelpView';

class aboutScreen extends Component {
    render() {
        return (
            <HelpView>
                <View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={fontStyles.bigTitleStyleBlue}>{strings.HelpExclamation}</Text>
                    </View>
                    <View style={{ flex: 0.75, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 2 }}></View>
                        <View style={{ flex: 50 }}>
                            <Text style={fontStyles.subTextStyleBlack}>{strings.MarketingMessage}</Text>
                        </View>
                        <View style={{ flex: 2 }}></View>
                    </View>
                    <View style={{ flexDirection: 'column', flex: 3 }}>
                        <WhiteCard
                            style={whiteCardStyle.whiteCardStyle}
                            text={strings.Version}
                            mainTextStyle={fontStyles.subTextStyleBlack}
                            comp={<Text style={fontStyles.subTextStyleBlack}>
                                {strings.CurrentVersionNumber}</Text>}
                            onPress={() => { }}
                        />
                        <WhiteCard
                            style={whiteCardStyle.whiteCardStyle}
                            text={strings.PublishedBy}
                            mainTextStyle={fontStyles.subTextStyleBlack}
                            comp={<Text style={fontStyles.subTextStyleBlack}>
                                {strings.HelpLLC}</Text>}
                            onPress={() => { }}
                        />
                        <WhiteCard
                            style={whiteCardStyle.whiteCardStyle}
                            text={strings.Contact}
                            mainTextStyle={fontStyles.subTextStyleBlack}
                            comp={<Text style={fontStyles.subTextStyleBlack} numberOfLines={1} >
                                {strings.ContactEmail}</Text>}
                            onPress={() => { }}
                        />
                    </View>
                </View>
            </HelpView>
        )
    }
}

export default aboutScreen;