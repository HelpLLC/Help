//This component will take in an array of services and render them in a list of ServiceCards that will be one column wide.
import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import ServiceCard from './ServiceCard';
import PropTypes from 'prop-types';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from './ErrorAlert';
import strings from 'config/strings';

//Defines the class
class ServiceCardList extends Component {
	//The initial state to make sure the error is not visible
	state = {
		isErrorVisible: false
	};

	render() {
		//Fetches the array of services from the props
		const { services } = this.props;

		const rowsOfServices = [];

		//The following for loop goes through the array of services and constructs a view that is just a one column list
		//of the ServiceCards.
		for (let i = 0; i < services.length; i++) {
			rowsOfServices.push(
				<View
					key={i}
					style={{
						flexDirection: 'row',
						height: Dimensions.get('window').height * 0.33
					}}>
					<ServiceCard
						key={i}
						serviceTitle={services[i].serviceTitle}
						serviceDescription={services[i].serviceDescription}
						price={this.props.dateCompleted ? services[i].dateRequested : services[i].pricing}
						imageFunction={async () => {
							//Passes in the function to retrieve the image of this product
							return await FirebaseFunctions.getProductImageByID(services[i].serviceID);
						}}
						numCurrentRequests={services[i].requests.currentRequests.length}
						onPress={() => {
							this.props.onPress(services[i]);
						}}
					/>
				</View>
			);
		}

		return (
			<ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
				{rowsOfServices}
				<ErrorAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
			</ScrollView>
		);
	}
}

//Sets the PropTypes for this component. There will be and it is required. "services" which will be of type array. A function will be
//assed in to determine what to do when a specific service card has been clicked. It will also take in an optional boolean to display
//the date completed of a product instead of a price (used in RequesterOrderHistoryScreen)
ServiceCardList.propTypes = {
	services: PropTypes.array.isRequired,
	onPress: PropTypes.func,
	dateCompleted: PropTypes.bool
};

//Exports the module
export default ServiceCardList;
