//This component will be the default loading spinner that should be user throughout the entire app
import React from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-spinkit';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from 'prop-types';

//The class that will render the spinner
export default function LoadingSpinner(props) {
	const { isVisible, color } = props;

	//Making sure that the correct prop type (boolean) is passed in
	//An optional colors prop will also be passed in
	LoadingSpinner.propTypes = {
		isVisible: PropTypes.bool.isRequired,
		color: PropTypes.string,
	};
	return (
		<View>
			<Spinner
				isVisible={isVisible}
				size={60}
				type={'ThreeBounce'}
				color={color ? color : colors.lightBlue}
			/>
		</View>
	);
}
