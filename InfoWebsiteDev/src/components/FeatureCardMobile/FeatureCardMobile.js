import React from 'react';
import { View, Text } from 'react-native-web';
import FeatureCardMobileStyle from './FeatureCardMobileStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';

const FeatureCardMobile = (props) => {
	const { icon, title, text } = props;
	return (
		<View style={FeatureCardMobileStyle.cardContainer}>
			<View
				style={{
					background: '#00B0F0',
					width: '30vw',
					height: '30vw',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '15vw',
					alignContent: 'center',
				}}>
				<FontAwesomeIcon
					icon={['fas', icon]}
					color={colors.black}
					style={{
						overflow: 'hidden',
						fontSize: '15vw',
						textAlign: 'left',
					}}
				/>
			</View>
			<View style={FeatureCardMobileStyle.cardTitleTextContainer}>
				<Text
					style={{ ...fontStyles.bigTitleStyle, ...fontStyles.bold, ...fontStyles.darkBlue }}>
					{title}
				</Text>
			</View>
			<View style={FeatureCardMobileStyle.cardTextContainer}>
				<Text style={{ ...fontStyles.bigSubTitleStyle, ...fontStyles.bold, ...fontStyles.black }}>
					{text}
				</Text>
			</View>
		</View>
	);
};
export default FeatureCardMobile;
