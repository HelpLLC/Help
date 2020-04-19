//This screen represents the main screen that is launched once the customer logs in. Here will be displayed the featured services
//where customers will be able to click on them to request them. The side menu  will also be accessible from this screen
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import { screenWidth, screenHeight } from 'config/dimensions';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner/TopBanner';
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
		allServices: '',
		displayedServices: '',
		reviewError: false,
		isReviewDueName: '',
		isReviewDueID: '',
	};

	//Filters the services by ones that the user has blocked, and also returns only the services that are being offered within 50 miles
	async componentDidMount() {
		this.setState({ isLoading: true });
		FirebaseFunctions.setCurrentScreen('FeaturedScreen', 'featuredScreen');

		//Filters the services and removes any that are posted by blocked users
		let { allServices, customer } = this.props.navigation.state.params;

		allServices = allServices.filter(
			(element) => customer.blockedBusinesses.indexOf(element.businessID) === -1
		);

		if (customer.isReviewDue.length > 0) {
			const requestID = customer.isReviewDue[0];
			const request = await FirebaseFunctions.call('getRequestByID', { requestID });
			this.setState({
				isReviewDue: true,
				request,
				allServices,
				customer,
				displayedServices: allServices,
				isLoading: false,
			});
		} else {
			this.setState({
				allServices,
				customer,
				displayedServices: allServices,
				isLoading: false,
			});
		}
	}

	//Function searches through the array of services and displays the results by changing the state
	renderSearch() {
		this.setState({ isLoading: true });
		//If there is only one character typed into the search, it will simply display the results
		//that start with that character. Otherwise, it will search for anything that includes that
		//character
		let text = this.state.search;
		text = text.trim().toLowerCase();
		const { allServices } = this.state;
		const newServices = [];
		for (const service of allServices) {
			const serviceTitle = service.serviceTitle.trim().toLowerCase();
			const business = service.businessID.trim().toLowerCase();
			const category = service.category.trim().toLowerCase();
			if (serviceTitle.includes(text) || business.includes(text) || category.includes(text)) {
				newServices.push(service);
			}
		}

		//If new service is empty or the search is empty, all the services will be displayed.
		//Otherwise, the results will be displayed
		if (newServices.length === 0 || text.length === 0) {
			this.setState({
				displayedServices: allServices,
			});
		} else {
			this.setState({ displayedServices: newServices });
		}
		//This timeout is necessary so that images time to be "undownloaded" --> They only need a timeout
		//of 1, but to make it look good, 500 is ideal
		this.timeoutHandle = setTimeout(() => {
			this.setState({ isLoading: false });
		}, 500);
	}

	render() {
		let { displayedServices, allServices, customer } = this.state;

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
						allServices={allServices}
						customer={customer}
					/>
				}>
				<View style={screenStyle.container}>
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
							height: screenHeight * 0.05,
							width: screenWidth * 0.9,
							borderColor: colors.lightGray,
							borderBottomColor: colors.lightBlue,
							borderWidth: 0.5,
							justifyContent: 'center',
							alignItems: 'flex-start',
						}}>
						<Text style={fontStyles.bigTextStyleBlue}>{strings.FeaturedServices}</Text>
					</View>
					<NarrowServiceCardList
						customerID={customer.customerID}
						navigation={this.props.navigation}
						services={displayedServices}
					/>
					<ReviewPopup
						isVisible={this.state.isReviewDue}
						onFinishRating={(stars) => this.setState({ stars })}
						title={strings.LeaveAReview}
						message={this.state.request ? this.state.request.serviceTitle : ''}
						confirmText={strings.Submit}
						cancelText={strings.Skip}
						imageFunction={async () => {
							return await FirebaseFunctions.call('getServiceImageByID', {
								serviceID: this.state.request.serviceID,
							});
						}}
						clickOutside={true}
						value={this.state.comment}
						placeholder={strings.LeaveAReviewDotDotDot}
						onChangeText={(input) => this.setState({ comment: input })}
						confirmOnPress={async () => {
							//If a comment is inputted, then the user must also give a star rating. But users
							//can give a star rating without a comment
							if (
								(this.state.comment.trim().length > 0 && this.state.stars === 0) ||
								this.state.stars === 0
							) {
								this.setState({ reviewError: true, isReviewDue: false });
							} else {
								try {
									const { request } = this.state;
									FirebaseFunctions.call('reviewService', {
										serviceID: request.serviceID,
										customerID: request.customerID,
										customerName: request.customerName,
										stars: this.state.stars,
										reviewDate: new Date().toLocaleDateString('en-US'),
										comment: this.state.comment,
										requestID: request.requestID,
									});
								} catch (error) {
									FirebaseFunctions.call('logIssue', {
										error,
										userID: {
											screen: 'Featured Screen',
											userID: 'c-' + customer.customerID,
										},
									});
								}
								this.setState({ isReviewDue: false });
							}
						}}
						cancelOnPress={() => {
							this.setState({ isReviewDue: false });
							try {
								const { request } = this.state;
								FirebaseFunctions.call('skipReview', {
									requestID: request.requestID,
									customerID: request.customerID,
								});
							} catch (error) {
								FirebaseFunctions.call('logIssue', {
									error,
									userID: {
										screen: 'Featured Screen',
										userID: 'c-' + this.state.customer.customerID,
									},
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
				</View>
			</SideMenu>
		);
	}
}
