//This component will render a 2 column list of services using the narrowServiceCard. The only prop it will take is the array of
//services. Then it just uses that render the 2 column list.
import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import NarrowServiceCard from './NarrowServiceCard';
import PropTypes from 'prop-types';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from './ErrorAlert';
import strings from 'config/strings';

//Defines the class
class NarrowServiceCardList extends Component {
	//This function goes to a screen of a specific service based on its index within the services array
	async goToServiceScreen(index) {
		const { services, requester } = this.props;
		try {
			const provider = await FirebaseFunctions.getProviderByID(services[index].offeredByID);
			this.props.navigation.push('RequesterServiceScreen', {
				productID: services[index].serviceID,
				requester,
				provider
			});
		} catch (error) {
			this.setState({ isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'Featured Screen',
				userID: 'r-' + requester.requesterID
			});
		}
	}

	//The initial state to make sure the error is not visible
	state = {
		isErrorVisible: false
	};

	render() {
		//Fetches the array of services from the props along with the requester object that is signed in
		const { services } = this.props;

		const rowsOfServices = [];

		//The following for loop goes through the array of services and constructs a view with two columns
		//that has a NarrowServiceCard for each service in the arrary. The if statement deals with if the
		//the services array has an odd number of elements, so it doesn't index out of bounds
		for (let i = 0; i < services.length; i += 2) {
			if (i === services.length - 1) {
				rowsOfServices.push(
					<View
						key={i}
						style={{
							flexDirection: 'row',
							height: Dimensions.get('window').height * 0.35
						}}>
						<NarrowServiceCard
							serviceTitle={services[i].serviceTitle}
							price={this.props.dateRequested ? services[i].dateRequested : services[i].pricing}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this product
								return await FirebaseFunctions.getProductImageByID(services[i].serviceID);
							}}
							numCurrentRequests={0}
							//Passes all of the necessary props to the actual screen that contains
							//more information about the service
							onPress={async () => {
								await this.goToServiceScreen(i);
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
						<NarrowServiceCard
							serviceTitle={services[i].serviceTitle}
							price={this.props.dateRequested ? services[i].dateRequested : services[i].pricing}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this product
								return await FirebaseFunctions.getProductImageByID(services[i].serviceID);
							}}
							numCurrentRequests={0}
							//Passes all of the necessary props to the actual screen that contains
							//more information about the service
							onPress={async () => {
								await this.goToServiceScreen(i);
							}}
						/>
						<View style={{ width: Dimensions.get('window').width * 0.03 }}></View>
						<NarrowServiceCard
							serviceTitle={services[i + 1].serviceTitle}
							price={
								this.props.dateRequested ? services[i + 1].dateRequested : services[i + 1].pricing
							}
							imageFunction={async () => {
								//Passes in the function to retrieve the image of this product
								return await FirebaseFunctions.getProductImageByID(services[i + 1].serviceID);
							}}
							numCurrentRequests={0}
							//Passes all of the necessary props to the actual screen that contains
							//more information about the service
							onPress={async () => {
								await this.goToServiceScreen(i + 1);
							}}
						/>
					</View>
				);
			}
		}

		return (
			<View>
				{rowsOfServices}
				<ErrorAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
			</View>
		);
	}
}

//Sets the PropTypes for this component. There will be and it is required. "services" which will be of type array & requester object
//who will be the one requesting the services.  It will also take in an optional boolean to display the date requester of a product
//instead of a price (used in RequesterOrderHistoryScreen)
NarrowServiceCardList.propTypes = {
	services: PropTypes.array.isRequired,
	requester: PropTypes.object.isRequired,
	dateRequested: PropTypes.bool
};

//Exports the module
export default NarrowServiceCardList;
