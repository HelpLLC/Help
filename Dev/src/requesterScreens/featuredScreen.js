//This screen represents the main screen that is launched once the requester logs in. Here will be displayed the featured products
//where customers will be able to click on them to request them. The side menu  will also be accessible from this screen
import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
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
import ReviewPopup from '../components/ReviewPopup';

class featuredScreen extends Component {
	productId = 0;

	state = {
		isLoading: true,
		isOpen: false,
		isReviewDue: false,
		stars: null,
		comment: null,
		search: '',
		allProducts: '',
		displayedProducts: '',
		reviewComment: '',
		incompleteProfile: false
	};

	//Filters the products by ones that the user has blocked, and also returns only the products that are being offered within 50 miles
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('FeaturedScreen', 'featuredScreen');

		//Filters the products and removes any that are posted by blocked users
		let { allProducts, requester } = this.props.navigation.state.params;
		allProducts = allProducts.filter((product) => {
			return !requester.blockedUsers.includes(product.offeredByID);
		});
		//Tests to see if the requester's account has been fully completed (used for pre-2.0 users)
		if (!FirebaseFunctions.isRequesterUpToDate(requester)) {
			this.setState({
				incompleteProfile: true,
				isLoading: false,
				displayedProducts: allProducts,
				allProducts
			});
		} else {
			allProducts = allProducts.filter((product) => {
				return !requester.blockedUsers.includes(product.offeredByID);
			});
			allProducts = await FirebaseFunctions.filterProductsByRequesterLocation(
				requester,
				allProducts
			);
			this.setState({
				allProducts,
				displayedProducts: allProducts,
				isLoading: false
			});
			for (i = 0; i < requester.orderHistory.completed.length; i++) {
				if (requester.orderHistory.completed[i].review.stars === null) {
					productId = requester.orderHistory.completed[i].serviceId;
					this.setState({ isReviewDue: true });
					break;
				}
			}
		}
	}

	//Function searches through the array of products and displays the results by changing the state
	renderSearch() {
		this.setState({ isLoading: true });
		//If there is only one character typed into the search, it will simply display the results
		//that start with that character. Otherwise, it will search for anything that includes that
		//character
		let text = this.state.search;
		text = text.trim().toLowerCase();
		const { allProducts } = this.state;
		const newProducts = [];
		for (const product of allProducts) {
			const productName = product.serviceTitle.trim().toLowerCase();
			const business = product.offeredByName.trim().toLowerCase();
			const category = product.category.trim().toLowerCase();
			if (productName.includes(text) || business.includes(text) || category.includes(text)) {
				newProducts.push(product);
			}
		}

		//If new products is empty or the search is empty, all the categories will be displayed.
		//Otherwise, the results will be displayed
		if (newProducts.length === 0 || text.length === 0) {
			this.setState({
				displayedProducts: this.state.allProducts
			});
		} else {
			this.setState({ displayedProducts: newProducts });
		}
		//This timeout is necessary so that images time to be "undownloaded" --> They only need a timeout
		//of 1, but to make it look good, 500 is ideal
		this.timeoutHandle = setTimeout(() => {
			this.setState({ isLoading: false });
		}, 500);
	}

	render() {
		//Filters the products and removes any that are posted by blocked users
		let { requester } = this.props.navigation.state.params;
		let { displayedProducts, allProducts } = this.state;

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
				onChange={(isOpen) => {
					this.setState({ isOpen });
				}}
				isOpen={this.state.isOpen}
				onChange={(isOpen) => {
					this.setState({ isOpen });
				}}
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
						onSubmitEditing={() => {
							this.renderSearch();
						}}
					/>
					<ScrollView
						contentContainerStyle={{
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column'
						}}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}>
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
							services={displayedProducts}
						/>
					</ScrollView>
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

					<ReviewPopup
						isVisible={this.state.isReviewDue}
						onFinishRating={(rating) => this.props.onFinishRating(rating)}
						title={strings.LeaveAReview}
						message={strings.BusinessName}
						confirmText={strings.Submit}
						cancelText={strings.Skip}
						clickOutside={true}
						value={this.state.reviewComment}
						placeholder={strings.AnyCommentsQuestion}
						onChangeText={(input) => this.setState({ reviewComment: input })}
						confirmOnPress={async () => {
							FirebaseFunctions.submitReview(this.productId, this.state.rating, hisstate.reviewComment);
						}}
						cancelOnPress={() => {
							this.setState({ isReviewDue: false });
							requester.orderHistory.completed[this.productForReview].review = 'None';
						}}
					/>
				</HelpView>
			</SideMenu>
		);
	}
}

//Exports the screen
export default featuredScreen;
