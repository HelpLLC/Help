//This component will represent the city picker that will allow users to search for a city anywhere in the world and will return
//that location.
import React, { Component } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import strings from 'config/strings';
import googleCityPickerStyle from 'config/styles/componentStyles/googleCityPickerStyle';
import PropTypes from 'prop-types';

class GoogleCityPicker extends Component {
	render() {
		//This component will only take one prop. The onPress method determining what will happen with  the received data
		const { onPress } = this.props;

		return (
			<GooglePlacesAutocomplete
				minLength={2}
				placeholder={this.props.placeholder ? this.props.placeholder : strings.EnterCityDotDotDot}
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
					types: this.props.returnType ? this.props.returnType : '(cities)'
				}}
				styles={{
					container: null,
					textInputContainer: googleCityPickerStyle.textInputContainer,
					listView: googleCityPickerStyle.listView,
					row: googleCityPickerStyle.row,
					powered: googleCityPickerStyle.powered
				}}
				filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
			/>
		);
	}
}

//Determines the props for this function which will be an onPress method that determines what happens with the selected data
//some optional parameters will also be passed
GoogleCityPicker.propTypes = {
	onPress: PropTypes.func.isRequired,
	returnType: PropTypes.string,
	placeholder: PropTypes.string
};

//exports the module
export default GoogleCityPicker;
