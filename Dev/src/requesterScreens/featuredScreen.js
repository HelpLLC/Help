//This screen represents the main screen that is launched once the requester logs in. Here will be displayed the featured products
//where customers will be able to click on them to request them. The side menu  will also be accessible from this screen
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import TopBanner from '../components/TopBanner';
import HelpSearchBar from '../components/HelpSearchBar';
import OptionPicker from '../components/OptionPicker';

class featuredScreen extends Component {
	state = {
		isLoading: true,
		isOpen: false,
		search: '',
		allProducts: '',
		incompleteProfile: false
	};

	//Filters the products by ones that the user has blocked, and also returns only the products that are being offered within 50 miles
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('FeaturedScreen', 'featuredScreen');

		//Filters the products and removes any that are posted by blocked users
		let { allProducts, requester } = this.props.navigation.state.params;
		//Tests to see if the requester's account has been fully completed (used for pre-2.0 users)
		if (!FirebaseFunctions.isRequesterUpToDate(requester)) {
			this.setState({
				incompleteProfile: true,
				isLoading: false,
				allProducts
			});
		} else {
			allProducts = allProducts.filter((product) => {
				return !requester.blockedUsers.includes(product.offeredByID);
			});
			allProducts = await FirebaseFunctions.filterProductsByRequesterLocation(requester, allProducts);
			this.setState({
				allProducts,
				isLoading: false
			});
		}
	}

	render() {
		//Filters the products and removes any that are posted by blocked users
		let { requester } = this.props.navigation.state.params;
		let { allProducts } = this.state;

		if (this.state.isLoading === true) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<LoadingSpinner isVisible={true} />
				</View>
			);
		}

		const { search } = this.state;

		return (
			<SideMenu
				isOpen={this.state.isOpen}
				menu={
					<LeftMenu
						navigation={this.props.navigation}
						allProducts={allProducts}
						requester={requester}
					/>
				}>
				<HelpView style={screenStyle.container}>
					<TopBanner
						leftIconName='navicon'
						leftOnPress={() => {
							FirebaseFunctions.analytics.logEvent('sidemenu_opened_from_home');
							this.setState({ isOpen: true });
						}}
						size={30}
						title={strings.Featured}
					/>
					<HelpSearchBar
						placeholderText={strings.WhatAreYouLookingForQuestion}
						value={search}
						onChangeText={(text) => {
							//Logic for searching
							this.setState({ search: text });
						}}
					/>
					<View
						style={{
							height: Dimensions.get('window').height * 0.05,
							width: Dimensions.get('window').width * 0.93,
							justifyContent: 'flex-end',
							alignItems: 'flex-start'
						}}>
						<Text style={fontStyles.bigTextStyleBlue}>{strings.FeaturedServices}</Text>
					</View>
					<NarrowServiceCardList
						requester={requester}
						navigation={this.props.navigation}
						services={allProducts}
					/>
					<OptionPicker
						isVisible={this.state.incompleteProfile}
						title={strings.FinishCreatingYourProfile}
						oneOption={true}
						clickOutside={false}
						message={strings.FinishCreatingYourProfileMessage}
						confirmText={strings.Ok}
						confirmOnPress={() => {
							this.setState({ incompleteProfile: false });
							this.props.navigation.push('EditRequesterProfileScreen', {
								requester: requester,
								allProducts: allProducts,
								isEditing: true
							});
						}}
					/>
				</HelpView>
			</SideMenu>
		);
	}
}

//Exports the screen
export default featuredScreen;
