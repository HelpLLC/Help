//This component will take in an array of services and render them in a list of ServiceCards that will be one column wide.
import React, { Component } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import ServiceCard from './ServiceCard';
import PropTypes from 'prop-types';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { screenWidth, screenHeight } from 'config/dimensions';

//Defines the function
export default function ServiceCardList(props) {
	//Fetches the array of services from the props
	const { services } = props;

	//Sets the PropTypes for this component. There will be and it is required. "services" which will be of type array. A function will be
	//assed in to determine what to do when a specific service card has been clicked. It will also take in an optional boolean to display
	//the date completed of a product instead of a price (used in RequesterOrderHistoryScreen)
	ServiceCardList.propTypes = {
		services: PropTypes.array.isRequired,
		onPress: PropTypes.func,
		dateCompleted: PropTypes.bool,
		currentRequests: PropTypes.bool,
	};

	return (
		<FlatList
			contentContainerStyle={{
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
			showsHorizontalScrollIndicator={false}
			data={services}
			keyExtractor={(item, index) => item.serviceID + index.toString()}
			showsVerticalScrollIndicator={false}
			renderItem={({ item, index }) => (
				<View
					key={index}
					style={{
						flexDirection: 'row',
						height: screenHeight * 0.33,
					}}>
					<ServiceCard
						serviceTitle={item.serviceTitle}
						serviceDescription={item.serviceDescription}
						price={this.props.dateCompleted ? item.dateRequested : item.priceText}
						imageFunction={async () => {
							//Passes in the function to retrieve the image of this product
							return await FirebaseFunctions.call('getServiceImageByID', {
								serviceID: item.serviceID,
							});
						}}
						numCurrentRequests={this.props.currentRequests === false ? 0 : item.numCurrentRequests}
						onPress={() => {
							this.props.onPress(item);
						}}
					/>
				</View>
			)}
		/>
	);
}
