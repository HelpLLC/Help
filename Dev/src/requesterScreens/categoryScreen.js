//This screen represents the screen that will show a specfic category
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import ServicesList from '../components/ServicesList';
import TopBanner from '../components/TopBanner';

class categoryScreen extends Component {
  state = {
    isOpen: false,
    isLoading: true,
    products: ""
  };

  //Fetches the products for this category
  async componentDidMount() {

    //Gets products from parameters
    const { allProducts, categoryName, requester } = this.props.navigation.state.params;
    //Gets products from categories
    let products = await FirebaseFunctions.getProductsByCategory(allProducts, categoryName);
    products = products.filter(product => {
      return !requester.blockedUsers.includes(product.offeredByID);
    });
    //sets the state
    this.setState({
      products,
      isLoading: false
    });

    return 0;

  }

  render() {

    //Fetches the correct 
    const { requester, categoryName } = this.props.navigation.state.params;
    const { products } = this.state;
    //If loading it shows loading spinner
    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner isVisible={true} />
        </View>
      )
    }

    return (
      <HelpView style={screenStyle.container}>
        { /* Header */ }
        <TopBanner
          title={categoryName}
          leftIconName='angle-left'
          leftOnPress={() => this.props.navigation.goBack()}
        />
        { /* Shows all Products */ }
        <ServicesList
          requester={requester}
          navigation={this.props.navigation}
          services={products}
        />
      </HelpView>
    );
  }
}

//exports screen
export default categoryScreen;