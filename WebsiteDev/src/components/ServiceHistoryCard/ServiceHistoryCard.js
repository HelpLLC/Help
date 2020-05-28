import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../HelpButton/HelpButton';
import PropTypes from 'prop-types';
import fontStyles from '../../config/fontStyles';
import strings from '../../config/strings';
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
		height: PropTypes.number,
		width: PropTypes.number,
      image: PropTypes.string,
      service: PropTypes.string,
      paymentStatus: PropTypes.string,
      name: PropTypes.string,
      completedDate: PropTypes.string,
      total: PropTypes.string,
	};

	const { width, height, service, paymentStatus, name, completedDate, total } = props;

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
						{service}
					</Text>
					<View
						style={{
                     alignItems: 'flex-start',
                     marginTop: '0.5vh',
                     borderRadius: 15,
                     marginStart: '1vw',
                     paddingHorizontal: '0.5vw',
                     paddingVertical: '1vh',
							'background': 'linear-gradient(90deg, #5cc6bc, #41cbef)',
						}}>
						<Text
							style={{
                        ...fontStyles.mainTextStyle,
                        ...fontStyles.white
							}}>
							{paymentStatus}
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
								{strings.RequestFromHeader}
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
								{strings.CompletedColon} {completedDate}
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
								{name}
							</Text>
							<Text
								style={{
                           ...fontStyles.bigTextStyle,
                           ...fontStyles.darkBlue,
                           ...fontStyles.bold,
                           marginTop: '2vh',
                           marginStart: '23.5vw'
								}}>
								{' '}
								{strings.TotalColonDollar}{total}
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
