//This screen will be where the requester will be able to view a profile of a company offering services.
//They'll see its name & description, be able to message it and view all of its specific products.
//In the future we want to add reviews and such features.
//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the
//requester to request the service.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import colors from 'config/colors';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import fontStyles from 'config/styles/fontStyles';
import { Icon } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import LoadingSpinner from '../components/LoadingSpinner';
import OptionPicker from '../components/OptionPicker';
import ErrorAlert from '../components/ErrorAlert';
import strings from 'config/strings';
import TopBanner from '../components/TopBanner';
import HelpSearchBar from '../components/HelpSearchBar';

class companyProfileScreen extends Component {
  //This constructor and componentDidMount will wait until all the products loaded if there are any
  constructor() {
    super();
    this.state = {
      isLoading: true,
      serviceIDsLength: 0,
      providerProducts: [],
      isErrorVisible: false,
      isCompanyReportedVisible: false,
      isBlockCompanyVisible: false,
      search: '',
      displayedProducts: ''
    };
  }

  //Fetches the data associated with this screen
  async fetchDatabaseData() {
    const { provider } = this.props.navigation.state.params;
    this.setState({ provider });
    if (provider.serviceIDs.length === 0) {
      this.setState({ isLoading: false });
    } else {
      try {
        const serviceIDs = provider.serviceIDs;
        for (const ID of serviceIDs) {
          const service = await FirebaseFunctions.getServiceByID(ID);
          const newArrayOfProducts = this.state.providerProducts;
          newArrayOfProducts.push(service);
          this.setState({
            providerProducts: newArrayOfProducts,
            displayedProducts: newArrayOfProducts
          });
        }
        this.setState({
          isLoading: false,
          serviceIDsLength: serviceIDs.length
        });
      } catch (error) {
        this.setState({ isLoading: false, isErrorVisible: true });
        FirebaseFunctions.logIssue(error, {
          screen: 'CompanyProfileScreen',
          userID: 'r-' + this.props.navigation.state.params.requesterID,
          companyID: provider.providerID
        });
      }
    }
    return 0;
  }

  //This will fetch the data about this provider and his products from firestore
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen('RequesterCompanyProfileScreen', 'companyProfileScreen');

    this.setState({ isLoading: true });
    //Adds the listener to add the listener to refetch the data once this component is returned to
    this.willFocusListener = this.props.navigation.addListener('willFocus', async () => {
      await this.fetchDatabaseData();
    });
  }

  //Removes the listener when the screen is switched away from
  componentWillUnmount() {
    this.willFocusListener.remove();
  }

  //This method will open a chat with the provider and go to that chat
  messageProvider() {
    const { provider, requester } = this.props.navigation.state.params;
    this.props.navigation.push('MessagingScreen', {
      title: provider.companyName,
      providerID: provider.providerID,
      requesterID: requester.requesterID,
      userID: requester.requesterID
    });
  }

  //This method will make sure that the company is blocked from this requester's perspective
  async blockCompany() {
    const { provider, requester } = this.props.navigation.state.params;

    //First blocks the user
    this.setState({ isLoading: true });
    await FirebaseFunctions.blockCompany(requester, provider);

    //Navigates back to the request screen
    try {
      const newRequesterObject = await FirebaseFunctions.getRequesterByID(requester.requesterID);
      const allProducts = await FirebaseFunctions.getAllProducts();
      this.props.navigation.push('FeaturedScreen', {
        requester: newRequesterObject,
        allProducts
      });
    } catch (error) {
      this.setState({ isLoading: false, isErrorVisible: true });
    }
  }

  //This method will allow the requester to report the company which will then be reviewed by
  //the developers
  reportCompany() {
    const { provider, requester } = this.props.navigation.state.params;
    FirebaseFunctions.reportIssue(requester, {
      report: 'Report against a company',
      companyID: provider.providerID,
      companyName: provider.companyName
    });
    this.setState({ isCompanyReportedVisible: true });
  }

  renderSearch() {
    this.setState({ isLoading: true });
    //If there is only one character typed into the search, it will simply display the results
    //that start with that character. Otherwise, it will search for anything that includes that
    //character
    let text = this.state.search;
    text = text.trim().toLowerCase();
    const { providerProducts } = this.state;
    const newProducts = [];
    for (const product of providerProducts) {
      const productName = product.serviceTitle.trim().toLowerCase();
      const business = product.offeredByName.trim().toLowerCase();
      const category = product.category.trim().toLowerCase();
      if (productName.includes(text) || business.includes(text) || category.includes(text)) {
        newProducts.push(product);
      }
    }

    //If new products is empty or the search is empty, all the categories will be displayed.
    //Otherwise, the results will be displayed
    if (newProducts.length === 0 || text.length === 0) {
      this.setState({
        displayedProducts: this.state.providerProducts
      });
    } else {
      this.setState({ displayedProducts: newProducts });
    }
    //This timeout is necessary so that images time to be "undownloaded" --> They only need a timeout
    //of 1, but to make it look good, 500 is ideal
    this.timeoutHandle = setTimeout(() => {
      this.setState({ isLoading: false });
    }, 500);
  }


  render() {
    const { isLoading, providerProducts, serviceIDsLength } = this.state;
    if (isLoading === true || (providerProducts.length == 0 && serviceIDsLength > 0)) {
      return (
        <HelpView style={screenStyle.container}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <LoadingSpinner isVisible={isLoading} />
          </View>
        </HelpView>
      );
    } else {
      const { provider, requester } = this.props.navigation.state.params;
      const { search, displayedProducts } = this.state;
      return (
        <HelpView style={screenStyle.container}>
          <TopBanner
            title={provider.companyName}
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
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <NarrowServiceCardList
              navigation={this.props.navigation}
              services={displayedProducts}
              requester={requester}
            />
          </ScrollView>

          <ErrorAlert
            isVisible={this.state.isErrorVisible}
            onPress={() => {
              this.setState({ isErrorVisible: false });
            }}
            title={strings.Whoops}
            message={strings.SomethingWentWrong}
          />
        </HelpView>
      );
    }
  }
}

//Exports the screen
export default companyProfileScreen;
