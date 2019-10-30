//This screen represents the screen that will show a specfic category
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
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
		const { allProducts, categoryName, requester } = this.props.navigation.state.params;
		//Gets products from categories
		let products = await FirebaseFunctions.getProductsByCategory(allProducts, categoryName);
		products = products.filter((product) => {
			return !requester.blockedUsers.includes(product.offeredByID);
		});

		//Filters the product so that only ones that nearby are shown (50)
		products = await FirebaseFunctions.filterProductsByRequesterLocation(requester, products);

		//sets the state
		this.setState({
			products,
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
		const { searchedProducts } = this.state;
		const newProducts = [];
		for (const product of searchedProducts) {
			const productName = product.productName.trim().toLowerCase();
			if (productName.includes(text)) {
				newProducts.push(product);
			}
		}

		//If new products is empty or the search is empty, all the categories will be displayed.
		//Otherwise, the results will be displayed
		if (newProducts.length === 0 || text.length === 0) {
			this.setState({
				searchedProducts: this.state.products
			});
		} else {
			this.setState({ searchedProducts: newProducts });
		}
		//This timeout is necessary so that images time to be "undownloaded" --> They only need a timeout
		//of 1, but to make it look good, 500 is ideal
		this.timeoutHandle = setTimeout(() => {
			this.setState({ isLoading: false });
		}, 500);
	}

	render() {
		//Fetches the correct params
		const { requester, categoryName } = this.props.navigation.state.params;
		const { products, search } = this.state;
		//If loading it shows loading spinner
		if (this.state.isLoading === true) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<LoadingSpinner isVisible={true} />
				</View>
			);
		}

		return (
			<HelpView style={screenStyle.container}>
				{/* Header */}
				<TopBanner title={categoryName} leftIconName='angle-left' leftOnPress={() => this.props.navigation.goBack()} />
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
				{/* Shows all Products */}
				<NarrowServiceCardList requester={requester} navigation={this.props.navigation} services={products} />
			</HelpView>
		);
	}
}

//exports screen
export default categoryScreen;
