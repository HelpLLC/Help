//This screen will show the request history for an individual product. For now, this will only show
//the date and the customer name, but in the future, this will show ratings/reviews/tips, and other
//factors.
import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList, ScrollView } from 'react-native';
import WhiteCard from '../../components/WhiteCard';
import whiteCardStyle from 'config/styles/componentStyles/whiteCardStyle';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ImageWithBorder from '../../components/ImageWithBorder';


//The class for this screen
class productHistoryScreen extends Component {

    componentDidMount() {
        FirebaseFunctions.setCurrentScreen("ProductHistoryScreen", "productHistoryScreen");
    }

    //Renders the UI
    render() {

        //Fetches the product from the navigation params
        const { product } = this.props.navigation.state.params;

        return (
            <HelpView style={screenStyle.container}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        width: Dimensions.get('window').width - 40,
                        borderColor: colors.lightGray,
                        borderBottomColor: colors.black,
                        borderWidth: 0.5,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 0.35
                    }}>

                        <Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>

                        <ImageWithBorder
                            width={Dimensions.get('window').width * 0.25}
                            height={Dimensions.get('window').width * 0.25}
                            imageFunction={async () => {
                                //Passes in the function to retrieve the image of this product
                                return await FirebaseFunctions.getImageByID(product.serviceID)
                            }} />

                    </View>
                    <View style={{ flex: 0.025 }}></View>


                    {
                        //Tests if the current product has had any requests yet
                        product.requests.completedRequests.length > 0 ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <WhiteCard
                                    style={whiteCardStyle.whiteCardStyle}
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
                                            style={whiteCardStyle.whiteCardStyle}
                                            text={item.dateCompleted}
                                            mainTextStyle={fontStyles.subTextStyleBlack}
                                            comp={<Text style={fontStyles.subTextStyleBlack}>
                                                {item.requesterName}
                                            </Text>}
                                            onPress={() => { }} />
                                    )}
                                />
                            </ScrollView>
                        ) : (
                                <View style={{ flex: 0.35, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={fontStyles.bigTextStyleBlack}>
                                        {strings.NoHistoryForThisProductYet}</Text>
                                </View>
                            )
                    }
                </View>
            </HelpView>
        )
    }

}

//Exports the screen
export default productHistoryScreen;