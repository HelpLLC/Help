//This screen represents the main screen that is launched once the requester logs in. Here they will
//be able to view services from different categories and click on them to go buy them
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { TabView, TabBar } from 'react-native-tab-view';
import colors from '../../../config/colors';
import Other from './categories/Other';
import Landscaping from './categories/Landscaping';


class requestScreen extends Component {

    state = {
        index: 0,
        routes: [
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
                        case 'landscaping':
                            return <Landscaping
                                {...this.props}
                                jumpTo={jumpTo}
                                requester={this.props.navigation.state.params.requester}
                                //To-Do: Make a classification model that only retrieves the landscaping
                                //products
                                landscapingProducts={allProducts} />;
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