//This component will represent a customer review card which will be present when a requester is viewing a service
//It will show the star rating, the name of the person who reviewed the product, along with the comment they
//left about the product
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import PropTypes, { string } from 'prop-types';
import ViewMoreText from 'react-native-view-more-text';
import ImageWithBorder from './ImageWithBorder';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';

//The class that will render the card
class CustomerReviewCard extends Component {
	//Renders the component
	render() {
		//Fetches all the needed vield from the props
		const { stars, comment, customerName, customerID } = this.props;
		return (
			<View
				style={{
					flexDirection: 'column',
					width: Dimensions.get('window').width * 0.9,
					alignSelf: 'center',
					alignItems: 'flex-start',
					borderColor: colors.lightGray,
					borderTopColor: colors.lightBlue,
					borderWidth: 0.5,
					paddingVertical: Dimensions.get('window').height * 0.025
				}}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}>
					<ImageWithBorder
						style={{
							flex: 1
						}}
						width={Dimensions.get('window').height * 0.06}
						height={Dimensions.get('window').height * 0.06}
						imageFunction={async () => {
							//Passes in the function to retrieve the image of this requester
							return await FirebaseFunctions.getProfilePictureByID(customerID);
						}}
					/>
					<View style={{ width: Dimensions.get('window').width * 0.05 }}></View>
					<Text style={fontStyles.subTextStyleBlack}>{customerName}</Text>
				</View>
				<View style={{ marginTop: Dimensions.get('window').height * 0.01 }}>
					<AirbnbRating
						count={5}
						size={15}
						isDisabled={true}
						defaultRating={stars}
						showRating={false}
					/>
				</View>
				<View style={{ marginTop: Dimensions.get('window').height * 0.01 }}>
					<ViewMoreText
						numberOfLines={2}
						renderViewMore={(onPress) => (
							<TouchableOpacity
								onPress={onPress}
								style={{
									width: Dimensions.get('window').width * 0.3,
									height: Dimensions.get('window').height * 0.1
								}}>
								<Text style={fontStyles.mainTextStyleBlue}>{strings.ReadMore}</Text>
							</TouchableOpacity>
						)}
						renderViewLess={(onPress) => (
							<TouchableOpacity
								onPress={onPress}
								style={{
									width: Dimensions.get('window').width * 0.3,
									height: Dimensions.get('window').height * 0.1
								}}>
								<Text style={fontStyles.mainTextStyleBlue}>{strings.ReadLess}</Text>
							</TouchableOpacity>
						)}
						textStyle={{ textAlign: 'left' }}>
						<Text style={fontStyles.subTextStyleBlack}>{comment}</Text>
					</ViewMoreText>
				</View>
			</View>
		);
	}
}

//Makes sure all the proper props are passed in. The props should be: The customer's name, the star rating that was
//left, and the comment that was left. Along with the obvious customerID in order to fetch the
//image. All of these are required
CustomerReviewCard.propTypes = {
	stars: PropTypes.number.isRequired,
	comment: PropTypes.string.isRequired,
	customerName: PropTypes.string.isRequired,
	customerID: PropTypes.string.isRequired
};

//Exports the module
export default CustomerReviewCard;
