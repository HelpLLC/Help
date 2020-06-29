//This class is what appears when the app is first launched. The user can either select to log in
//or sign up
import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
 
import { screenWidth, screenHeight } from '../../../config/dimensions';
import strings from '../../../config/strings';
import fontStyles from '../../../config/styles/fontStyles';
import HelpView from '../../components/HelpView';
import screenStyle from '../../../config/styles/screenStyle';
import logo from '../../../assets/WhiteLogo.png'

class BussinessOrEmployeeScreen extends Component {
	
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Image style={{width: screenWidth *.8, resizeMode: 'contain'}} source={logo}/>
				</View>
				<View style={{ flex:1}}>
                    <View>
                        <Text style={[fontStyles.bigTextStyle, fontStyles.blue]}/>

                    </View>
					<View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
						<HelpButton
							title={strings.Business}
							width={screenWidth * 0.4356}
							height={screenHeight*.0566}
							onPress={() => {
								this.props.navigation.push('EmailPasswordScreen');
							}}
						/>
					</View>
					<View style={{ flexDirection: 'row', marginTop: screenHeight*.025, justifyContent: 'center' }}>
						<HelpButton
							title={strings.Employee}
							width={screenWidth * 0.4356}
							height={screenHeight*.0566}
							onPress={() => {
								this.props.navigation.push('EmailPasswordScreen');
							}}
						/>
					</View>
				</View>
			</HelpView>
		);
	}
}

export default BussinessOrEmployeeScreen;
