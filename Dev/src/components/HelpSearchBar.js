//This component will represent the search bar that will appear in CategoryScreen, CategoriesScreen, and FeaturedScreen & will allow
//the user to filter through an array of products according to what screen the search bar is being displayed from
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import colors from 'config/colors';
import helpSearchBarStyle from 'config/styles/componentStyles/helpSearchBarStyle';

class HelpSearchBar extends Component {
	render() {
		const { onChangeText, value, placeholderText, onSubmitEditing } = this.props;
		return (
			<View
				style={{
					marginTop: Dimensions.get('window').height * 0.02,
					marginBottom: Dimensions.get('window').height * 0.01,
					width: Dimensions.get('window').width * 0.96
				}}>
				{/*  Where we display search */}
				<SearchBar
					placeholder={placeholderText}
					onChangeText={(value) => {
						onChangeText(value);
					}}
					onSubmitEditing={() => {
						onSubmitEditing()
					}}
					onClear={() => {
						//Searches for empty string on clear so all products are redisplayed
						onChangeText("");
						onSubmitEditing();
					}}
					returnKeyType={'search'}
					value={value}
					inputStyle={{
						color: colors.black
					}}
					searchIcon={<Icon name={'search'} type='font-awesome' size={30} color={colors.black} />}
					containerStyle={helpSearchBarStyle.containerStyle}
					inputContainerStyle={helpSearchBarStyle.inputContainerStyle}
				/>
			</View>
		);
	}
}

//Determines the props for this component. For the HelpSearchBar, the components will be the value of the searched input, and
//a function with what to do when that searched input changes. Another prop is the placeholder text displaying what the search bar's
//purpose is
HelpSearchBar.propTypes = {
	onChangeText: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	placeholderText: PropTypes.string.isRequired
};

//Exports the module
export default HelpSearchBar;
