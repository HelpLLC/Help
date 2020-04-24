//This component will represent the search bar that will appear in CategoryScreen, CategoriesScreen, and FeaturedScreen & will allow
//the user to filter through an array of products according to what screen the search bar is being displayed from
import React from 'react';
import { View } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';

export default function HelpSearchBar(props) {
	//Determines the props for this component. For the HelpSearchBar, the components will be the value of the searched input, and
	//a function with what to do when that searched input changes. Another prop is the placeholder text displaying what the search bar's
	//purpose is
	HelpSearchBar.propTypes = {
		onChangeText: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired,
		placeholderText: PropTypes.string.isRequired,
	};
	const { onChangeText, value, placeholderText, onSubmitEditing } = props;
	return (
		<View
			style={{
				marginTop: screenHeight * 0.02,
				marginBottom: screenHeight * 0.01,
				width: screenWidth * 0.96,
			}}>
			{/*  Where we display search */}
			<SearchBar
				placeholder={placeholderText}
				onChangeText={(value) => {
					onChangeText(value);
				}}
				onSubmitEditing={() => {
					onSubmitEditing();
				}}
				returnKeyType={'search'}
				value={value}
				inputStyle={{
					color: colors.black,
				}}
				searchIcon={
					<Icon name={'search'} type='font-awesome' size={30} color={colors.black} />
				}
				containerStyle={{
					backgroundColor: colors.lightBlue,
					borderRadius: 30,
					borderBottomColor: colors.lightBlue,
					borderTopColor: colors.lightBlue,
				}}
				inputContainerStyle={{ backgroundColor: colors.white, borderRadius: 20 }}
			/>
		</View>
	);
}
