//This screen represents the main screen that is launched once the requester logs in. Here they will
//be able to view services from different categories and click on them to go buy them
import React, { Component } from 'react';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../../components/TopBanner';
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
        ready: false,
        where: {lat:null, lng:null},
        error: null
    };

    geoSuccess = position => {
        console.log('A')
        console.log(position)
        this.setState({ready: true})
    };

    geoFailure = err => {
        this.setState({error: err.message})
        console.log('b')
        console.log(err)
    };

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
        this.setState({ routes, isLoading: false });

        //Options set for geolocation
        let geoOptions = {
            //enable High Accuracy firsts attempts to use GPS from phone, if it doesn't work then it will use Wifi
            enableHighAccuracy: false,
            //It will timeout in 20000 milliseconds, which is 20 seconds
            timeOut: 20000,
            //How long to store their location, seconds * minutes * hours
            maximumAge: 60 * 60
        };
        console.log('before authorization');
        //geolocation.requestAuthorization();
        console.log('after authorization');
        this.setState({ready: false, error: null});
        Geolocation.getCurrentPosition(
            (position) => {this.geoSuccess(position)}, 
            (error) => {this.geoFailure(error)}, 
            geoOptions
        )
        console.log('after getlocation')
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