//This screen represents the main screen that is launched once the requester logs in. Here they will
//be able to view services from different categories and click on them to go buy them
import React, { Component } from 'react';
import { View, Dimensions, Text, Platform } from 'react-native';
import TopBanner from '../../components/TopBanner';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { TabView, TabBar } from 'react-native-tab-view';
import colors from '../../../config/colors';
import RequestTab from './requestTab';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';
import Geolocation from 'react-native-geolocation-service';

class requestScreen extends Component {

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
            async (position) => {
                const { longitude, latitude } = await position.coords;
                //Waits until the user has given permission to use location, then loads the screen
                this.setState({
                    longitude,
                    latitude,
                    isLoading: false
                });
            },
            (error) => {
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

        if (Platform.OS === 'ios') {
            const isGranted = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (isGranted === RESULTS.GRANTED) {
                await this.getCurrentPosition();
            } else {
                const requestPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
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
                const requestPermission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
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
        arrayOfCategories.forEach((category) => {
            routes.push({
                key: category.toLowerCase(),
                title: category
            })
        });
        await this.requestLocationPermission();
        this.setState({ routes });

    }


    render() {
        
        //Filters the products and removes any that are posted by blocked users
        let { allProducts, requester } = this.props.navigation.state.params;
        allProducts = allProducts.filter((product) => {
            return !(requester.blockedUsers.includes(product.offeredByID));
        })

        if (this.state.isLoading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }
        return (
            <TabView
                navigationState={this.state}
                renderScene={({ route, jumpTo }) => {
                    return <RequestTab
                        {...this.props}
                        jumpTo={jumpTo}
                        requester={this.props.navigation.state.params.requester}
                        serviceType={route.title}
                        products={
                            //Calls a method which filters all the products to return
                            //only cleaning services
                            FirebaseFunctions.getCategory(allProducts, route.title)
                        } />;
                }}
                renderTabBar={props =>
                    <View>
                        <TopBanner
                            title={strings.Request} />
                        <TabBar
                            {...props}
                            style={{ backgroundColor: colors.white }}
                            renderLabel={({ route, focused, color }) => (
                                <Text style={[fontStyles.tabLabelStyle, { color }]}>
                                    {route.title}
                                </Text>
                            )}
                            indicatorStyle={{ backgroundColor: colors.white }}
                            activeColor={colors.lightBlue}
                            inactiveColor={colors.black}
                            labelStyle={fontStyles.tabLabelStyle} />
                    </View>
                }
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width }}
                swipeEnabled={false}
            />
        )
    }
}

//Exports the screen
export default requestScreen;