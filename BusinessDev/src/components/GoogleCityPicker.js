//This component will represent the city picker that will allow users to search for a city anywhere in the world and will return
//that location.
import React, { Component, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import strings from 'config/strings';
import { screenWidth, screenHeight } from 'config/dimensions';
import googleCityPickerStyle from 'config/styles/componentStyles/googleCityPickerStyle';
import PropTypes from 'prop-types';
import colors from 'config/colors';

export default function GoogleCityPicker(props) {
	//If there is a prop passed in as initial text to display in the text input, this function will do that
	useEffect(() => {
		if (props.initialText) {
			this.locationRef.setAddressText(props.initialText);
		}
	});
	//This component will only take one prop. The onPress method determining what will happen with  the received data
	const { onPress } = props;

	//Determines the props for this function which will be an onPress method that determines what happens with the selected data
	//some optional parameters will also be passed
	GoogleCityPicker.propTypes = {
		onPress: PropTypes.func.isRequired,
		returnType: PropTypes.string,
		placeholder: PropTypes.string,
	};

	return (
		<GooglePlacesAutocomplete
			ref={(instance) => {
				this.locationRef = instance;
			}}
			minLength={2}
			placeholder={props.placeholder ? props.placeholder : strings.EnterCityDotDotDot}
			autoFocus={false}
			returnKeyType={'search'}
			listViewDisplayed={'false'}
			fetchDetails={true}
			onPress={(data, details) => {
				//Fetches the name of the selected city along with the longitude and latitude
				const locationName = data.description;
				const { lat, lng } = details.geometry.location;

				//Passes those into the props function
				onPress(locationName, lat, lng);
			}}
			query={{
				key: 'AIzaSyCJ39Pp39vFJOy6pbA0NLdjhzXIqSEAzFs',
				language: 'en',
				types: props.returnType ? props.returnType : '(cities)',
			}}
			styles={{
				container: null,
				textInputContainer: googleCityPickerStyle.textInputContainer,
				listView: googleCityPickerStyle.listView,
				row: googleCityPickerStyle.row,
				textInput: { color: colors.black },
				powered: googleCityPickerStyle.powered,
			}}
			filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
		/>
	);
}
