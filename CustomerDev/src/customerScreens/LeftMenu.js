import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import HelpView from '../components/HelpView';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ImageWithBorder from '../components/ImageWithBorder';
import LeftMenuCard from '../components/LeftMenuCard';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

//This screen is the side menu where you can navigate to all the screens for the customer
class LeftMenu extends Component {
	render() {
		const { customer } = this.props;
		return (
			<HelpView style={screenStyle.container}>
				<View style={{ height: screenHeight * 0.05 }}></View>
				<View
					style={{
						height: screenHeight * 0.65
					}}>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							height: screenHeight * 0.075,
							marginBottom: screenHeight * 0.01,
							justifyContent: 'space-evenly',
							alignItems: 'center',
							marginRight: screenWidth * 0.1
						}}
						onPress={() => {
							//Home leads to featured screen
							FirebaseFunctions.analytics.logEvent('my_profile_clicked');
							this.props.navigation.push('AdditionalCustomerInfoScreen', {
								customer: this.props.customer,
								allServices: this.props.allServices,
								isEditing: true
							});
						}}>
						<ImageWithBorder
							width={screenHeight * 0.075}
							height={screenHeight * 0.075}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this customer
								return await FirebaseFunctions.call('getProfilePictureByID', {
									ID: this.props.customer.customerID
								});
							}}
						/>
						<View
							style={{
								flexDirection: 'column',
								justifyContent: 'space-evenly'
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>
								{//Creates a first name effect
								customer.name.trim().includes(' ')
									? customer.name.substring(0, customer.name.trim().indexOf(' '))
									: customer.name}
							</Text>
							<View style={{ height: screenHeight * 0.01 }}></View>
							<Text style={fontStyles.subTextStyleBlack}>
								{customer.city + ', ' + customer.state}
							</Text>
						</View>
					</TouchableOpacity>
					<View style={{ marginLeft: screenWidth * 0.05 }}>
						<LeftMenuCard
							text={strings.Home}
							textColor={colors.lightBlue}
							onPress={() => {
								//Home leads to featured screen
								FirebaseFunctions.analytics.logEvent('home_card_clicked');
								this.props.navigation.push('FeaturedScreen', {
									customer: this.props.customer,
									allServices: this.props.allServices
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
								this.props.navigation.push('CategoriesScreen', {
									customer: this.props.customer,
									allServices: this.props.allServices
								});
							}}
							renderBorder={true}
						/>
						<LeftMenuCard
							text={strings.Payments}
							textColor={colors.lightBlue}
							onPress={() => {
								//Categories leads to the categories screen
								FirebaseFunctions.analytics.logEvent('payments_card_clicks');
								this.props.navigation.push('PaymentsScreen', {
									customer: this.props.customer,
									allServices: this.props.allServices,
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
								this.props.navigation.push('OrderHistoryScreen', {
									customer: this.props.customer,
									allServices: this.props.allServices
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
								this.props.navigation.push('AdditionalCustomerInfoScreen', {
									customer: this.props.customer,
									allServices: this.props.allServices,
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
									customer: this.props.customer,
									allServices: this.props.allServices
								});
							}}
							renderBorder={false}
						/>
					</View>
				</View>
				<View
					style={{
						height: screenHeight * 0.25,
						justifyContent: 'flex-end',
						marginLeft: screenWidth * 0.05
					}}>
					<LeftMenuCard
						text={strings.LogOut}
						textColor={colors.red}
						onPress={async () => {
							//Logs the current user out and goes to first screens
							FirebaseFunctions.analytics.logEvent('logged_out_from_sideMenu');
							FirebaseFunctions.logOut(this.props.customer.customerID);
							this.props.navigation.push('SplashScreen');
						}}
						renderBorder={false}
					/>
				</View>
				<View style={{ height: screenHeight * 0.05 }}></View>
			</HelpView>
		);
	}
}

//exports side menu
export default LeftMenu;
