import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
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
                            return <Yardwork jumpTo={jumpTo} allProps={this.props} />;
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

//Connects this screens' props with the user of the app as well as all of the products currently 
//available
const mapStateToProps = (state, props) => {
    const requester = state.requesterReducer[props.navigation.state.params.userIndex];

    //Fetches all current service providers in the market... needs to optimized because this will take 
    //forever if there are millions of customers & we want to load products as the user scrolls through
    const providers = state.providerReducer;

    return { requester, providers };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(requestScreen);