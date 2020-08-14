import React from 'react';
import { View, TextInput, Keyboard } from 'react-native';
import { screenHeight, screenWidth } from '../../../config/dimensions';

export default class HelpCodeInput {
	render() {
		return (
			<View style={{ flexDirection: 'row', width: screenWidth * 0.9 }}>
				<TextInput
					style={{ flex: 1 }}
					ref='input_1'
					keyboardType={'numeric'}
					maxLength={1}
					value={this.state.value}
					underlineColorAndroid='rgba(0,0,0,0)'
					numberOfLines={1}
					secureTextEntry={true}
					onChangeText={(value) => {
						this.setState({ value });
						if (value) this.refs.input_2.focus(); //assumption is TextInput ref is input_2
					}}
				/>
				<TextInput
					style={{ flex: 1 }}
					ref='input_2'
					keyboardType={'numeric'}
					style={styles.inputText}
					maxLength={1}
					value={this.state.value}
					underlineColorAndroid='rgba(0,0,0,0)'
					numberOfLines={1}
					secureTextEntry={true}
					onChangeText={(value) => {
						this.setState({ value });
						if (value) Keyboard.dismiss(); //assumption is TextInput ref is input_2
					}}
				/>
			</View>
		);
	}
}
