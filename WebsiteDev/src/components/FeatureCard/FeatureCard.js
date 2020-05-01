import React from 'react';
import { View, Text } from 'react-native';
import FeatureCardStyle from './FeatureCardStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import strings from '../../config/strings';
import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';

const FeatureCard = (props) => {
	const { icon, title, text } = props;
	return (
		<View style={FeatureCardStyle.cardContainer}>
			<View
				style={{
					background: '#00B0F0',
					width: '10vw',
					height: '10vw',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '5vw',
					alignContent: 'center',
				}}>
				<FontAwesomeIcon
					icon={['fas', icon]}
					color={colors.black}
					style={{
						overflow: 'hidden',
						fontSize: '67px',
						textAlign: 'left',
					}}
				/>
			</View>
			<View style={FeatureCardStyle.cardTitleTextContainer}>
				<Text
					style={{ ...fontStyles.bigSubTitleStyle, ...fontStyles.bold, ...fontStyles.darkBlue }}>
					{title}
				</Text>
			</View>
			<View style={FeatureCardStyle.cardTextContainer}>
				<Text style={{ ...fontStyles.bigTextStyle, ...fontStyles.bold, ...fontStyles.black }}>
					{text}
				</Text>
			</View>
		</View>
	);
};
export default FeatureCard;
