import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native-web';

export default function TitleComponent(props) {
	TitleComponent.propTypes = {
		text: PropTypes.string.isRequired,
		isCentered: PropTypes.bool.isRequired,
		marginLeft: PropTypes.number,
		fontSize: PropTypes.number,
		backgroundColor: PropTypes.string,
		textColor: PropTypes.string,
	};

	const mystyle = {
		color: props.textColor !== null ? props.textColor : '#00B0F0',
		backgroundColor: props.backgroundColor !== null ? props.backgroundColor : '#fff',
		padding: '10px',
		fontFamily: 'Lucida Grande',
		textAlign: props.isCentered === true ? 'center' : '',
		marginLeft: props.marginLeft,
		fontSize:'2.5vw',
	};

	return (
		<View>
			<div style={mystyle}>{props.text}</div>
		</View>
	);
}
