import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({
    MainSectionContainer: {
        width: screenWidth * 0.92,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: screenHeight * 0.01,
    },
    WorkingHoursSection: {
        width: screenWidth * 0.92,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingVertical: screenHeight * 0.01,
    },
    MainBorder:{
        borderBottomWidth:3,
        borderColor:colors.blue,
    },
    SectionIcon: {
        width: screenWidth * 0.2,
        height: screenHeight * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SectionTextContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'center',
        justifyContent: 'flex-start',
        marginLeft: screenWidth * 0.05,
    },
    SectionTitleText: {
        ...fontStyles.subTextStyle,
        ...fontStyles.darkBlue,
        ...fontStyles.bold,
        marginBottom: screenHeight * 0.01,
    },
    SectionContentText: {
        ...fontStyles.bigTextStyle,
        ...fontStyles.darkBlue,
    },
    SubSectionContainer: {
        flexDirection: 'row',
    },
    SectionScheduleContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        marginTop: screenHeight * 0.02,
    },
    SectionTimeContainer: {
        flexDirection: 'row',
        marginBottom: screenHeight * 0.02,
    },
    SectionText: {
        ...fontStyles.darkBlue,
        ...fontStyles.mainTextStyle,
        paddingHorizontal: screenWidth * 0.03,
        paddingVertical: screenHeight * 0.006,
    },
    SectionTimeText: {
        ...fontStyles.darkBlue,
        ...fontStyles.mainTextStyle,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.blue,
        paddingHorizontal: screenWidth * 0.02,
        paddingVertical: screenHeight * 0.006,
    }
})