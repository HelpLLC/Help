//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import style from './ConfirmFooterStyle';
import HelpButton from '../HelpButton/HelpButton'
import fontStyles from 'config/styles/fontStyles';

export default function ConfirmFooter(props) {
	//initalizing the parameters passed in
	const { text, confirmText, confirmFunction, absolute = true } = props;

	ConfirmFooter.propTypes = {
		text: PropTypes.string,
		confirmText: PropTypes.string,
		confirmFunction: PropTypes.func,
		absolute: PropTypes.bool,
	};

    const [confirmed, setConfirmed] = useState(false);
    const [timeout, addTimeout] = useState({});

	return (
		<View style={[style.MainContainer, absolute ? style.Absolute : {}]}>
			<HelpButton
				title={text}
				width={300}
				height={50}
				bigText={true}
				bold={true}
				onPress={() => {
					if(confirmFunction()){
						clearTimeout(timeout);
						setConfirmed(true);
						addTimeout(setTimeout(() => {
							setConfirmed(false);
						}, 3000));
					}
				}}
			/>
			<View style={style.ConfirmationContainer} opacity={confirmed ? 1.0 : 0.0}>
				<Text style={[fontStyles.mainTextStyle, style.ConfirmationText]}>{confirmText}</Text>
			</View>
		</View>
	);
}
