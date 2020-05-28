import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../HelpButton/HelpButton';
import PropTypes from 'prop-types';
import fontStyles from '../../config/fontStyles';
import { useHistory } from 'react-router-dom';
import ServiceHistoryCardStyle from './ServiceHistoryCardStyle';

export default function ServiceHistoryCard(props) {
	//Starts out the loading state as true until the image is downloaded from the database
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [image, setImage] = useState(props.image);
	const history = useHistory();

	const loadImage = async () => {
		const { imageFunction } = props;
		const url = await imageFunction();
		setIsImageLoading(false);
		setImage(url);
	};

	// Loads the image (async)
	useEffect(() => {
		// loadImage();
	}, []);

	ServiceHistoryCard.propTypes = {
		//A height & width is required for this component to render. Along with whether it is multiline, and what
		//the onChangeText function will return
		height: PropTypes.number,
		width: PropTypes.number,
		image: PropTypes.string,
	};

	const { width, height } = props;

	return (
		<View>
			<View
				style={{
					paddingStart: '2vh',
					paddingTop: '2vh',
					width: '65vw',
					height: '24vh',
					borderRadius: 25,
               borderWidth: 2,
					borderColor: 'rgba(92, 198, 188, 255)',
				}}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
					}}>
					{' '}
					<Text
						style={{
                     ...fontStyles.bigSubTitleStyle,
                     ...fontStyles.darkBlue,
						}}>
						{' '}
						Photography{' '}
					</Text>
					<View
						style={{
                     alignItems: 'flex-start',
                     marginTop: '1vh',
                     borderRadius: 15,
                     paddingHorizontal: '0.5vw',
                     paddingVertical: '1vh',
							'background': 'linear-gradient(90deg, #5cc6bc, #41cbef)',
						}}>
						<Text
							style={{
                        ...fontStyles.mainTextStyle,
                        ...fontStyles.white
							}}>
							{' '}
							Payment Pending{' '}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
					}}>
					{' '}
					<Image
						style={{
							marginTop: '3vh',
							width: 119,
                     height: 119,
						}}
						source={require('/Users/shreshthkharbanda/Documents/GitHub/Help/WebsiteDev/src/business/BusinessScreens/PastRequests/guy.png')}
					/>
					<View
						style={{
							alignItems: 'flex-start',
							marginStart: '1vw',
							marginTop: '3vh',
						}}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
							}}>
							{' '}
							<Text
								style={{
                           ...fontStyles.subTextStyle,
                           ...fontStyles.darkBlue,
                           marginTop: '2vh'
                        }}>
								{' '}
								Request from{' '}
							</Text>
							<Text
								style={{
                           ...fontStyles.bigTextStyle,
                           ...fontStyles.darkBlue,
                           ...fontStyles.bold,
                           marginTop: '2vh',
                           marginStart: '27vw'
								}}>
								{' '}
								Completed 05 / 02 / 2020{' '}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
							}}>
							{' '}
							<Text
								style={{
                           ...fontStyles.bigSubTitleStyle,
                           ...fontStyles.darkBlue,
                           ...fontStyles.bold,
                           marginStart: '-0.5vw'
								}}>
								{' '}
								John Doe{' '}
							</Text>
							<Text
								style={{
                           ...fontStyles.bigTextStyle,
                           ...fontStyles.darkBlue,
                           ...fontStyles.bold,
                           marginTop: '2vh',
                           marginStart: '22vw'
								}}>
								{' '}
								Total: $180{' '}
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						alignItems: 'flex-start',
                  marginStart: '50vw',
                  marginTop: '-7vh',
                  height: '3vh',
					}}>
					<HelpButton title='View More' width='10vw' onPress={() =>
						history.push({
							pathname: '/viewrequest',
						})
					}/>
				</View>
			</View>
		</View>
	);
}
