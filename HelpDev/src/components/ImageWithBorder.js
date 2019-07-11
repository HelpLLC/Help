//This component will represent the image with the thick blue border that will appear when viewing a
//specific product. It will also have a small shadow to give it a floating effect
import React, { Component } from 'react';
import { BoxShadow } from 'react-native-shadow';
import { Image } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';

class ImageWithBorder extends Component {
    //Renders the component
    render() {
        //Fetches the height and width which will be passed in as props, along with of course the actual
        //image
        const { width, height, imageSource } = this.props;
        return (
            <BoxShadow setting={{
                width: width,
                height: height,
                color: colors.gray,
                border: 10,
                radius: height / 2,
                opacity: 0.2,
                x: 0,
                y: 5
            }}>
                <Image
                    source={imageSource}
                    style={{
                        width: width,
                        height: height,
                        borderColor: colors.lightBlue,
                        borderWidth: height / 17,
                        borderRadius: height / 2
                    }} />
            </BoxShadow>
        )
    }
}

//Making sure that the correct prop types are required. Numbers for the width and height
//Not specifying ImageSource because it could either be a number or an object. But it has to be required
ImageWithBorder.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    imageSource: PropTypes.any.isRequired
}

//Exports the module
export default ImageWithBorder;