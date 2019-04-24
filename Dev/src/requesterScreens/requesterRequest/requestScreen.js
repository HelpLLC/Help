//This screen represents the main screen that is launched once the requester logs in. Here they will
//be able to view services from different categories and click on them to go buy them
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import TopBanner from '../../components/TopBanner';
import { connect } from 'react-redux';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { TabView, TabBar } from 'react-native-tab-view';
import colors from '../../../config/colors';
import Other from './categories/Other';
import Yardwork from './categories/Yardwork';


class requestScreen extends Component {

    state = {
        index: 0,
        routes: [
            { key: 'yardwork', title: 'Yardwork' },
            { key: 'other', title: 'Other' },
        ],
    };

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={({ route, jumpTo }) => {
                    switch (route.key) {
                        case 'yardwork':
                            return <Yardwork 
                            {...this.props}
                            jumpTo={jumpTo} 
                            thisRequester={this.props.requester}
                            thisRequesterIndex={this.props.navigation.state.params.userIndex}
                            providers={this.props.accounts}
                            products={this.props.products} />;
                        case 'other':
                            return <Other jumpTo={jumpTo} />;
                    }
                }}
                renderTabBar={props =>
                    < View >
                        <TopBanner
                            title={strings.Request}
                        />
                        <TabBar
                            {...props}
                            style={{ backgroundColor: colors.white }}
                            indicatorStyle={{ backgroundColor: colors.white }}
                            activeColor={colors.lightBlue}
                            inactiveColor={colors.black}
                            labelStyle={fontStyles.tabLabelStyle}
                        />
                    </View >
                }
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width }}
                swipeEnabled={false}
            />
        )
    }
}

//Connects this screens' props with the user of the app as well as the provider reducer containing the
//products
const mapStateToProps = (state, props) => {
    const requester = state.requesterReducer[props.navigation.state.params.userIndex];
    const { accounts, products } = state.providerReducer;

    return { requester, accounts, products };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(requestScreen);