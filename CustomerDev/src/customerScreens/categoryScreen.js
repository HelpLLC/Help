//This screen represents the screen that will show a specfic category
import React, { Component } from 'react';
import { View } from 'react-native';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import { screenWidth, screenHeight } from 'config/dimensions';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import TopBanner from '../components/TopBanner';
import HelpSearchBar from '../components/HelpSearchBar';
import strings from '../../config/strings';

class categoryScreen extends Component {
	state = {
		isOpen: false,
		isLoading: true,
		searchedProducts: null,
		products: '',
		search: ''
	};

	//Fetches the products for this category
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CategoryScreen', 'categoryScreen');
		//Gets products from parameters
		const { allProducts, categoryName, requesterID } = this.props.navigation.state.params;
		const requester = await FirebaseFunctions.call('getCustomerByID', { customerID });
		//Gets products from categories
		let products = await FirebaseFunctions.call('getProductsByCategory', {
			allProducts,
			categoryName
		});
		products = await FirebaseFunctions.call('filterProductsByRequesterBlockedUsers', {
			requester,
			products
		});

		//Filters the product so that only ones that nearby are shown (50)
		products = await FirebaseFunctions.call('filterProductsByRequesterLocation', {
			requester,
			products
		});

		//sets the state
		this.setState({
			products,
			requester,
			displayedProducts: products,
			isLoading: false
		});

		return 0;
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
			const productName = product.serviceTitle.trim().toLowerCase();
			const business = product.offeredByName.trim().toLowerCase();
			if (productName.includes(text) || business.includes(text)) {
				newProducts.push(product);
			}
		}

		//If new products is empty or the search is empty, all the categories will be displayed.
		//Otherwise, the results will be displayed
		if (newProducts.length === 0 || text.length === 0) {
			this.setState({
				displayedProducts: this.state.products
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
		//Fetches the correct params
		const { categoryName } = this.props.navigation.state.params;
		const { displayedProducts, search, requester } = this.state;
		//If loading it shows loading spinner
		if (this.state.isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={categoryName}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}

		return (
			<HelpView style={screenStyle.container}>
				{/* Header */}
				<TopBanner
					title={categoryName}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<HelpSearchBar
					placeholderText={strings.SearchIn + ' ' + categoryName.toLowerCase() + '...'}
					value={search}
					onChangeText={(text) => {
						//Logic for searching
						this.setState({ search: text });
					}}
					onSubmitEditing={() => {
						this.renderSearch();
					}}
				/>
				{/* Shows all Products in the category (or search results) */}
				<NarrowServiceCardList
					requesterID={requester.requesterID}
					navigation={this.props.navigation}
					services={displayedProducts}
				/>
			</HelpView>
		);
	}
}

//exports screen
export default categoryScreen;
