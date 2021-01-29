import React, { useState, useEffect } from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, ScrollView } from 'react-native';
import style from './viewEmployeesScreenStyle';
import TopBanner from '../../../components/TopBanner/TopBanner';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import profile_pic from './profile_pic.png';
import strings from 'config/strings';
import colors from 'config/colors';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import EmployeeListItem from '../../../components/EmployeeListItem/EmployeeListItem';
import HelpButton from '../../../components/HelpButton/HelpButton';

//exports the dispatchScreen class
export default function viewEmployeesScreen(props) {
	//initial state of the screen
	const [business, setBusiness] = useState();
	const [businessName, setBusinessName] = useState();
	const [loaded, setLoaded] = useState(false);
	const [employeeCode, setEmployeeCode] = useState('');
	const [allEmployees, setAllEmployees] = useState({});
	const [displayEmployees, setDisplayEmployees] = useState({});

	async function getData() {
		FirebaseFunctions.setCurrentScreen('ViewEmployeesScreen', 'viewEmployeesScreen');
		const businessID = props.navigation.state.params;
		const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
		setBusiness(business);
		setBusinessName(business.businessName);
		setEmployeeCode(business.employeeCode);
		setAllEmployees(business.employees);
		setDisplayEmployees(business.employees);
		setLoaded(true);
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<View style={screenStyle.container}>
			<View style={{ ...style.body }}>
				<HelpTextInput
					height={screenHeight * 0.05}
					width={screenWidth * 0.93}
					borderColor={colors.darkBlue}
					isMultiline={false}
					onChangeText={(value) => search(value)}
					additionalIcon={
						<View style={{ marginLeft: screenWidth * 0.08 }}>
							<Icon type='font-awesome' name='search' color={colors.darkBlue} size={20} />
						</View>
					}
				/>
				<View style={{ ...style.button }}>
					<HelpButton
						title={'Invite Employee(s)'}
						width={screenWidth * 0.93}
						height={screenHeight * 0.05}
						bold={false}
					/>
				</View>
			</View>
			<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
				{renderEmployees()}
			</ScrollView>
		</View>
	);

	function search(text) {
		let employees = {};
		for (let i in allEmployees)
			if (allEmployees[i].toLowerCase().includes(text.toLowerCase()))
				employees[i] = allEmployees[i];
		setDisplayEmployees(employees);
	}

	function renderEmployees() {
		let elements = [];
		for (let i in displayEmployees)
			elements.push(
				<EmployeeListItem
					name={displayEmployees[i]}
					buttonText='View More'
					buttonWidth={screenWidth * 0.29}
					buttonHeight={screenHeight * 0.04}
					image={profile_pic}
				/>
			);
		return elements;
	}
}
