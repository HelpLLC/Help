//This component will represent a customer review card which will be present when a requester is viewing a service
//It will show the star rating, the name of the person who reviewed the product, along with the comment they
//left about the product
import React from 'react';
import { View, Text } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import PropTypes from 'prop-types';
import { screenWidth, screenHeight } from 'config/dimensions';
import ViewMoreText from 'react-native-view-more-text';
import ImageWithBorder from './ImageWithBorder';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';

//The function that will render the card
export default function CustomerReviewCard(props) {
	//Fetches all the needed vield from the props
	const { stars, comment, customerName, customerID } = props;

	//Makes sure all the proper props are passed in. The props should be: The customer's name, the star rating that was
	//left, and the comment that was left. Along with the obvious customerID in order to fetch the
	//image. All of these are required
	CustomerReviewCard.propTypes = {
		stars: PropTypes.number.isRequired,
		comment: PropTypes.string.isRequired,
		customerName: PropTypes.string.isRequired,
		customerID: PropTypes.string.isRequired,
	};

	return (
		<View
			style={{
				flexDirection: 'column',
				width: screenWidth * 0.9,
				alignSelf: 'center',
				alignItems: 'flex-start',
				borderColor: colors.lightGray,
				borderTopColor: colors.lightBlue,
				borderWidth: 0.5,
				paddingVertical: screenHeight * 0.025,
			}}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<ImageWithBorder
					style={{
						flex: 1,
					}}
					width={screenHeight * 0.06}
					height={screenHeight * 0.06}
					imageFunction={async () => {
						//Passes in the function to retrieve the image of this requester
						return await FirebaseFunctions.call('getProfilePictureByID', {
							ID: customerID,
						});
					}}
				/>
				<View style={{ width: screenWidth * 0.05 }}></View>
				<Text style={[fontStyles.subTextStyle, fontStyles.black]}>{customerName}</Text>
			</View>
			<View style={{ marginTop: screenHeight * 0.01 }}>
				<AirbnbRating
					count={5}
					size={15}
					isDisabled={true}
					defaultRating={stars}
					showRating={false}
				/>
			</View>
			<View style={{ marginTop: screenHeight * 0.01 }}>
				<ViewMoreText
					numberOfLines={2}
					renderViewMore={(onPress) => (
						<TouchableOpacity
							onPress={onPress}
							style={{
								width: screenWidth * 0.3,
								height: screenHeight * 0.1,
							}}>
							<Text style={[fontStyles.mainTextStyle, fontStyles.blue]}>{strings.ReadMore}</Text>
						</TouchableOpacity>
					)}
					renderViewLess={(onPress) => (
						<TouchableOpacity
							onPress={onPress}
							style={{
								width: screenWidth * 0.3,
								height: screenHeight * 0.1,
							}}>
							<Text style={[fontStyles.mainTextStyle, fontStyles.blue]}>{strings.ReadLess}</Text>
						</TouchableOpacity>
					)}
					textStyle={{ textAlign: 'left' }}>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>{comment}</Text>
				</ViewMoreText>
			</View>
		</View>
	);
}
