//This screen represents the main screen that is launched once the requester logs in. Here will be displayed the featured products
//where customers will be able to click on them to request them. The side menu  will also be accessible from this screen
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import HelpAlert from '../components/HelpAlert';
import colors from 'config/colors';
import HelpSearchBar from '../components/HelpSearchBar';
import ReviewPopup from '../components/ReviewPopup';

export default class featuredScreen extends Component {
	state = {
		isLoading: true,
		isOpen: false,
		isReviewDue: false,
		stars: 0,
		comment: '',
		search: '',
		allProducts: '',
		displayedProducts: '',
		incompleteProfile: false,
		reviewError: false,
		isReviewDueName: '',
		isReviewDueID: ''
	};

	//Filters the products by ones that the user has blocked, and also returns only the products that are being offered within 50 miles
	async componentDidMount() {
		this.setState({ isLoading: true });
		FirebaseFunctions.setCurrentScreen('FeaturedScreen', 'featuredScreen');

		//Filters the products and removes any that are posted by blocked users
		let { allProducts, requester } = this.props.navigation.state.params;

		//Tests to see if the requester's account has been fully completed (used for pre-2.0 users)
		if (!FirebaseFunctions.isRequesterUpToDate(requester)) {
			this.setState({
				incompleteProfile: true,
				isLoading: false,
				displayedProducts: allProducts,
				allProducts
			});
		} else {
			allProducts = await FirebaseFunctions.filterProductsByRequesterBlockedUsers(
				requester,
				allProducts
			);
			allProducts = await FirebaseFunctions.filterProductsByRequesterLocation(
				requester,
				allProducts
			);
			const isReviewDue = await FirebaseFunctions.isReviewDue(requester.requesterID);
			if (isReviewDue !== false) {
				this.setState({
					isReviewDue: true,
					isReviewDueID: isReviewDue.serviceID,
					isReviewDueName: isReviewDue.serviceTitle,
					requestID: isReviewDue.requestID
				});
			}
			this.setState({
				allProducts,
				displayedProducts: allProducts,
				isLoading: false
			});
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
				<HelpView style={screenStyle.container}>
					<TopBanner title={strings.Featured} />
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}

		const { search } = this.state;

		return (
			<SideMenu
				onChange={(isOpen) => {
					this.setState({ isOpen });
				}}
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
						onSubmitEditing={() => {
							this.renderSearch();
						}}
					/>
					<View
						style={{
							height: Dimensions.get('window').height * 0.05,
							width: Dimensions.get('window').width * 0.9,
							borderColor: colors.lightGray,
							borderBottomColor: colors.lightBlue,
							borderWidth: 0.5,
							justifyContent: 'center',
							alignItems: 'flex-start'
						}}>
						<Text style={fontStyles.bigTextStyleBlue}>{strings.FeaturedServices}</Text>
					</View>
					<NarrowServiceCardList
						requesterID={requester.requesterID}
						navigation={this.props.navigation}
						services={displayedProducts}
					/>
					<HelpAlert
						isVisible={this.state.incompleteProfile}
						onPress={() => {
							this.setState({ incompleteProfile: false });
							this.props.navigation.push('EditRequesterProfileScreen', {
								requester: requester,
								allProducts: allProducts,
								isEditing: true
							});
						}}
						closeOnTouchOutside={false}
						title={strings.FinishCreatingYourProfile}
						message={strings.FinishCreatingYourProfileMessage}
					/>
					<ReviewPopup
						isVisible={this.state.isReviewDue}
						onFinishRating={(stars) => this.setState({ stars })}
						title={strings.LeaveAReview}
						message={this.state.isReviewDueName}
						confirmText={strings.Submit}
						cancelText={strings.Skip}
						imageFunction={async () => {
							return await FirebaseFunctions.getProductImageByID(this.state.isReviewDueID);
						}}
						clickOutside={true}
						value={this.state.comment}
						placeholder={strings.LeaveAReviewDotDotDot}
						onChangeText={(input) => this.setState({ comment: input })}
						confirmOnPress={async () => {
							//If a comment is inputted, then the user must also give a star rating. But users
							//can give a star rating without a comment
							if (this.state.comment.trim().length > 0 && this.state.stars === 0) {
								this.setState({ reviewError: true, isReviewDue: false });
							} else {
								try {
									FirebaseFunctions.submitReview(
										this.state.isReviewDueID,
										requester.requesterID,
										this.state.stars,
										this.state.comment,
										this.state.requestID
									);
								} catch (error) {
									FirebaseFunctions.logIssue(error, {
										screen: 'Featured Screen',
										userID: 'r-' + requester.requesterID
									});
								}
								this.setState({ isReviewDue: false });
							}
						}}
						cancelOnPress={() => {
							this.setState({ isReviewDue: false });
							try {
								FirebaseFunctions.skipReview(this.state.requestID, requester.requesterID);
							} catch (error) {
								FirebaseFunctions.logIssue(error, {
									screen: 'Featured Screen',
									userID: 'r-' + requester.requesterID
								});
							}
						}}
					/>
					<HelpAlert
						isVisible={this.state.reviewError}
						onPress={() => {
							this.setState({ reviewError: false, isReviewDue: true });
						}}
						title={strings.Whoops}
						message={strings.PleaseGiveAStarRatingAlongWithReview}
					/>
				</HelpView>
			</SideMenu>
		);
	}
}
