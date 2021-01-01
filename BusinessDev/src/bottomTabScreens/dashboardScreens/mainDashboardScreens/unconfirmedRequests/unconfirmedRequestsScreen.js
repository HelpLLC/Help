import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../../../components/TopBanner/TopBanner';
import HelpView from '../../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../../components/HelpButton/HelpButton';
import unconfirmedRequestsScreenStyle from './unconfirmedRequestsScreenStyle';

const unconfirmedScreen = (props) => {
	let image = {
		uri:
			'https://www.adorama.com/alc/wp-content/uploads/2018/07/shutterstock_170815865-1024x563.jpg',
	};
	return (
		<ScrollView>
			<HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
				<View style={unconfirmedRequestsScreenStyle.ServiceCard}>
					<View
						style={[
							unconfirmedRequestsScreenStyle.ImageandTitle,
							unconfirmedRequestsScreenStyle.RightSpacer,
						]}>
						<Text
							style={[
								fontStyles.darkBlue,
								fontStyles.bold,
								fontStyles.mainTextStyle,
								unconfirmedRequestsScreenStyle.BottomSpacer,
							]}>
							{/* replace with firebase input */}
							Photography
						</Text>
						<Image source={image} style={unconfirmedRequestsScreenStyle.imageStyle} />
					</View>

					<View style={unconfirmedRequestsScreenStyle.TextPlusButton}>
						<View style={unconfirmedRequestsScreenStyle.MiddleText}>
							<Text
								style={[
									fontStyles.darkBlue,
									fontStyles.bold,
									fontStyles.subTextStyle,
									unconfirmedRequestsScreenStyle.BottomSpacer,
								]}>
								Wed, APR 1, 2020
								{/* replace with firebase input */}
							</Text>
							<Text
								style={[
									fontStyles.darkBlue,
									fontStyles.bold,
									fontStyles.mainTextStyle,
									unconfirmedRequestsScreenStyle.BottomSpacer,
								]}>
								{/* replace with firebase input */}
								4:00 PM - 5:00 PM
							</Text>
						</View>
						<View style={unconfirmedRequestsScreenStyle.EditButton}>
							<HelpButton
								title={strings.Confirm} // strings.ConfirmRequest
								onPress={() => {}}
								width={screenWidth * 0.25}
								height={screenHeight * 0.04}
							/>
						</View>
					</View>
				</View>
			</HelpView>
		</ScrollView>
	);
};

export default unconfirmedScreen;
