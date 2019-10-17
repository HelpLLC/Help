import React, {Component} from 'react'
import {Text, View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import HelpView from '../components/HelpView'
import fontStyles from "config/styles/fontStyles";
import strings from "config/strings";

class LeftMenu extends Component {
    

    render() {
        return (
            <HelpView>
                <View >
                    <TouchableOpacity onPress={() => {this.props.navigation.push('FeaturedScreen', {requester: this.props.requester, allProducts: this.props.allProducts})}}>
                    <Text style={fontStyles.mainTextBlue}>
                        {strings.Home}
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.props.navigation.push('ChatsScreen', {requester: this.props.requester})}}>
                        <Text>{strings.Chat}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.props.navigation.push('SettingsScreen', {requester: this.props.requester})}}>
                        <Text>{strings.Settings}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity 
                        onPress={async () => {
                            await FirebaseFunctions.logOut(true, this.props.requester.requesterID);
                            this.props.navigation.push("FirstScreens");
                        }}>
                        <Text>{strings.LogOut}</Text>
                    </TouchableOpacity>
                </View>
            </HelpView>
        )
            
        
    }
}




export default LeftMenu;