//This class will render the react-natvie-image-crop-picker component. It will take in a width &
//and a height as props in order to know what dimensions crop the picker. It will also take in an isShowing
//to determine whether to show the prop or not.
import React, { Component } from 'react';
import strings from 'config/strings';
import ActionSheet from 'react-native-actionsheet';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import Picker from 'react-native-image-crop-picker';

export default function ImagePicker(props) {
	//Renders the action sheet that will allow the user to either choose between choosing from camera roll or
	//opening the camera
	const { isShowing, onImageSelected, imageWidth, imageHeight, onImageCanceled } = props;

	//Displays the action sheet
	if (isShowing === true) {
		this.ActionSheet.show();
	} 

	return (
		<ActionSheet
			ref={(o) => (this.ActionSheet = o)}
			title={strings.SelectPhoto}
			options={[strings.TakePhotoDotDotDot, strings.ChooseFromLibraryDotDotDot, strings.Cancel]}
			cancelButtonIndex={2}
			styles={{
				titleText: fontStyles.subTextStyleBlue,
			}}
			destructiveButtonIndex={2}
			onPress={async (index) => {
				if (index === 0) {
					try {
						const image = await Picker.openCamera({
							width: imageWidth,
							height: imageHeight,
							cropping: true,
							includeBase64: true,
						});
						await onImageSelected(image);
					} catch (error) {
						//This is the case that the user cancels image selection
						onImageCanceled();
					}
				} else if (index === 1) {
					try {
						const image = await Picker.openPicker({
							width: imageWidth,
							height: imageHeight,
							cropping: true,
							includeBase64: true,
						});
						await onImageSelected(image);
					} catch (error) {
						//This is the case that the user cancels image selection
						onImageCanceled();
					}
				}
			}}
		/>
	);
}
