import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmFooter from '../../../components/ConfirmFooter/ConfirmFooter';
import HelpAlert from '../../../components/HelpAlert';
import TopBanner from '../../../components/TopBanner/TopBanner';
import style from './changePasswordScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import { TextInput } from 'react-native-gesture-handler';

//exporting the profileScreen class
export default function profileScreen(props) {
    //a function for compiling the list of elements in a normalized style
    function renderField(name, onTextChange){
        return( 
            <View style={style.FieldContainer} key={name}>
                <Text style={[fontStyles.bigTextStyle, style.FieldName]}>{name}</Text>
                <TextInput secureTextEntry={true} style={[fontStyles.bigTextStyle, style.FieldInput]} onChangeText={onTextChange}/>
            </View>
        );
    }

    //the state of the function
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    //all of the possible errors
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [weakPasswordError, setWeakPasswordError] = useState(false);
    const [incorrectPasswordError, setIncorrectPasswordError] = useState(false);


    //rendering the screen
    return (
        <View style={style.Body}>
            <TopBanner
				title={strings.ProfilePassword}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
            <View style={style.ContentContainer}>
                {renderField(strings.OldPassword, (text)=>{setOldPassword(text)})}
                {renderField(strings.NewPassword, (text)=>{setNewPassword(text)})}
                {renderField(strings.ConfirmNewPassword, (text)=>{setConfirmNewPassword(text)})}
                <ConfirmFooter
                    text={strings.ProfilePassword}
                    confirmText={strings.PasswordChanged}
                    confirmFunction={()=>{
                        if(newPassword != confirmNewPassword){
                            setPasswordMatchError(true);
                            return false;
                        }
                        let output = FirebaseFunctions.changePassword(oldPassword, newPassword);
                        if(output == 0) return true;
                        else{
                            switch(output){
                                case 'auth/weak-password': setWeakPasswordError(true); break;
                                case 'auth/wrong-password': setIncorrectPasswordError(true); break;
                            }
                            return false;
                        }
                    }}/>
            </View>
            <View style={style.Footer}>
                {/*TODO: add footer here*/}
            </View>
            <HelpAlert
				isVisible={passwordMatchError}
				onPress={() => {
					setPasswordMatchError(false);
				}}
				title={strings.Error}
				message={strings.PasswordsDoNotMatch}
			/>
            <HelpAlert
				isVisible={weakPasswordError}
				onPress={() => {
					setWeakPasswordError(false);
				}}
				title={strings.Error}
				message={strings.WeakPassword}
			/>
            <HelpAlert
				isVisible={incorrectPasswordError}
				onPress={() => {
					setIncorrectPasswordError(false);
				}}
				title={strings.Error}
				message={strings.IncorrectPassword}
			/>
        </View>
    );
}
