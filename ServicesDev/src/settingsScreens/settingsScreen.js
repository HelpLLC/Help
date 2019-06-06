//This screen is the settings screen that will availalbe from both providers and requesters' home
//screens. It will contain multiple options the user can choose from that will take them to seperate
//screens using a StackNavigator
import React, { Component } from 'react';
import { View, Switch, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import whiteCardStyle from '../../config/styles/componentStyles/whiteCardStyle';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import TopBanner from '../components/TopBanner';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import strings from 'config/strings';

class settingsScreen extends Component {
    //The state of the switch button which turns notifications on or off
    state = {
        //to-do: Make this value fetch the user's settings
        switchValue: true
    }
    render() {
        //This constant holds the value for the right angle icon which appears frequently
        //in this class
        const angleRightIcon = <Icon name={"angle-right"} type="font-awesome" color={colors.lightBlue} />;
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Settings} />
                </View>
                <View style={{ marginTop: 30 }}>
                    <WhiteCard
                        style={whiteCardStyle.marginCard}
                        text={strings.ReportAnIssue}
                        mainTextStyle={fontStyles.subTextStyleBlack}
                        comp={angleRightIcon}
                        //Pressing this leads to the report an issue screen
                        onPress={() => this.props.navigation.push('ReportIssueScreen')}
                    />
                    <WhiteCard
                        style={whiteCardStyle.marginCard}
                        text={strings.About}
                        mainTextStyle={fontStyles.subTextStyleBlack}
                        comp={angleRightIcon}
                        //Pressing this leads to the about screen page
                        onPress={() => this.props.navigation.push('AboutScreen')}
                    />
                    <WhiteCard
                        style={whiteCardStyle.marginCard}
                        text={strings.Privacy}
                        mainTextStyle={fontStyles.subTextStyleBlack}
                        comp={angleRightIcon}
                        //Pressing this leads to the about screen page
                        onPress={() => this.props.navigation.push('PrivacyScreen')}
                    />
                    <WhiteCard
                        style={whiteCardStyle.marginCard}
                        text={strings.LogOut}
                        mainTextStyle={fontStyles.subTextStyleRed}
                        //To-Do: Needs to call a logout function
                        onPress={() => this.props.navigation.push('SplashScreen')}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

export default settingsScreen;