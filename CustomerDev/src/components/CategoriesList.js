//This component will render a 2 column list of categories consisting of CategoryCards. The only prop it will take is the array of
//categories. Then it just uses that to render the 2 column list.
import React, { Component, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import CategoryCard from './CategoryCard';
import PropTypes from 'prop-types';
import { screenWidth, screenHeight } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';

//Defines the function
export default function CategoriesList(props) {
	const [isLoading, setIsLoading] = useState(true);
	const [isErrorVisible, setIsErrorVisible] = useState(false);

	//This function goes to a screen of a specific category
	const goToCategoryScreen = (categoryName) => {
		FirebaseFunctions.analytics.logEvent(categoryName + '_category_clicked');
		const { allServices, customerID } = props;
		try {
			this.props.navigation.push('CategoryScreen', {
				categoryName: categoryName,
				customerID: customerID,
				allServices: allServices,
			});
		} catch (error) {
			setIsLoading(false);
			setIsErrorVisible(true);
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'Categories Screen',
					userID: 'c-' + customerID,
				},
			});
		}
	};

	//Sets the PropTypes for this component. There will be and it is required. "categories" which will be of type array & customerID
	//who will be the one requesting the categories
	CategoriesList.propTypes = {
		categories: PropTypes.array.isRequired,
		customerID: PropTypes.string.isRequired,
	};

	//Fetches the array of categories from the props
	const { categories } = props;

	return (
		<FlatList
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			data={categories}
			numColumns={2}
			keyExtractor={(item) => item.categoryName}
			maxToRenderPerBatch={2}
			initialNumToRender={2}
			windowSize={3}
			showsVerticalScrollIndicator={false}
			renderItem={({ item, index }) => (
				<View
					key={index}
					style={{
						flexDirection: 'row',
					}}>
					{
						//Adds a space before the first service if there is only one service because it otherwise has justify
						//content of flex start
						categories.length === 1 ? <View style={{ width: screenWidth * 0.03 }} /> : <View></View>
					}
					<CategoryCard
						categoryTitle={item.categoryName}
						imageFunction={async () => {
							//Passes in the function to retrieve the image of this category
							return await FirebaseFunctions.call('getCategoryImageByID', { ID: item.imageName });
						}}
						numCurrentRequests={0}
						//Passes all of the necessary props to the actual screen that contains
						//more information about the service
						onPress={async () => {
							await this.goToCategoryScreen(item.categoryName);
						}}
					/>
					{
						//Adds a space in between each column
						index % 2 === 0 && categories.length > 1 ? (
							<View style={{ width: screenWidth * 0.03 }} />
						) : (
							<View></View>
						)
					}
				</View>
			)}
		/>
	);
}
