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
					width: '150px',
					height: '150px',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '75px',
					alignContent: 'center',
				}}>
				<FontAwesomeIcon
					icon={['fas', icon]}
					color={colors.black}
					style={{
						overflow: 'hidden',
						fontSize: '75px',
						textAlign: 'left',
					}}
				/>
			</View>
			<View style={FeatureCardMobileStyle.cardTitleTextContainer}>
				<Text
					style={{
						...fontStyles.bigTitleStyle,
						...fontStyles.bold,
						...fontStyles.darkBlue,
						fontSize: '25px',
					}}>
					{title}
				</Text>
			</View>
			<View style={FeatureCardMobileStyle.cardTextContainer}>
				<Text
					style={{
						...fontStyles.bigSubTitleStyle,
						...fontStyles.darkBlue,
						fontSize: '20px',
						lineHeight: '30px',
					}}>
					{text}
				</Text>
			</View>
		</View>
	);
};
export default FeatureCardMobile;
