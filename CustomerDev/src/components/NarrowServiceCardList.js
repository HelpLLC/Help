//This component will render a 2 column list of services using the narrowServiceCard. The only prop it will take is the array of
//services. Then it just uses that render the 2 column list.
import React, { Component } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import NarrowServiceCard from './NarrowServiceCard';
import PropTypes from 'prop-types';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { screenWidth, screenHeight } from 'config/dimensions';

//Defines the class
export default function NarrowServiceCardList(props) {
	//This function goes to a screen of a specific service based on its index within the services array
	goToServiceScreen = (index) => {
		//If an exclusive onPress function is called, that will be called instead
		if (props.onPress) {
			const { services } = props;
			props.onPress(services[index]);
		} else {
			const { services, customerID } = props;
			props.navigation.push('ServiceScreen', {
				serviceID: services[index].serviceID,
				customerID,
				businessID: services[index].businessID
					? services[index].businessID
					: props.navigation.state.params.business.businessID,
			});
		}
	};
	//Fetches the array of services from the props along with the customer object that is signed in
	const { services } = props;
	return (
		<FlatList
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			data={services}
			numColumns={2}
			maxToRenderPerBatch={2}
			initialNumToRender={2}
			windowSize={3}
			keyExtractor={(item, index) => item.serviceID + index.toString()}
			showsVerticalScrollIndicator={false}
			renderItem={({ item, index }) => (
				<View style={{ flexDirection: 'row' }}>
					{
						//Adds a space before the first service if there is only one service because it otherwise has justify
						//content of flex start
						services.length === 1 ? (
							<View style={{ width: screenWidth * 0.03 }} />
						) : (
							<View></View>
						)
					}
					<NarrowServiceCard
						serviceTitle={item.serviceTitle}
						price={props.date ? item.date : item.priceText}
						imageFunction={async () => {
							//Passes in the function to retrieve the image of this product
							return await FirebaseFunctions.call('getServiceImageByID', {
								serviceID: item.serviceID,
							});
						}}
						totalReviews={item.totalReviews}
						averageRating={item.averageRating}
						numCurrentRequests={0}
						//Passes all of the necessary props to the actual screen that contains
						//more information about the service
						onPress={() => {
							goToServiceScreen(index);
						}}
					/>
					{
						//Adds a space in between each column
						index % 2 === 0 && services.length > 1 ? (
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
