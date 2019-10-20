import React, { Component } from 'react';
import { View, Platform, Text, Dimensions, Image } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import strings from 'config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import Geolocation from 'react-native-geolocation-service';
import HelpView from '../components/HelpView';
import ServicesList from '../components/ServicesList';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import TopBanner from '../components/TopBanner';

class categoryScreen extends Component {
  state = {
    isOpen: false
  };
  render() {
    //Filters the products and removes any that are posted by blocked users
    let {
      allProducts,
      requester,
      categoryName
    } = this.props.navigation.state.params;
    
    let products = FirebaseFunctions.getProductsByCategory(
      allProducts,
      categoryName
    );
    products = products.filter(product => {
      return !requester.blockedUsers.includes(product.offeredByID);
    });

    
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
