//This screen is the settings screen that will availalbe from both providers and requesters' home
//screens. It will contain multiple options the user can choose from that will take them to seperate
//screens using a StackNavigator
import React, { Component } from 'react';
import { View } from 'react-native';
import TopBanner from '../components/TopBanner';
import whiteCardStyle from '../../config/styles/componentStyles/whiteCardStyle';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import screenStyle from 'config/screenStyle';
import HelpView from '../components/HelpView';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';

class settingsScreen extends Component {
    render() {
        //This constant holds the value for the right angle icon which appears frequently
        //in this class
        const angleRightIcon = <Icon name={"angle-right"} type="font-awesome" color={colors.lightBlue} />;
        //Retrieves the current user from the params
        const user = (this.props.navigation.state.params.providerID ? this.props.navigation.state.params.providerID :
            this.props.navigation.state.params.requester);
        return (
            <HelpView style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Settings} />
                </View>
                <View>
                    <View style={{ flex: 0.1 }}></View>
                    <View style={{ flex: 2 }}>
                        <View style={{ flex: 1 }}>
                            <WhiteCard
                                style={whiteCardStyle.whiteCardStyle}
                                text={strings.ReportAnIssue}
                                mainTextStyle={fontStyles.subTextStyleBlack}
                                comp={angleRightIcon}
                                //Pressing this leads to the report an issue screen
                                onPress={() => this.props.navigation.push('ReportIssueScreen', {
                                    user
                                })}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <WhiteCard
                                style={whiteCardStyle.whiteCardStyle}
                                text={strings.About}
                                mainTextStyle={fontStyles.subTextStyleBlack}
                                comp={angleRightIcon}
                                //Pressing this leads to the about screen page
                                onPress={() => this.props.navigation.push('AboutScreen')}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <WhiteCard
                                style={whiteCardStyle.whiteCardStyle}
                                text={strings.Privacy}
                                mainTextStyle={fontStyles.subTextStyleBlack}
                                comp={angleRightIcon}
                                //Pressing this leads to the about screen page
                                onPress={() => this.props.navigation.push('PrivacyScreen')}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <WhiteCard
                                style={whiteCardStyle.whiteCardStyle}
                                text={strings.LogOut}
                                mainTextStyle={fontStyles.subTextStyleRed}
                                //To-Do: Needs to call a logout function
                                onPress={async () => {
                                    await FirebaseFunctions.logOut();
                                    this.props.navigation.push('FirstScreens');
                                }}
                            />
                        </View>
                        <View style={{ flex: 3 }}></View>
                    </View>
                </View>
            </HelpView>
        )
    }
}

export default settingsScreen;