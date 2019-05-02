//This screen will be where the requester will be able to view a profile of a company offering services.
//They'll see its name & description, be able to message it and view all of its specific products.
//In the future we want to add reviews and such features.
//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import TopBanner from '../../components/TopBanner';
import ServiceCard from '../../components/ServiceCard';
import strings from 'config/strings';
import Functions from 'config/Functions';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

class companyProfileScreen extends Component {

    //This method will open a chat with the provider and go to that chat
    messageProvider() {

    }

    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.CompanyProfile}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: Dimensions.get('window').width - 40,
                    borderColor: colors.lightGray,
                    borderBottomColor: colors.black,
                    borderWidth: 0.5,
                    marginTop: 20,
                    paddingBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'column', paddingBottom: 10, maxWidth: 260 }}>
                        <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                            {this.props.provider.companyName}</Text>

                        <Text style={[fontStyles.subTextStyleBlack, { paddingTop: 10 }]}>
                            {this.props.provider.companyDescription}</Text>
                    </View>

                    <View style={{ paddingBottom: 10 }}>
                        <TouchableOpacity onPress={this.messageProvider()}>
                            <Icon
                                name="comment"
                                type="font-awesome"
                                size={40}
                                color={colors.lightBlue}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    style={{ paddingTop: 20 }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={this.props.providerProducts}
                        keyExtractor={(item, index) => {
                            return (this.props.provider.companyName + " Product #" + index);
                        }}
                        renderItem={({ item, index }) => (
                            <ServiceCard
                                key={index}
                                serviceTitle={item.serviceTitle}
                                serviceDescription={item.serviceDescription}
                                pricing={item.pricing}
                                image={item.imageSource}
                                numCurrentRequests={0}
                                 //Passes all of the necessary props to the actual screen that contains
                                //more information about the service
                                onPress={() => {
                                    this.props.navigation.push('RequesterServiceScreen', {
                                        offeredByID: item.offeredBy,
                                        productID: item.serviceID,
                                        thisRequesterIndex: this.props.thisRequesterIndex
                                    });
                                }}
                            />
                        )}
                    />
                    <View style={{ height: 40 }}></View>
                </ScrollView>
            </View>
        );
    }
}

//Maps the state to the current company being viewed
const mapStateToProps = (state, props) => {
    const { companyID, thisRequesterIndex } = props.navigation.state.params;

    //Fethches this provider
    const provider = Functions.getProviderByID(companyID, state.providerReducer.accounts);

    //Fetches products that are offered by this specifc provider
    const providerProducts = Functions.getProviderProducts(provider, state.providerReducer.products);

    //Returns all of the data
    return { provider, companyID, thisRequesterIndex, providerProducts };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(companyProfileScreen);