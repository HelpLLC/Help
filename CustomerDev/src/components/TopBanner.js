//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import topBannerStyle from 'config/styles/componentStyles/topBannerStyle';
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
		<View style={{ flexDirection: 'column' }}>
			<View style={{ height: 5, backgroundColor: colors.white }} />
			<View style={topBannerStyle.style}>
				<View style={{ flex: 0.2 }} />
				<TouchableOpacity
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'flex-start',
						height: screenHeight * 0.12,
					}}
					onPress={leftOnPress ? () => leftOnPress() : () => {}}>
					<Icon
						name={leftIconName}
						type='font-awesome'
						size={size ? size : 40}
						color={colors.lightBlue}
					/>
				</TouchableOpacity>
				<View style={{ flex: 0.2 }} />
				<View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={fontStyles.bigTextStyleBlue}>{title}</Text>
				</View>
				<View style={{ flex: 0.2 }} />
				<TouchableOpacity
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'flex-end',
						height: screenHeight * 0.12,
					}}
					onPress={() => {
						rightOnPress ? () => rightOnPress() : () => {};
					}}>
					<Icon
						name={rightIconName}
						type='font-awesome'
						size={size ? size : 40}
						color={colors.lightBlue}
					/>
				</TouchableOpacity>
				<View style={{ flex: 0.2 }} />
			</View>
		</View>
	);
}
