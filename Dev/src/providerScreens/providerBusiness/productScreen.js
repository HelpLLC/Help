//This screen represents the product page which contains information about the product
//as well as any current requests. You will also be able to access history & edit the product from this
//screen
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import ChatCard from '../../components/ChatCard';
import colors from 'config/colors';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { BoxShadow } from 'react-native-shadow';

//The class representing the screen
class productScreen extends Component {

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
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                        <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                            {this.props.product.serviceTitle}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('ProviderEditProductScreen', {
                                    userIndex: this.props.navigation.state.params.userIndex,
                                    productIndex: this.props.navigation.state.params.productIndex
                                });
                            }}>
                            <Text style={[fontStyles.subTextStyleGray, { paddingBottom: 10 }]}>
                                {strings.EditService}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('ProviderProductHistoryScreen', {
                                    userIndex: this.props.navigation.state.params.userIndex,
                                    productIndex: this.props.navigation.state.params.productIndex
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
                    this.props.product.requests.currentRequests.length > 0 ? (
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
                                    <ChatCard
                                        key={index}
                                        username={item.customerUsername}
                                        previewText={"Example chat..."} //Need to change this preview most
                                        //recent chat
                                        comp={
                                            <Icon
                                                name="comment"
                                                type="font-awesome"
                                                size={40}
                                                color={colors.lightBlue}
                                            />}
                                        onPress={() => {
                                            //Should go to the chat belonging to the user
                                        }}
                                    />
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

}//Connects this screens' props with the current product that is being viewed
const mapStateToProps = (state, props) => {
    const { userIndex, productIndex } = props.navigation.state.params;
    const product = state.providerReducer[userIndex].products[productIndex];
    return { product };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(productScreen);