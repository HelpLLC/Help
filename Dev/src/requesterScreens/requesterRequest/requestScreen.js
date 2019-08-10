//This screen represents the main screen that is launched once the requester logs in. Here they will
//be able to view services from different categories and click on them to go buy them
import React, { Component } from 'react';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { TabView, TabBar } from 'react-native-tab-view';
import colors from '../../../config/colors';
import Other from './categories/Other';
import Landscaping from './categories/Landscaping';
import Cleaning from './categories/Cleaning';
import FirebaseFunctions from '../../../config/FirebaseFunctions';


class requestScreen extends Component {

    state = {
        index: 0,
        routes: [
            { key: 'cleaning', title: 'Cleaning' },
            { key: 'landscaping', title: 'Landscaping' },
            { key: 'other', title: 'Other' },
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
                            return <Cleaning
                                {...this.props}
                                jumpTo={jumpTo}
                                requester={this.props.navigation.state.params.requester}
                                cleaningProducts={
                                    //Calls a method which filters all the products to return
                                    //only cleaning products
                                    FirebaseFunctions.getCategory(allProducts, 'Cleaning')
                                } />;
                        case 'landscaping':
                            return <Landscaping
                                {...this.props}
                                jumpTo={jumpTo}
                                requester={this.props.navigation.state.params.requester}
                                landscapingProducts={
                                    //Calls a method which filters all the products to return
                                    //only landscaping products
                                    FirebaseFunctions.getCategory(allProducts, 'Landscaping')
                                } />;
                        case 'other':
                            return <Other jumpTo={jumpTo} />;
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