//This screen represents the main screen that is launched once the requester logs in. Here will be displayed the featured products
//where customers will be able to click on them to request them. The side menu  will also be accessible from this screen
import React, { Component } from "react";
import { View, Platform, Text, Dimensions, Image } from "react-native";
import fontStyles from "config/styles/fontStyles";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import strings from "config/strings";
import FirebaseFunctions from "../../config/FirebaseFunctions";
import LoadingSpinner from "../components/LoadingSpinner";
import screenStyle from "config/styles/screenStyle";
import Geolocation from "react-native-geolocation-service";
import HelpView from "../components/HelpView";
import ServicesList from "../components/ServicesList";
import LeftMenu from "./LeftMenu";
import SideMenu from "react-native-side-menu";
import TopBanner from "../components/TopBanner";

class featuredScreen extends Component {
  state = {
    isLoading: true,
    latitude: null,
    longitude: null,
    isOpen: false
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

  async componentDidMount() {

    FirebaseFunctions.setCurrentScreen("FeaturedScreen", "featuredScreen");
    await this.requestLocationPermission();

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
      <SideMenu
        isOpen={this.state.isOpen}
        menu={
          <LeftMenu
            navigation={this.props.navigation}
            allProducts={allProducts}
            requester={requester}
          />
        }
      >
        <HelpView style={screenStyle.container}>
          <TopBanner
            leftIconName="navicon"
            leftOnPress={() => {
              FirebaseFunctions.analytics.logEvent("sidemenu_opened_from_home");
              this.setState({ isOpen: true });
            }}
            size={30}
            title={strings.Featured}
          />
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
      </SideMenu>
    );
  }
}

//Exports the screen
export default featuredScreen;
