//This is going to be the screen where the business's schedule is going to be displayed in a calendar format, allowing for
//customization, and interactions.
import React, { useState } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../../components/TopBanner/TopBanner';
import { Agenda } from 'react-native-calendars';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from '../../components/LoadingSpinner';
import strings from 'config/strings';
import HelpAlert from '../../components/HelpAlert';
import RequestCard from '../../components/RequestCard';

export default function Calendar() {

    const [businessID, setBusinessID]=useState('zjCzqSiCpNQELwU3ETtGBANz7hY2')
    const [businessFetched, setBusinessFetched]=useState(false)
    const [isLoading, setIsLoading]=useState(true)
    const [isErrorVisible, setIsErrorVisible]=useState(false)
    const [selectedDate, setSelectedDate]=useState('')
    const [business, setBusiness]=useState('')
    const [DateString, setDateString]=useState('')
    const [items, setItems]=useState({})
    const [markedDates, setMarkedDates]=useState('')

    return(
        <View>
            <View style={screenStyle.container}>
					<View>
						<TopBanner title={strings.Schedule} />
					</View>
					<Agenda
						items={items}
						style={{ width: screenWidth }}
						theme={{
							selectedDayBackgroundColor: colors.lightBlue,
							selectedDayTextColor: colors.white,
							todayTextColor: colors.black,
							dayTextColor: colors.black,
							dotColor: colors.lightBlue,
							selectedDotColor: colors.white,
							arrowColor: colors.lightBlue,
							monthTextColor: colors.black,
							textDayFontFamily: fontStyles.mainTextStyle.fontFamily,
							textMonthFontFamily: fontStyles.mainTextStyle.fontFamily,
							textDayHeaderFontFamily: fontStyles.mainTextStyle.fontFamily,
							textDayFontSize: fontStyles.subTextStyle.fontSize,
							textMonthFontSize: fontStyles.bigTextStylefontSize
						}}
						markedDates={{
							[dateString]: { selected: true },
							...markedDates
						}}
						refreshing={false}
						//When there is nothing on that day
						renderEmptyData={() => {
							return <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>;
						}}
						//How each item is rendered in the agenda
						renderItem={(item, firstItemInDay) => (
							<View
								style={
									firstItemInDay
										? {
												marginTop: screenHeight * 0.025,
												width: screenWidth * 0.7,
												borderTopColor: colors.gray,
												borderTopWidth: 1.5
										  }
										: {}
								}>
								<RequestCard
									onPress={() => {
										//Goes to the screen for the specific request
										/*this.props.navigation.push('CustomerRequestScreen', {
											requestID: item.requestID
										});*/
									}}
									image={item.image}
									serviceTitle={item.serviceTitle}
									time={item.time}
									customerName={item.customerName}
								/>
							</View>
						)}
						selected={selectedDate}
						minDate={new Date()}
						/*onDayPress={async (newDate) => {
							const dateObject = new Date();
							dateObject.setFullYear(newDate.year);
							dateObject.setMonth(newDate.month - 1);
							dateObject.setDate(newDate.day);
							this.setState({
								selectedDate: dateObject.toLocaleDateString(),
								dateString: newDate.dateString
							});
							const getDayItems = await this.getDayItems(newDate.dateString);
							this.setState({ markedDates: getDayItems.markedDates, items: getDayItems.items });
						}}*/
					/>
				</View>
        </View>
    )
}