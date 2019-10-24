//This component will render a 2 column list of categories consisting of CategoryCards. The only prop it will take is the array of
//categories. Then it just uses that to render the 2 column list.
import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import CategoryCard from './CategoryCard';
import PropTypes from 'prop-types';
import FirebaseFunctions from 'config/FirebaseFunctions';

//Defines the class
class CategoriesList extends Component {
	//This function goes to a screen of a specific category
	async goToCategoryScreen(categoryName) {
		const { requester } = this.props;
		const { allProducts } = this.props;
		try {
			this.props.navigation.push('CategoryScreen', {
				categoryName: categoryName,
				requester: requester,
				allProducts: allProducts
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'Categories Screen',
				userID: 'r-' + requester.requesterID
			});
		}
	}

	render() {
		//Fetches the array of categories from the props
		const { categories } = this.props;
		const rowsOfServices = [];

		//The following for loop goes through the array of categories and constructs a view with two columns
		//that has a CategoryCard for each service in the arrary. The if statement deals with if the
		//the categories array has an odd number of elements, so it doesn't index out of bounds
		for (let i = 0; i < categories.length; i += 2) {
			if (i === categories.length - 1) {
				rowsOfServices.push(
					<View
						key={i}
						style={{
							flexDirection: 'row',
							height: Dimensions.get('window').height * 0.35
						}}>
						<CategoryCard
							categoryTitle={categories[i].categoryName}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this category
								return await FirebaseFunctions.getCategoryImageByID(categories[i].imageName);
							}}
							numCurrentRequests={0}
							//Passes all of the necessary props to the actual screen that contains
							//more information about the service
							onPress={async () => {
								await this.goToCategoryScreen(categories[i].categoryName);
							}}
						/>
						<View style={{ width: Dimensions.get('window').width * 0.03 }}></View>
						<View style={{ width: Dimensions.get('window').width * 0.45 }}></View>
					</View>
				);
			} else {
				rowsOfServices.push(
					<View
						key={i}
						style={{
							flexDirection: 'row',
							height: Dimensions.get('window').height * 0.35
						}}>
						<CategoryCard
							categoryTitle={categories[i].categoryName}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this category
								return await FirebaseFunctions.getCategoryImageByID(categories[i].imageName);
							}}
							numCurrentRequests={0}
							//Passes all of the necessary props to the actual screen that contains
							//more information about the service
							onPress={async () => {
								await this.goToCategoryScreen(categories[i].categoryName);
							}}
						/>
						<View style={{ width: Dimensions.get('window').width * 0.03 }}></View>
						<CategoryCard
							categoryTitle={categories[i + 1].categoryName}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this category
								return await FirebaseFunctions.getCategoryImageByID(categories[i + 1].imageName);
							}}
							numCurrentRequests={0}
							//Passes all of the necessary props to the actual screen that contains
							//more information about the service
							onPress={async () => {
								await this.goToCategoryScreen(categories[i + 1].categoryName);
							}}
						/>
					</View>
				);
			}
		}

		return (
			<ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
				{rowsOfServices}
			</ScrollView>
		);
	}
}

//Sets the PropTypes for this component. There will be and it is required. "categories" which will be of type array & requester object
//who will be the one requesting the categories
CategoriesList.propTypes = {
	categories: PropTypes.array.isRequired,
	requester: PropTypes.object.isRequired
};

//Exports the module
export default CategoriesList;
