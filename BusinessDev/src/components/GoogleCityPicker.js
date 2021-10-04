//This component will represent the city picker that will allow users to search for a city anywhere in the world and will return
//that location.
import React, { useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import strings from 'config/strings';
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from 'prop-types';
import colors from 'config/colors';

export default function GoogleCityPicker(props) {
	//If there is a prop passed in as initial text to display in the text input, this function will do that
	useEffect(() => {
		if (props.initialText) {
			this.locationRef.setAddressText(props.initialText);
		}
	}, []);
	//This component will only take one prop. The onPress method determining what will happen with  the received data
	const { onPress } = props;

	//Determines the props for this function which will be an onPress method that determines what happens with the selected data
	//some optional parameters will also be passed
	GoogleCityPicker.propTypes = {
		onPress: PropTypes.func.isRequired,
		returnType: PropTypes.string,
		placeholder: PropTypes.string,
		displayList: PropTypes.bool,
	};

	return (
		<GooglePlacesAutocomplete
			minLength={2}
			placeholder={props.placeholder ? props.placeholder : strings.EnterCityDotDotDot}
			autoFocus={false}
			returnKeyType={'search'}
			fetchDetails={true}
			onFail={error => console.error(error)}
			onPress={(data, details) => {
				//Fetches the name of the selected city along with the longitude and latitude
				// console.log(data);
				// console.log(details);
				const locationName = data.description;
				const { lat, lng } = details.geometry.location;

				//Passes those into the props function
				onPress(locationName, lat, lng);
			}}
			query={{
				// key: 'AIzaSyCJ39Pp39vFJOy6pbA0NLdjhzXIqSEAzFs',
				key: 'AIzaSyA4K0JjyrWik5p13qMMdZUEmnfXL-ZSGbc',
				language: 'en',
				types: props.returnType ? props.returnType : '(cities)',
			}}
			styles={{
				//The style for the container itself
				textInputContainer: {
					borderWidth: 3,
					borderColor: colors.lightBlue,
					borderTopWidth: 3,
					paddingBottom: 43.55, //Has to be exact amouunt due to wonky component styles
					borderBottomWidth: 3,
					borderTopColor: colors.lightBlue,
					borderBottomColor: colors.lightBlue,
					borderRadius: 20,
					justifyContent: 'center',
					alignSelf: 'center',
					backgroundColor: colors.white,
					width: screenWidth * 0.6,
				},
				//The style that contains the results of the entered text
				listView: {
					height: true ? screenHeight * 0.2 : 0,
					borderColor: colors.lightBlue,
					marginTop: screenHeight * 0.01,
					borderRadius: 20,
					borderWidth: 3,
					width: screenWidth * 0.6,
					backgroundColor: colors.white,
				},
				//The style that renders each row that has a city
				row: {
					borderBottomColor: colors.lightGray,
					borderBottomWidth: 1,
				},
				textInput: { color: colors.black },
				//The style that renders the "powered by Google" image
				powered: {
					height: 0,
					width: 0,
				},
			}}
			filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
		/>
	);
}
