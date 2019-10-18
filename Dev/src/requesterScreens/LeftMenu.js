import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import HelpView from '../components/HelpView'
import fontStyles from "config/styles/fontStyles";
import strings from "config/strings";
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';

class LeftMenu extends Component {


    render() {
        return (
            <HelpView style={screenStyle.container}>
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.push('FeaturedScreen', {
                            requester: this.props.requester,
                            allProducts: this.props.allProducts
                        })
                    }}>
                        <Text style={fontStyles.mainTextStyleBlue}>
                            {strings.Home}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.push('ChatsScreen', {
                            requester: this.props.requester,
                            allProducts: this.props.allProducts
                        })
                    }}>
                        <Text style={fontStyles.mainTextStyleBlue}>{strings.Chats}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.push('SettingsScreen', {
                            requester: this.props.requester,
                            allProducts: this.props.allProducts
                        })
                    }}>
                        <Text style={fontStyles.mainTextStyleBlue}>{strings.Settings}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={async () => {
                            await FirebaseFunctions.logOut(true, this.props.requester.requesterID);
                            this.props.navigation.push("FirstScreens");
                        }}>
                        <Text style={fontStyles.mainTextStyleRed}>{strings.LogOut}</Text>
                    </TouchableOpacity>
                </View>
            </HelpView>
        )


    }
}




export default LeftMenu;