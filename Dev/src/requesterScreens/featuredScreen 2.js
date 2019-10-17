//This screen represents the main screen that is launched once the requester logs in. Here they will
//be able to view services from different categories and click on them to go buy them
import React, { Component } from "react";
import { View, Platform, Text, Dimensions } from "react-native";
import fontStyles from "config/styles/fontStyles";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import strings from "config/strings";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import LoadingSpinner from "../components/LoadingSpinner";
import screenStyle from "config/styles/screenStyle";
import Geolocation from "react-native-geolocation-service";
import HelpView from "../components/HelpView";
import ServicesList from "../components/ServicesList";
import SideMenu from '../requesterScreens/sideMenu'

const SideBar = require("react-native-side-menu");

class featuredScreen extends Component {
  state = {
    index: 0,
    routes: [],
    isLoading: true,
    latitude: null,
    longitude: null
  };

  //Fetches the current position and stores it in the state
  async getCurrentPosition() {
    let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60
    };
    await Geolocation.getCurrentPosition(
      async position => {
        const { longitude, latitude } = await position.coords;
        //Waits until the user has given permission to use location, then loads the screen
        this.setState({
          longitude,
          latitude,
          isLoading: false
        });
      },
      error => {
        FirebaseFunctions.analytics.logEvent("location_permission_denied");
        this.setState({
          allProducts: true,
          isLoading: false
        });
      },
      geoOptions
    );

    return 0;
  }

  //This function deals with the location permissions depending on the OS of the app
  async requestLocationPermission() {
    if (Platform.OS === "ios") {
      const isGranted = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (isGranted === RESULTS.GRANTED) {
        await this.getCurrentPosition();
      } else {
        const requestPermission = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        );
        if (requestPermission === RESULTS.GRANTED) {
          await this.getCurrentPosition();
        } else {
          FirebaseFunctions.analytics.logEvent("location_permission_denied");
          this.setState({
            allProducts: true,
            isLoading: false
          });
        }
      }
    } else {
      const isGranted = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (isGranted === RESULTS.GRANTED) {
        await this.getCurrentPosition();
      } else {
        const requestPermission = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );
        if (requestPermission === RESULTS.GRANTED) {
          await this.getCurrentPosition();
        } else {
          FirebaseFunctions.analytics.logEvent("location_permission_denied");
          this.setState({
            allProducts: true,
            isLoading: false
          });
        }
      }
    }

    return 0;
  }

  //This method will fetch all the current categories in the market & then set the state to those
  //categories so that each one of them can be rendered in the TabView containing all the categories
  async componentDidMount() {
    const arrayOfCategories = await FirebaseFunctions.getCategoryNames();
    const routes = [];
    arrayOfCategories.forEach(category => {
      routes.push({
        key: category.toLowerCase(),
        title: category
      });
    });
    await this.requestLocationPermission();
    this.setState({ routes });
  }

  render() {
    //Filters the products and removes any that are posted by blocked users
    let { allProducts, requester } = this.props.navigation.state.params;
    allProducts = allProducts.filter(product => {
      return !requester.blockedUsers.includes(product.offeredByID);
    });

    if (this.state.isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }
    return (
    <SideBar menu = {<SideMenu 
        requester = {requester}
        allProducts = {allProducts}
    /> }>
        <HelpView style={screenStyle.container}>
          <View
            style={{
              height: Dimensions.get("window").height * 0.05,
              width: Dimensions.get("window").width * 0.93,
              justifyContent: "flex-end",
              alignItems: "flex-start"
            }}
          >
            <Text style={fontStyles.bigTextStyleBlue}>
              {strings.FeaturedServices}
            </Text>
          </View>
          <ServicesList
            requester={requester}
            navigation={this.props.navigation}
            services={allProducts}
          />
        </HelpView>
      </SideBar>
    );
  }
}

//Exports the screen
export default featuredScreen;
