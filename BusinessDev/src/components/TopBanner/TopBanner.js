//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import TopBannerStyle from './TopBannerStyle';
import fontStyles from 'config/styles/fontStyles';

export default function TopBanner(props) {
	//The properties for the TopBanner components. There will be a left icon, banner title,
	//and right icon
	const { leftIconName, leftOnPress, title, rightIconName, rightOnPress, size } = props;

	//These are the propTypes for the topBanner component. It defines whether they are required or not
	//and what their types should be
	TopBanner.propTypes = {
		leftIconName: PropTypes.string,
		leftOnPress: PropTypes.func,
		title: PropTypes.string.isRequired,
		rightIconName: PropTypes.string,
		rightOnPress: PropTypes.func,
	};

	return (
		<View style={TopBannerStyle.entireTopBanner}>
			<TouchableOpacity
				style={TopBannerStyle.leftComponent}
				onPress={leftOnPress ? () => leftOnPress() : () => {}}>
				<Icon
					name={leftIconName}
					type='font-awesome'
					size={size ? size : 40}
					color={colors.white}
				/>
			</TouchableOpacity>
			<Text style={TopBannerStyle.textStyle}>{title}</Text>
			<TouchableOpacity
				style={TopBannerStyle.rightComponent}
				onPress={() => {
					rightOnPress ? () => rightOnPress() : () => {};
				}}>
				<Icon
					name={rightIconName}
					type='font-awesome'
					size={size ? size : 40}
					color={colors.white}
				/>
			</TouchableOpacity>
		</View>
	);
}
