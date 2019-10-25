//This component will represent the card which which will display a category.
//The card will only be accessible from requester side. Cicking on the category would allow them to view
//the category and view services that are part of this category.
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import categoryCardStyle from 'config/styles/componentStyles/categoryCardStyle';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { BoxShadow } from 'react-native-shadow';

//The component class
class CategoryCard extends Component {
	//Starts out the loading state as true until the image is downloaded from the database
	state = {
		isImageLoading: true,
		image: ''
	};

	//Loads the image (async)
	async componentDidMount() {
		const { imageFunction } = this.props;
		const url = await imageFunction();

		this.setState({
			isImageLoading: false,
			image: url
		});
	}

	//Renders the component
	render() {
		//The props for the CategoryCard. It will take in a category title, an
		//image to display, and an onPress method.
		const { categoryTitle, onPress } = this.props;

		//Fetches the image and the isImageLoading from the state
		const { isImageLoading, image } = this.state;
		//Returns the rendered component
		return (
			<TouchableOpacity
				onPress={onPress}
				style={{
					width: Dimensions.get('window').width * 0.45,
					height: Dimensions.get('window').height * 0.35,
					alignItems: 'center',
					justifyContent: 'center'
				}}>
				<View>
					<BoxShadow
						setting={{
							width: Dimensions.get('window').width * 0.45,
							height: Dimensions.get('window').height * 0.275,
							color: colors.gray,
							border: 10,
							radius: Dimensions.get('window').height * 0.0439238653,
							opacity: 0.2,
							x: 0,
							y: 10
						}}>
						<View style={categoryCardStyle.style}>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								{isImageLoading === true ? (
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<LoadingSpinner isVisible={true} />
									</View>
								) : (
									<Image
										source={image}
										style={{
											width: Dimensions.get('window').width * 0.25,
											height: Dimensions.get('window').width * 0.25
										}}
									/>
								)}
							</View>
							<View
								style={{
									flexDirection: 'column',
									flex: 0.5,
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text
									style={[
										fontStyles.mainTextStyleBlack,
										{
											paddingLeft: Dimensions.get('window').width * 0.025
										}
									]}>
									{categoryTitle}
								</Text>
							</View>
						</View>
					</BoxShadow>
				</View>
			</TouchableOpacity>
		);
	}
}

//These are the propTypes for the topBanner component. It defines whether they are required or not
//and what their types should be
CategoryCard.propTypes = {
	categoryTitle: PropTypes.string.isRequired,
	imageFunction: PropTypes.func.isRequired,
	onPress: PropTypes.func.isRequired
};

//exports the module
export default CategoryCard;
