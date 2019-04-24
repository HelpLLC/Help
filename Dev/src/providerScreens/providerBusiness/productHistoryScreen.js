//This screen will show the request history for an individual product. For now, this will only show
//the date and the customer name, but in the future, this will show ratings/reviews/tips, and other
//factors.
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import WhiteCard from '../../components/WhiteCard';
import whiteCardStyle from 'config/styles/componentStyles/whiteCardStyle';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import { connect } from 'react-redux';
import { BoxShadow } from 'react-native-shadow';


//The class for this screen
class productHistoryScreen extends Component {

    //Renders the UI
    render() {

        //Fetches the product from the state
        const { product } = this.props;

        return (
            <View style={screenStyle.container}>
                <TopBanner
                    title={strings.ServiceHistory}
                    leftIconName="angle-left"
                    leftOnPress={() => this.props.navigation.goBack()} />

                <View style={{
                    flexDirection: 'row',
                    width: Dimensions.get('window').width - 40,
                    borderColor: colors.lightGray,
                    borderBottomColor: colors.black,
                    borderWidth: 0.5,
                    marginTop: 20,
                    paddingBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>

                    <Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>

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
                            source={product.imageSource}
                            style={{
                                width: 140,
                                height: 110,
                                borderColor: colors.lightBlue,
                                borderWidth: 6,
                                borderRadius: 50,
                            }} />
                    </BoxShadow>

                </View>


                {
                    //Tests if the current product has had any requests yet
                    product.requests.completedRequests.length > 0 ? (
                        <ScrollView style={{ paddingTop: 30 }} showsVerticalScrollIndicator={false}>
                            <WhiteCard
                                style={whiteCardStyle.noMarginCard}
                                text={strings.Date}
                                mainTextStyle={fontStyles.bigTextStyleBlack}
                                comp={<Text style={fontStyles.bigTextStyleBlack}>{strings.Customer}</Text>}
                                onPress={() => { }} />

                            <FlatList
                                data={product.requests.completedRequests}
                                keyExtractor={(item, index) => {
                                    return (product.serviceTitle + " Request #" + index);
                                }}
                                renderItem={({ item, index }) => (
                                    <WhiteCard
                                        key={index}
                                        style={whiteCardStyle.noMarginCard}
                                        text={item.dateCompleted}
                                        mainTextStyle={fontStyles.subTextStyleBlack}
                                        comp={<Text style={fontStyles.subTextStyleBlack}>{item.customerUsername}</Text>}
                                        onPress={() => { }} />
                                )}
                            />
                        </ScrollView>
                    ) : (
                            <View style={{ paddingTop: 100 }}>
                                <Text style={fontStyles.bigTextStyleBlack}>
                                    {strings.NoHistoryForThisProductYet}</Text>
                            </View>
                        )
                }

            </View>
        )
    }

}

//Connects this screens' props with the current product
const mapStateToProps = (state, props) => {
    const { product, productID } = props.navigation.state.params;
    return { product, productID };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(productHistoryScreen);