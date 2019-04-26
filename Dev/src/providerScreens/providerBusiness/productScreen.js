//This screen represents the product page which contains information about the product
//as well as any current requests. You will also be able to access history & edit the product from this
//screen
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import colors from 'config/colors';
import { connect } from 'react-redux';
import { BoxShadow } from 'react-native-shadow';

//The class representing the screen
class productScreen extends Component {

    //Fetches the username of a requester based on the passed in ID parameter
    getRequesterUserNameByID(ID) {
        const requester = this.props.requestersOfThisProduct.find((requester) => {
            return requester.requesterID === ID;
        });

        return requester.username;
    }

    //This method will take in an ID of a requester and go to the chat screen associated with them
    messageRequester(ID) {

    }

    //This method will complete a specific request based on the passed in requester ID
    markAsComplete(ID) {

    }

    //This method will delete the request WITHOUT completing it based on the passed in ID
    deleteRequest(ID) {
        
    }

    //renders the UI
    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.Service}
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
                    paddingBottom: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                        <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                            {this.props.product.serviceTitle}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('ProviderEditProductScreen', {
                                    product: this.props.product,
                                    productID: this.props.productID
                                });
                            }}>
                            <Text style={[fontStyles.subTextStyleGray, { paddingBottom: 10 }]}>
                                {strings.EditService}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('ProviderProductHistoryScreen', {
                                    product: this.props.product,
                                    productID: this.props.productID
                                });
                            }}>
                            <Text style={fontStyles.subTextStyleGray}>
                                {strings.History}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: 10 }}>
                        <BoxShadow setting={{
                            width: 140,
                            height: 110,
                            color: colors.gray,
                            border: 10,
                            radius: 50,
                            opacity: 0.2,
                            x: 0,
                            y: 5
                        }}>
                            <Image
                                source={this.props.product.imageSource}
                                style={{
                                    width: 140,
                                    height: 110,
                                    borderColor: colors.lightBlue,
                                    borderWidth: 6,
                                    borderRadius: 50
                                }} />
                        </BoxShadow>
                    </View>
                </View>
                <View style={{
                    paddingTop: 20,
                    paddingRight: 14,
                    paddingLeft: 14,
                    borderColor: colors.lightGray,
                    borderBottomColor: colors.black,
                    borderWidth: 0.5,
                    width: Dimensions.get('window').width - 40,
                }}>
                    <Text style={fontStyles.subTextStyleBlack}>
                        {this.props.product.serviceDescription}</Text>

                    <Text style={[fontStyles.bigTextStyleBlack, {
                        alignSelf: 'center',
                        paddingTop: 20,
                        paddingBottom: 20
                    }]}>
                        {this.props.product.pricing}
                    </Text>
                </View>

                {   //Checks if the current product has any current requests and displays them if
                    //it does
                    this.props.requestersOfThisProduct.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                            alignSelf: 'center',
                            paddingTop: 20,
                            paddingBottom: 20,
                            alignItems: 'center'
                        }}>
                            <View style={{ paddingBottom: 20 }}>
                                <Text style={fontStyles.mainTextStyleRed}>
                                    {this.props.product.requests.currentRequests.length}
                                    {
                                        this.props.product.requests.currentRequests.length > 1 ?
                                            (' Requests') : (' Request')
                                    }</Text>
                            </View>
                            <FlatList
                                data={this.props.product.requests.currentRequests}
                                keyExtractor={(item, index) => (index + "")}
                                renderItem={({ item, index }) => (
                                    <View style={{ paddingBottom: 20, alignItems: 'center' }}>
                                        <View style={{
                                            flexDirection: 'column',
                                            justifyContent: 'space-evenly',
                                            width: Dimensions.get('window').width,
                                            height: 80,
                                            backgroundColor: colors.white,
                                            paddingLeft: 20
                                        }}>
                                            <Text style={fontStyles.mainTextStyleBlack}>
                                                {this.getRequesterUserNameByID(item.requesterID)}</Text>
                                            <Text>{"Example chat..."}</Text>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                            alignItems: 'center',
                                            width: Dimensions.get('window').width,
                                            height: 70,
                                            backgroundColor: colors.white,
                                            borderBottomStartRadius: 35,
                                            borderBottomEndRadius: 35
                                        }}>
                                            <TouchableOpacity 
                                            onPress={() => this.messageRequester(item.requesterID)}>
                                                <Text style={fontStyles.subTextStyleBlue}>
                                                    {strings.Message}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                            style={{
                                                height: 70,
                                                justifyContent: 'center',
                                                padding: 15
                                            }}
                                            onPress={() => this.markAsComplete(item.requesterID)}>
                                                <Text style={fontStyles.subTextStyleBlue}>
                                                    {strings.MarkAsComplete}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                            onPress={() => this.deleteRequest(item.requesterID)}>
                                                <Text style={fontStyles.subTextStyleRed}>
                                                    {strings.Delete}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        </ScrollView>
                    ) : (
                            <View style={{
                                alignSelf: 'center',
                                paddingTop: 20,
                                paddingBottom: 20
                            }}>
                                <Text style={fontStyles.bigTextStyleBlack}>
                                    {strings.NoCurrentRequests}
                                </Text>
                            </View>
                        )

                }

            </View>
        );
    }
}
//Connects this screens' props with the current product that is being viewed as well
//as all the requesters that ordered this product
const mapStateToProps = (state, props) => {
    const { productID } = props.navigation.state.params;
    const product = state.providerReducer.products.find((product) => {
        return product.serviceID === productID;
    });

    //Retrieves the requesters that ordered this product
    let requestersOfThisProduct = [];

    //Pulls the requesters who requested this product and returns the array
    product.requests.currentRequests.forEach((request) => {
        let requesterID = request.requesterID;
        let requester = state.requesterReducer.find((requester) => {
            return requester.requesterID === requesterID;
        })

        requestersOfThisProduct.push(requester);
    });

    return { product, productID, requestersOfThisProduct };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(productScreen);