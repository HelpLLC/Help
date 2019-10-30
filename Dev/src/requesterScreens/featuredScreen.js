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

class featuredScreen extends Component {
	state = {
		isLoading: true,
		products: null,
		isOpen: false,
		search: '',
		allProducts: ''
	};

	//Filters the products by ones that the user has blocked, and also returns only the products that are being offered within 50 miles
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('FeaturedScreen', 'featuredScreen');

		//Filters the products and removes any that are posted by blocked users
		let { allProducts, requester } = this.props.navigation.state.params;
		allProducts = allProducts.filter((product) => {
			return !requester.blockedUsers.includes(product.offeredByID);
		});
		allProducts = await FirebaseFunctions.filterProductsByRequesterLocation(requester, allProducts);
		this.setState({
			allProducts,
			isLoading: false
		});
	}
	
	//Function searches through the array of products and displays the results by changing the state
	renderSearch() {
		this.setState({ isLoading: true });
		//If there is only one character typed into the search, it will simply display the results
		//that start with that character. Otherwise, it will search for anything that includes that
		//character
		let text = this.state.search;
		text = text.trim().toLowerCase();
		const { products } = this.state;
		const newProducts = [];
		for (const product of products) {
			const productName = product.serviceName.trim().toLowerCase();
			const business = product.offeredByName.trim().toLowerCase();
			if (productName.includes(text) || business.includes(text)) {
				newProducts.push(product);
			}
		}

		//If new products is empty or the search is empty, all the categories will be displayed.
		//Otherwise, the results will be displayed
		if (newProducts.length === 0 || text.length === 0) {
			this.setState({
				products: this.state.allProducts
			});
		} else {
			this.setState({ products: newProducts });
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
						onSubmitEditing={() => {
							this.renderSearch();
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
				</HelpView>
			</SideMenu>
		);
	}
}

//Exports the screen
export default featuredScreen;
