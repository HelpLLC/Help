//This screen represents the screen that will show a specfic category
import React, { Component } from 'react';
import { View } from 'react-native';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import { screenWidth, screenHeight } from 'config/dimensions';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import TopBanner from '../components/TopBanner/TopBanner';
import HelpSearchBar from '../components/HelpSearchBar';
import strings from '../../config/strings';

class categoryScreen extends Component {
	state = {
		isOpen: false,
		isLoading: true,
		searchServices: null,
		services: '',
		search: '',
		displayedServices: ''
	};

	//Fetches the services for this category
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CategoryScreen', 'categoryScreen');
		//Gets services from parameters
		const { allServices, categoryName, customerID } = this.props.navigation.state.params;
		const customer = await FirebaseFunctions.call('getCustomerByID', { customerID });
		//Gets services from categories
		let services = await FirebaseFunctions.call('getServicesByCategory', {
			categoryName
		});
		services = services.filter(
			(service) => !customer.blockedBusinesses.includes(service.businessID)
		);
		//sets the state
		this.setState({
			services,
			customer,
			displayedServices: services,
			isLoading: false
		});

		return 0;
	}

	//Function searches through the array of services and displays the results by changing the state
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
			const business = service.businessName.trim().toLowerCase();
			if (serviceName.includes(text) || business.includes(text)) {
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
		//Fetches the correct params
		const { categoryName } = this.props.navigation.state.params;
		const { displayedServices, search, customer } = this.state;
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
			<View style={screenStyle.container}>
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
				{/* Shows all Services in the category (or search results) */}
				<NarrowServiceCardList
					customerID={customer.customerID}
					navigation={this.props.navigation}
					services={displayedServices}
				/>
			</View>
		);
	}
}

//exports screen
export default categoryScreen;
