//This component will represent the card which which will display a service. The card will be accessed
//from both the requester & the provider screens. From the provider, they'll be able to view their
//products and if they click on them, they'll be able to see the products & edit them as well as
//see other kinds of information. From the requester, clicking on the service would allow them to view
//the service and request it if they need it.
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import serviceCardStyle from 'config/styles/componentStyles/serviceCardStyle';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';
import { BoxShadow } from 'react-native-shadow';

//The component class
class ServiceCard extends Component {

    //Renders the component
    render() {
        //The props for the ServiceCard. It will take in a service title, a description, a price, and an
        //image to display, along with an onPress method. An additional prop is also how many current
        //requests this product currently has. This prop should only be used by the provider screens
        const { serviceTitle, serviceDescription, pricing, image, onPress, numCurrentRequests, offeredBy } =
            this.props;

        //Returns the rendered component
        return (
            <TouchableOpacity onPress={onPress} style={{
                width: Dimensions.get('window').width,
                height: 210,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{ marginBottom: 30 }}>
                    <BoxShadow setting={{
                        width: Dimensions.get('window').width - 40,
                        height: 150,
                        color: colors.gray,
                        border: 10,
                        radius: 30,
                        opacity: 0.2,
                        x: 0,
                        y: 5
                    }}>
                        <View style={serviceCardStyle.style}>
                            <Image
                                source={image}
                                style={{
                                    width: (Dimensions.get('window').width - 40) * 0.45,
                                    height: 138,
                                    borderRadius: 23.5
                                }}
                            />
                            <View style={{
                                flexDirection: 'column', flex: 1, alignItems: 'flex-start',
                                justifyContent: 'space-evenly', paddingLeft: 20
                            }}>
                                <Text style={fontStyles.mainTextStyleBlack}>{serviceTitle}</Text>
                                {
                                    serviceDescription ? (
                                        <Text style={fontStyles.subTextStyleGray}>
                                            serviceDescription.length > 25 ?
                                                (serviceDescription.slice(0, 24) + '...') :
                                                serviceDescription
                                                </Text>
                                    ) : (
                                            <Text>{offeredBy}</Text>
                                        )
                                }
                                <Text style={fontStyles.mainTextStyleBlack}>{pricing}</Text>
                            </View>
                        </View>
                    </BoxShadow>
                </View>
                {numCurrentRequests > 0 ? (
                    <View style={{
                        backgroundColor: colors.red,
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: "absolute",
                        left: 325,
                        top: 0
                    }}>
                        <Text style={fontStyles.mainTextStyleWhite}>{numCurrentRequests}</Text>
                    </View>
                ) : (
                        <View></View>
                    )}
            </TouchableOpacity>
        );
    }
}

//These are the propTypes for the topBanner component. It defines whether they are required or not
//and what their types should be
ServiceCard.propTypes = {
    serviceTitle: PropTypes.string.isRequired,
    serviceDescription: PropTypes.string,
    offeredBy: PropTypes.string,
    pricing: PropTypes.string.isRequired,
    image: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
}

//exports the module
export default ServiceCard;