import React, { useState, useEffect } from 'react';
import HelpButton from '../../../components/HelpButton';
import EditText from '../../../components/EditText';
import Typography from '@material-ui/core/Typography';
import './CreateProductScreen.css';
import { FaThumbsUp } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { MdAddCircle } from 'react-icons/md';
import { FlatList, View } from 'react-native-web';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useLocation } from 'react-router-dom';

export default function CreateProductScreen() {
	const location = useLocation();
	const [serviceName, setServiceName] = useState('');
	const [serviceDescription, setServiceDescription] = useState('');
	const [servicePrice, setServicePrice] = useState('');
	const [servicePriceType, setServicePriceType] = useState('');
	const [phoneNumber, setPhoneNumber] = useState(false);
	const [email, setEmail] = useState(false);
	const [requestHours, setRequestHours] = useState(0);
	const [creditCard, setCreditCard] = useState(false);
	const [cash, setCash] = useState(false);
	const [business, setBusiness] = useState(location.state.business);
	const [loaded, setLoaded] = useState(true);
	const [address, setAddress] = useState(false);
	const [questions, setQuestions] = useState([]);

	//This function goes and creates the product in Firebase, then fetches the correct updates business object,
	//and navigates back to the Dashboard screen
	const createProduct = async () => {};
	return (
		<div>
			<h2 className='createproductheading'>Create Service</h2>
			<div class='createproductcontainer'>
				<div>
					<h3>Service Information</h3>
				</div>
				<div>
					<Typography>Service Name</Typography>
					<EditText
						class='createproductinput'
						type='name'
						labelText={'Enter title here'}
						widthPercent={200}
						onChange={setServiceName}
						value={serviceName}
					/>
				</div>
				<div>
					<Typography>Service Description</Typography>
					<EditText
						className='createproductinput'
						labelText={'Give a little description for your customers to see...'}
						widthPercent={300}
						onChange={setServiceDescription}
						value={serviceDescription}
					/>
				</div>

				<div>
					<Typography class='createproducttitles'>Price</Typography>
					<div className='buttonlistcontainer'>
						<DropdownButton id='createproductdropdown-basic-button' title='rate'>
							<Dropdown.Item>per</Dropdown.Item>
							<Dropdown.Item>Test</Dropdown.Item>
						</DropdownButton>
						<EditText class='createproductsecondpriceinput' widthPercent={50} />
					</div>
				</div>
				<div>
					<h3>Select what you need from the customer.</h3>
				</div>
				<div className='buttonlistcontainer'>
					<div>
						<HelpButton
							fullWidth={false}
							label='Phone Number'
							onClick={() => {
								setPhoneNumber(true);
							}}
						/>
					</div>
					<div class='productbuttoncontainer'>
						<HelpButton
							fullWidth={false}
							label='Email'
							onClick={() => {
								setEmail(true);
							}}
						/>
					</div>
					<div class='productbuttoncontainer'>
						<HelpButton
							fullWidth={false}
							label='Address'
							onClick={() => {
								setAddress(true);
							}}
						/>
					</div>
				</div>
				<div class='textmorespace'>
					<h3>Any Additional Questions?</h3>
				</div>
				<div>
					<FlatList
            extraData={questions}
            EmptyCom
						showsHorizontalScrollIndicator={false}
						data={questions}
            keyExtractor={(item, index) => index}
						showsVerticalScrollIndicator={false}
						renderItem={({ item, index }) => {
							console.log(index);
							return (
								<View>
									<Typography>Question {index + 1}</Typography>
									<div className='createproducticondiv'>
										<EditText
											class='createproductinput'
											labelText={'Enter Question Here'}
											widthPercent={300}
											onChange={(text) => {
												const newQuestions = questions;
												newQuestions[index] = text;
												setQuestions(newQuestions);
											}}
											value={item}
										/>
										<FaTrash
											onClick={() => {
												const newQuestions = questions;
												newQuestions.splice(index, 1);
												setQuestions(newQuestions);
											}}
										/>
									</div>
								</View>
							);
						}}
					/>
				</div>
				<div>
					<p>
						Add more questions{' '}
						<MdAddCircle onClick={() => setQuestions(questions.concat(''))} />
					</p>
				</div>
				<div>
					<h3>Service specifics</h3>
				</div>
				<div>
					<Typography>How long will the service take per request?</Typography>
					<div className='createproducticondiv'>
						<EditText
							labelText={'0'}
							widthPercent={50}
							className='createproductedittexts'
						/>
						<p className='createproductparagraphs'>Hours</p>
					</div>
				</div>
				<div>
					<Typography>How many requests can you do at a time?</Typography>
					<div className='createproducticondiv'>
						<EditText
							labelText={'0'}
							widthPercent={50}
							value={requestHours}
							onChange={setRequestHours}></EditText>
						<p className='createproductparagraphs'>Requests</p>
					</div>
				</div>
				<div>
					<h3>How will you accept payments?</h3>
				</div>
				<div className='buttonlistcontainer'>
					<div>
						<HelpButton
							fullWidth={false}
							label='Credit/Debit Card'
							onClick={() => {
								setCreditCard(true);
								setCash(false);
							}}
						/>
					</div>
					<div class='productbuttoncontainer'>
						<HelpButton
							fullWidth={false}
							label='Cash'
							onClick={() => {
								setCreditCard(false);
								setCash(true);
							}}
						/>
					</div>
				</div>
				<div className='textmorespace'>
					<h3>
						You're all set <FaThumbsUp />
					</h3>
				</div>
				<div>
					<HelpButton fullWidth={false} label='Create' onPress={() => createProduct()} />
				</div>
			</div>
		</div>
	);
}
