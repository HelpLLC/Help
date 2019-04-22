import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import { connect } from 'react-redux';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import colors from '../../../config/colors';

const Yardwork = () => (
    <View style={screenStyle.container}>
        <Text>{this.props.products[0].serviceTitle}</Text>
    </View>
);
const Other = () => (
    <View style={screenStyle.container}>
        <View style={{ paddingTop: 180 }}>
            <Text style={fontStyles.mainTextStyleBlack}>{strings.MoreCategoriesComingSoonExclamation}</Text>
        </View>
    </View>
);

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
                renderScene={SceneMap({
                    yardwork: Yardwork,
                    other: Other,
                })}
                renderTabBar={props =>
                    <View>
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
                    </View>
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
    
    //Fetches all current services in the market... needs to optimized because this will take forever
    //if there are millions of customers
    const providers = state.providerReducer;
    const products = [];
    providers.forEach((item) => {
        products.push(item.products);
    });

    return { requester, products };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(requestScreen);