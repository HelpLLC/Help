//This screen represents the main screen that is launched once the requester logs in. Here will be displayed the featured products
//where customers will be able to click on them to request them. The side menu  will also be accessible from this screen
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import TopBanner from '../components/TopBanner';
import HelpSearchBar from '../components/HelpSearchBar';
import OptionPicker from '../components/OptionPicker';
import { Rating, AirbnbRating } from 'react-native-ratings';

class featuredScreen extends Component {
  state = {
    isLoading: true,
    isOpen: false,
    isReviewDue: true,
    search: '',
    allProducts: '',
    displayedProducts: '',
    incompleteProfile: false
  };

  //Filters the products by ones that the user has blocked, and also returns only the products that are being offered within 50 miles
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen('FeaturedScreen', 'featuredScreen');

    //Filters the products and removes any that are posted by blocked users
    let { allProducts, requester } = this.props.navigation.state.params;
    allProducts = allProducts.filter((product) => {
      return !requester.blockedUsers.includes(product.offeredByID);
    });
    allProducts = await FirebaseFunctions.filterProductsByRequesterLocation(requester, allProducts);
    //Tests to see if the requester's account has been fully completed (used for pre-2.0 users)
    if (!FirebaseFunctions.isRequesterUpToDate(requester)) {
      this.setState({
        incompleteProfile: true,
        isLoading: false,
        displayedProducts: allProducts,
        allProducts
      });
    } else {
      allProducts = allProducts.filter((product) => {
        return !requester.blockedUsers.includes(product.offeredByID);
      });
      allProducts = await FirebaseFunctions.filterProductsByRequesterLocation(
        requester,
        allProducts
      );
      this.setState({
        allProducts,
        displayedProducts: allProducts,
        isLoading: false
      });
    }
  }

  //Function searches through the array of products and displays the results by changing the state
  renderSearch() {
    this.setState({ isLoading: true });
    //If there is only one character typed into the search, it will simply display the results
    //that start with that character. Otherwise, it will search for anything that includes that
    //character
    let text = this.state.search;
    text = text.trim().toLowerCase();
    const { allProducts } = this.state;
    const newProducts = [];
    for (const product of allProducts) {
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
        displayedProducts: this.state.allProducts
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

  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }

  render() {
    //Filters the products and removes any that are posted by blocked users
    let { requester } = this.props.navigation.state.params;
    let { displayedProducts, allProducts } = this.state;

    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }

    const { search } = this.state;

    return (
      <SideMenu
        onChange={(isOpen) => {
          this.setState({ isOpen });
        }}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => {
          this.setState({ isOpen });
        }}
        menu={
          <LeftMenu
            navigation={this.props.navigation}
            allProducts={allProducts}
            requester={requester}
          />
        }>
        <HelpView style={screenStyle.container}>
          <TopBanner
            leftIconName='navicon'
            leftOnPress={() => {
              FirebaseFunctions.analytics.logEvent('sidemenu_opened_from_home');
              this.setState({ isOpen: true });
            }}
            size={30}
            title={strings.Featured}
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
          <View
            style={{
              height: Dimensions.get('window').height * 0.05,
              width: Dimensions.get('window').width * 0.93,
              justifyContent: 'flex-end',
              alignItems: 'flex-start'
            }}>
            <Text style={fontStyles.bigTextStyleBlue}>{strings.FeaturedServices}</Text>
          </View>
          <NarrowServiceCardList
            requester={requester}
            navigation={this.props.navigation}
            services={displayedProducts}
          />
          <OptionPicker
            isVisible={this.state.incompleteProfile}
            title={strings.FinishCreatingYourProfile}
            oneOption={true}
            clickOutside={false}
            message={strings.FinishCreatingYourProfileMessage}
            confirmText={strings.Ok}
            confirmOnPress={() => {
              this.setState({ incompleteProfile: false });
              this.props.navigation.push('EditRequesterProfileScreen', {
                requester: requester,
                allProducts: allProducts,
                isEditing: true
              });
            }}
          />

          <OptionPicker
            isVisible={true}
            title={strings.LeaveAReview}
            message={strings.BusinessName}
            customView={
              <Rating
                type='heart'
                ratingCount={3}
                imageSize={60}
                showRating
                onFinishRating={this.ratingCompleted}
              />}
            confirmText={strings.Submit}
            cancelText={strings.Skip}
            clickOutside={true}
            confirmOnPress={async () => {
              this.setState({ isReviewDue: false, isLoading: true });
              //This method will request this service from the company providing it by pushing the request to the
              //provider.
              //After confirming to the requester that the request has been processed, the program will
              //automatically send a message to the provider with a default message saying that this requester wants
              //to buy this service. Then will push the requester to the chats screen.
              const { product } = this.state;
              const { requester } = this.props.navigation.state.params;
              try {
                //await FirebaseFunctions.addRating(product.serviceID, requester.requesterID);
                this.setState({ isReviewDue: false, isLoading: false });
              } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error, {
                  screen: 'FeaturedScreen',
                  userID: 'r-' + requester.requesterID,
                  productID: product.productID
                });
              }
            }}
            cancelOnPress={() => {
              this.setState({ isReviewDue: false });
            }}

          />
        </HelpView>
      </SideMenu>
    );
  }
}

//Exports the screen
export default featuredScreen;
