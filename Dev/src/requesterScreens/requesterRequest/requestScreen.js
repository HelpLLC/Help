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


class requestScreen extends Component {

    state = {
        index: 0,
        routes: [
            { key: 'cleaning', title: 'Cleaning' },
            { key: 'landscaping', title: 'Landscaping' },
        ],
    };

    render() {

        //Filters the products and removes any that are posted by blocked users
        let { allProducts, requester } = this.props.navigation.state.params;
        allProducts = allProducts.filter((product) => {
            return !(requester.blockedUsers.includes(product.offeredByID));
        })

        return (
            <TabView
                navigationState={this.state}
                renderScene={({ route, jumpTo }) => {
                    switch (route.key) {
                        case 'cleaning':
                            return <RequestTab
                                {...this.props}
                                jumpTo={jumpTo}
                                requester={this.props.navigation.state.params.requester}
                                serviceType={"Cleaning"}
                                products={
                                    //Calls a method which filters all the products to return
                                    //only cleaning services
                                    FirebaseFunctions.getCategory(allProducts, 'Cleaning')
                                } />;
                        case 'landscaping':
                            return <RequestTab
                                {...this.props}
                                jumpTo={jumpTo}
                                requester={this.props.navigation.state.params.requester}
                                serviceType={"Landscaping"}
                                products={
                                    //Calls a method which filters all the products to return
                                    //only landscaping services
                                    FirebaseFunctions.getCategory(allProducts, 'Landscaping')
                                } />;
                    }
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