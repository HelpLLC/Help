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

    const { allProducts, categoryName, requester } = this.props.navigation.state.params;
    let products = await FirebaseFunctions.getProductsByCategory(allProducts, categoryName);
    products = products.filter(product => {
      return !requester.blockedUsers.includes(product.offeredByID);
    });
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

    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner isVisible={true} />
        </View>
      )
    }

    return (
      <HelpView style={screenStyle.container}>
        <TopBanner
          title={categoryName}
          leftIconName='angle-left'
          leftOnPress={() => this.props.navigation.goBack()}
        />
        <View
          style={{
            height: Dimensions.get('window').height * 0.05,
            width: Dimensions.get('window').width * 0.93,
            justifyContent: 'flex-end',
            alignItems: 'flex-start'
          }}
        ></View>
        <ServicesList
          requester={requester}
          navigation={this.props.navigation}
          services={products}
        />
      </HelpView>
    );
  }
}

export default categoryScreen;
