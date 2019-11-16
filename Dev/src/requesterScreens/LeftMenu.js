import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import HelpView from '../components/HelpView';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ImageWithBorder from '../components/ImageWithBorder';
import LeftMenuCard from '../components/LeftMenuCard';
import colors from 'config/colors';

//This screen is the side menu where you can navigate to all the screens for the customer
class LeftMenu extends Component {
	render() {
		const { requester } = this.props;
		return (
			<HelpView style={screenStyle.container}>
				<View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
				<View
					style={{
						height: Dimensions.get('window').height * 0.65
					}}>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							height: Dimensions.get('window').height * 0.075,
							marginBottom: Dimensions.get('window').height * 0.01,
							justifyContent: 'space-evenly',
							alignItems: 'center',
							marginRight: Dimensions.get('window').width * .1
						}}
						onPress={() => {
							//Home leads to featured screen
							FirebaseFunctions.analytics.logEvent('my_profile__clicked');
							this.props.navigation.push('EditRequesterProfileScreen', {
								requester: this.props.requester,
								allProducts: this.props.allProducts,
								isEditing: true
							});
						}}>
						<ImageWithBorder
							width={Dimensions.get('window').height * 0.075}
							height={Dimensions.get('window').height * 0.075}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this requester
								return await FirebaseFunctions.getProfilePictureByID(
									this.props.requester.requesterID
								);
							}}
						/>
						<View
							style={{
								flexDirection: 'column',
								justifyContent: 'space-evenly'
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>
								{//Creates a first name effect
								requester.username.trim().includes(' ')
								? 
									requester.username.substring(0, requester.username.trim().indexOf(' '))
								: 
									requester.username
								}
							</Text>
							<View style={{ height: Dimensions.get('window').height * 0.01 }}></View>
							<Text style={fontStyles.subTextStyleBlack}>
								{requester.city ? 
									//Method shows only one comma in location: "Redmond, WA" not Redmond, WA, USA
									requester.city.substring(requester.city.indexOf(',') + 1).includes(',')
										? requester.city.substring(0, requester.city.lastIndexOf(','))
										: requester.city : ("")
									}
							</Text>
						</View>
					</TouchableOpacity>
					<View style={{ marginLeft: Dimensions.get('window').width * .05 }}>
						<LeftMenuCard
							text={strings.Home}
							textColor={colors.lightBlue}
							onPress={() => {
								//Home leads to featured screen
								FirebaseFunctions.analytics.logEvent('home_card_clicked');
								this.props.navigation.push('FeaturedScreen', {
									requester: this.props.requester,
									allProducts: this.props.allProducts
								});
							}}
							renderBorder={true}
						/>
						<LeftMenuCard
							text={strings.Categories}
							textColor={colors.lightBlue}
							onPress={() => {
								//Categories leads to the categories screen
								FirebaseFunctions.analytics.logEvent('category_card_clicked');
								this.props.navigation.push('RequesterCategoriesScreen', {
									requester: this.props.requester,
									allProducts: this.props.allProducts
								});
							}}
							renderBorder={true}
						/>
						<LeftMenuCard
							text={strings.OrderHistory}
							textColor={colors.lightBlue}
							onPress={() => {
								//Order History leads to order history screen
								FirebaseFunctions.analytics.logEvent('order_history_card_clicked');
								this.props.navigation.push('RequesterOrderHistoryScreen', {
									requester: this.props.requester,
									allProducts: this.props.allProducts
								});
							}}
							renderBorder={true}
						/>
						<LeftMenuCard
							text={strings.Chats}
							textColor={colors.lightBlue}
							onPress={() => {
								//Chats leads to the chats screen
								FirebaseFunctions.analytics.logEvent('chat_card_clicked');
								this.props.navigation.push('ChatsScreen', {
									requester: this.props.requester,
									allProducts: this.props.allProducts
								});
							}}
							renderBorder={true}
						/>
						<LeftMenuCard
							text={strings.MyProfile}
							textColor={colors.lightBlue}
							onPress={() => {
								//Home leads to featured screen
								FirebaseFunctions.analytics.logEvent('my_profile_card_clicked');
								this.props.navigation.push('EditRequesterProfileScreen', {
									requester: this.props.requester,
									allProducts: this.props.allProducts,
									isEditing: true
								});
							}}
							renderBorder={true}
						/>
						<LeftMenuCard
							text={strings.Settings}
							textColor={colors.lightBlue}
							onPress={() => {
								//Settings leads to the settings screen
								FirebaseFunctions.analytics.logEvent('settings_card_clicked');
								this.props.navigation.push('SettingsScreen', {
									requester: this.props.requester,
									allProducts: this.props.allProducts
								});
							}}
							renderBorder={false}
						/>
					</View>
				</View>
				<View
					style={{ height: Dimensions.get('window').height * 0.25, justifyContent: 'flex-end', marginLeft: Dimensions.get('window').width * .05 }}>
					<LeftMenuCard
						text={strings.LogOut}
						textColor={colors.red}
						onPress={async () => {
							//Logs the current user out and goes to first screens
							FirebaseFunctions.analytics.logEvent('logged_out_from_sideMenu');
							await FirebaseFunctions.logOut(true, this.props.requester.requesterID);
							this.props.navigation.push('SplashScreen');
						}}
						renderBorder={false}
					/>
				</View>
				<View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
			</HelpView>
		);
	}
}

//exports side menu
export default LeftMenu;
