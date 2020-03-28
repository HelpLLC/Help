//This screen will be where the customer will be able to view a profile of a company offering services.
//They'll see its name & description, be able to message it and view all of its specific services.
//In the future we want to add reviews and such features.
//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the
//customer to request the service.
import React, { Component } from 'react';
import { View } from 'react-native';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpAlert from '../components/HelpAlert';
import strings from 'config/strings';
import TopBanner from '../components/TopBanner';
import HelpSearchBar from '../components/HelpSearchBar';

class companyProfileScreen extends Component {
	//State of the screen
	state = {
		isLoading: true,
		services: [],
		isErrorVisible: false,
		search: '',
		displayedServices: ''
	};

	//This will fetch the data about this business and his services from firestore
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CustomerBusinessProfileScreen', 'businessProfileScreen');

		const { business, customer } = this.props.navigation.state.params;
		this.setState({
			business,
			customer,
			services: business.services,
			isLoading: false,
			displayedServices: business.services
		});

		return 0;
	}

	renderSearch() {
		this.setState({ isLoading: true });
		//If there is only one character typed into the search, it will simply display the results
		//that start with that character. Otherwise, it will search for anything that includes that
		//character
		let text = this.state.search;
		text = text.trim().toLowerCase();
		const { services } = this.state;
		const newServices = [];
		for (const service of services) {
			const serviceName = service.serviceTitle.trim().toLowerCase();
			const category = service.category.trim().toLowerCase();
			if (serviceName.includes(text) || category.includes(text)) {
				newServices.push(service);
			}
		}

		//If new services is empty or the search is empty, all the categories will be displayed.
		//Otherwise, the results will be displayed
		if (newServices.length === 0 || text.length === 0) {
			this.setState({
				displayedServices: services
			});
		} else {
			this.setState({ displayedServices: newServices });
		}
		//This timeout is necessary so that images time to be "undownloaded" --> They only need a timeout
		//of 1, but to make it look good, 500 is ideal
		this.timeoutHandle = setTimeout(() => {
			this.setState({ isLoading: false });
		}, 500);
	}

	render() {
		const { isLoading, services } = this.state;
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={' '}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
						<LoadingSpinner isVisible={isLoading} />
					</View>
				</HelpView>
			);
		} else {
			const { business, customer } = this.props.navigation.state.params;
			const { search, displayedServices } = this.state;
			return (
				<View style={screenStyle.container}>
					<TopBanner
						title={business.businessName}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
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
					<NarrowServiceCardList
						navigation={this.props.navigation}
						services={displayedServices}
						customerID={customer.customerID}
					/>
					<HelpAlert
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
}

//Exports the screen
export default companyProfileScreen;
