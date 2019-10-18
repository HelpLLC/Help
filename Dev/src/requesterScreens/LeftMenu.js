import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import HelpView from "../components/HelpView";
import fontStyles from "config/styles/fontStyles";
import strings from "config/strings";
import FirebaseFunctions from "config/FirebaseFunctions";
import screenStyle from "config/styles/screenStyle";
import colors from "../../config/colors";
//This screen is the side menu where you can navigate to all the screens for the customer
class LeftMenu extends Component {
  render() {
    return (
      <HelpView style={screenStyle.container}>
        <View style={{ flex: 1, justifyContent: "space-evenly" }}>
          <TouchableOpacity style = {styles.borderBottom}
            onPress={() => {
              //Home leads to featured screen
              this.props.navigation.push("FeaturedScreen", {
                requester: this.props.requester,
                allProducts: this.props.allProducts
              });
            }}
          >
            <Text style={fontStyles.mainTextStyleBlue}>{strings.Home}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              //Leads to the chats screen
              this.props.navigation.push("ChatsScreen", {
                requester: this.props.requester,
                allProducts: this.props.allProducts
              });
            }}
          >
            <Text style={fontStyles.mainTextStyleBlue}>{strings.Chats}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
                //Leads to the settings screen
              this.props.navigation.push("SettingsScreen", {
                requester: this.props.requester,
                allProducts: this.props.allProducts
              });
            }}
          >
            <Text style={[fontStyles.mainTextStyleBlue, {}]}>{strings.Settings}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
          //Logs out then goes to the first screen
            onPress={async () => {
              await FirebaseFunctions.logOut(
                true,
                this.props.requester.requesterID
              );
              this.props.navigation.push("FirstScreens");
            }}
          >
            <Text style={fontStyles.mainTextStyleRed}>{strings.LogOut}</Text>
          </TouchableOpacity>
        </View>
      </HelpView>
    );
  }
}
const styles = StyleSheet.create({
  borderBottom: {
    borderBottomColor:colors.black, 
    borderBottomWidth: 2,
    borderBottomColor: colors.lightBlue
  }
})
//exports side menu
export default LeftMenu;
