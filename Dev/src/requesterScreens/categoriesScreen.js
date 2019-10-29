//This screen will display the list of categories in a two column display by leveraging the categoriesList
//component
import React, { Component } from 'react';
import SideMenu from 'react-native-side-menu';
import CategoriesList from '../components/CategoriesList';
import { View, Text, Dimensions } from 'react-native';
import HelpView from '../components/HelpView';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import LeftMenu from './LeftMenu';
import fontStyles from 'config/styles/fontStyles';
import HelpSearchBar from '../components/HelpSearchBar';
import colors from 'config/colors';

export default class categoriesScreen extends Component {
	//The state controlling the Loading of this screen
	state = {
		isLoading: true,
		categories: null,
		requester: this.props.navigation.state.params.requester,
		isOpen: false,
		search: '',
		allCategories: null
	};

	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CategoriesScreen', 'categoriesScreen');
		let categories = await FirebaseFunctions.getCategoryObjects();
		this.setState({
			categories,
			allCategories: categories,
			isLoading: false
		});
	}

	//Function searches through the array of categories and displays the results by changing the state
	renderSearch() {
		this.setState({ isLoading: true });
		//If there is only one character typed into the search, it will simply display the results
		//that start with that character. Otherwise, it will search for anything that includes that
		//character
		let text = this.state.search;
		text = text.trim().toLowerCase();
		const { categories } = this.state;
		const newCategories = [];
		for (const category of categories) {
			const categoryName = category.categoryName.trim().toLowerCase();
			if (categoryName.includes(text)) {
				newCategories.push(category);
			}
		}

		//If new categories is empty or the search is empty, all the categories will be displayed.
		//Otherwise, the results will be displayed
		if (newCategories.length === 0 || text.length === 0) {
			this.setState({
				categories: this.state.allCategories
			});
		} else {
			this.setState({ categories: newCategories });
		}
		//This timeout is necessary so that images time to be "undownloaded" --> They only need a timeout
		//of 1, but to make it look good, 500 is ideal
		this.timeoutHandle = setTimeout(() => {
			this.setState({ isLoading: false });
		}, 500);
	}

	render() {
		if (this.state.isLoading === true) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<LoadingSpinner isVisible={true} />
				</View>
			);
		} else {
			const { search } = this.state;

			return (
				<SideMenu
					isOpen={this.state.isOpen}
					menu={
						<LeftMenu
							navigation={this.props.navigation}
							allProducts={this.props.navigation.state.params.allProducts}
							requester={this.state.requester}
						/>
					}>
					<HelpView style={screenStyle.container}>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								FirebaseFunctions.analytics.logEvent('sidemenu_opened_from_categories');
								this.setState({ isOpen: true });
							}}
							size={30}
							title={strings.Categories}
						/>
						<HelpSearchBar
							placeholderText={strings.SearchCategoriesDotDotDot}
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
							<Text style={fontStyles.bigTextStyleBlue}>{strings.FeaturedCategories}</Text>
						</View>
						<CategoriesList
							categories={this.state.categories}
							requester={this.state.requester}
							allProducts={this.props.navigation.state.params.allProducts}
							navigation={this.props.navigation}
						/>
					</HelpView>
				</SideMenu>
			);
		}
	}
}
