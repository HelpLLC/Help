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
import { Badge } from 'react-native-elements';
import { BoxShadow } from 'react-native-shadow';
import strings from 'config/strings';

//The component class
class ServiceCard extends Component {

    //Renders the component
    render() {
        //The props for the ServiceCard. It will take in a service title, a description, a price, and an
        //image to display, along with an onPress method. An additional prop is also how many current
        //requests this product currently has. This prop should only be used by the provider screens
        const { serviceTitle, serviceDescription, pricing, image, onPress, numCurrentRequests, offeredBy,
            offeredByOnPress } =
            this.props;

        //Returns the rendered component
        return (
            <TouchableOpacity onPress={onPress} style={{
                width: Dimensions.get('window').width,
                height: (Dimensions.get('window').height * 0.31),
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{}}>
                    <BoxShadow setting={{
                        width: Dimensions.get('window').width - 40,
                        height: (Dimensions.get('window').height * 0.21961933),
                        color: colors.gray,
                        border: 10,
                        radius: (Dimensions.get('window').height * 0.04392387),
                        opacity: 0.2,
                        x: 0,
                        y: 5
                    }}>
                        <View style={serviceCardStyle.style}>
                            <View style={{ flex: 1 }}>
                                <Image
                                    source={image}
                                    style={{
                                        width: (Dimensions.get('window').width - 40) * 0.45,
                                        height: (Dimensions.get('window').height * 0.21961933) - 12,
                                        borderRadius: (Dimensions.get('window').height * 0.03440703)
                                    }}
                                />
                            </View>
                            <View style={{ flex: 0.05 }}></View>
                            <View style={{
                                flexDirection: 'column', flex: 1, alignItems: 'flex-start',
                                justifyContent: 'space-evenly'
                            }}>
                                <Text style={fontStyles.mainTextStyleBlack}>{serviceTitle}</Text>
                                {
                                    serviceDescription ? (
                                        <Text style={fontStyles.subTextStyleGray}>
                                            {serviceDescription.length > 25 ?
                                                (serviceDescription.slice(0, 24) + '...') :
                                                serviceDescription}
                                        </Text>
                                    ) : (
                                            <View flexDirection='column'>
                                                <Text style={fontStyles.subTextStyleGray}>
                                                    {strings.OfferedBy}</Text>
                                                <TouchableOpacity
                                                    onPress={offeredByOnPress}>
                                                    <Text style={fontStyles.subTextStyleBlue}>
                                                        {offeredBy}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                }
                                <Text style={fontStyles.mainTextStyleBlack}>{pricing}</Text>
                            </View>
                        </View>
                    </BoxShadow>
                </View>
                {numCurrentRequests > 0 ? (
                    <Badge
                        status="error"
                        value={numCurrentRequests}
                        badgeStyle={{
                            width: (Dimensions.get('window').width * 0.0973),
                            height: (Dimensions.get('window').height * 0.0586), 
                            borderRadius: (Dimensions.get('window').width * 0.0973) / 2
                        }}
                        textStyle={fontStyles.mainTextStyleWhite}
                        containerStyle={{ position: 'absolute', top: 16, right: 12 }}
                    />
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
    offeredByOnPress: PropTypes.func,
    pricing: PropTypes.string.isRequired,
    image: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
}

//exports the module
export default ServiceCard;