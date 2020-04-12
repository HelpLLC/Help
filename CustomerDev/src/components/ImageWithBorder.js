//This component will represent the image with the thick blue border that will appear when viewing a
//specific product. It will also have a small shadow to give it a floating effect
import React, { Component } from 'react';
import { BoxShadow } from 'react-native-shadow';
import { View } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from './LoadingSpinner';
import images from 'config/images/images';
import FastImage from 'react-native-fast-image';

class ImageWithBorder extends Component {
	//Starts out the loading state as true until the image is downloaded from the database
	state = {
		isImageLoading: true,
		image: { uri: images.blankWhite }
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
		//Fetches the height and width which will be passed in as props, along with of course the actual
		//image
		const { width, height } = this.props;
		const { isImageLoading, image } = this.state;

		return (
			<BoxShadow
				setting={{
					width: width,
					height: height,
					color: colors.gray,
					border: 10,
					radius: this.props.radius ? this.props.radius : height / 2,
					opacity: 0.2,
					x: 0,
					y: 5
				}}>
				{isImageLoading === true ? (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				) : (
						<FastImage
							source={image}
							style={{
								width: width,
								height: height,
								borderColor: colors.lightBlue,
								borderWidth: this.props.borderWidth ? this.props.borderWidth : height / 17,
								borderRadius: this.props.radius ? this.props.radius : height / 2
							}}
						/>
				)}
			</BoxShadow>
		);
	}
}

//Making sure that the correct prop types are required. Numbers for the width and height
//Not specifying ImageSource because it could either be a number or an object. But it has to be required
ImageWithBorder.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	imageFunction: PropTypes.func.isRequired
};

//Exports the module
export default ImageWithBorder;
