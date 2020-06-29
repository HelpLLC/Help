import { View, Text, SafeAreaView } from 'react-native';
import React, {useState} from 'react';
import screenStyle from '../../../../config/styles/screenStyle';
import fontStyles from '../../../../config/styles/fontStyles';
import { screenHeight } from '../../../../config/dimensions';
import HelpCodeInput from '../../../components/HelpCodeInput/HelpCodeInput';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

  const CELL_COUNT = 6;

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

function EmployeeVerification() {

	return (
		<View style={screenStyle.container}>
			<View style={{ marginTop: screenHeight * 0.1 }}>
				<View>
					<Text
						style={[
							fontStyles.darkBlue,
							fontStyles.bigSubTitleStyle,
							{ textAlign: 'center' },
						]}
					>
						Join a Business
					</Text>
				</View>
                <View>
                   
                </View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
  });
export default EmployeeVerification;
