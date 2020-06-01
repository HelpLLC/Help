import React, { useState } from 'react';
import './EditProfile.css';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import strings from '../../../config/strings';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import TimePicker from '../../../components/TimePicker/TimePicker';
import Resizer from 'react-image-file-resizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../CreateProductScreen/CreateProductScreen.css';

const EditProfile = () => {
	const [companyInfoSelected, setCompanyInfoSelected] = useState(true);
	const [businessScheduleSelected, setBusinessInfoSelected] = useState(false);
	const [passwordSelected, setPasswordSelected] = useState(false);
	const [mondayStartTime, setMondayStartTime] = useState();
	const [tuesdayStartTime, setTuesdayStartTime] = useState();
	const [wednesdayStartTime, setWednesdayStartTime] = useState();
	const [thursdayStartTime, setThursdayStartTime] = useState();
	const [fridayStartTime, setFridayStartTime] = useState();
	const [saturdayStartTime, setSaturdayStartTime] = useState();
	const [sundayStartTime, setSundayStartTime] = useState();
	const [mondayEndTime, setMondayEndTime] = useState();
	const [tuesdayEndTime, setTuesdayEndTime] = useState();
	const [wednesdayEndTime, setWednesdayEndTime] = useState();
	const [thursdayEndTime, setThursdayEndTime] = useState();
	const [fridayEndTime, setFridayEndTime] = useState();
	const [saturdayEndTime, setSaturdayEndTime] = useState();
	const [sundayEndTime, setSundayEndTime] = useState();
	const [image, setImage] = useState('');
	const [imagePreview, setImagePreview] = useState('');

	return (
		<div className='editProfileContainer'>
			<div className='sidebarHolder'></div>
			<div>
				<div className='editProfileCard'>
					<div className='cardSideBarContainer'>
						<div className='infoHolder'>
							<div className='imageContainer' />
							<div className='nameContainer'>
								<text className='mainTextStyle black bold'>Business</text>
							</div>
						</div>
						<div className='titleColumnContainer'>
							<div
								className={
									companyInfoSelected
										? 'sectionTitleContainerSelected'
										: 'sectionTitleContainer'
								}
								onClick={() => {
									setBusinessInfoSelected(false);
									setPasswordSelected(false);
									setCompanyInfoSelected(true);
								}}
							>
								<div className='textPositioner'>
									<text
										className={
											companyInfoSelected
												? 'subTextStyle white bold'
												: 'subTextStyle darkBlue bold'
										}
									>
										{strings.CompanyInfo}
									</text>
								</div>
							</div>
						</div>
						<div
							className={
								businessScheduleSelected
									? 'sectionTitleContainerSelected'
									: 'sectionTitleContainer'
							}
							onClick={() => {
								setCompanyInfoSelected(false);
								setPasswordSelected(false);
								setBusinessInfoSelected(true);
							}}
						>
							<div className='textPositioner'>
								<text
									className={
										businessScheduleSelected
											? 'subTextStyle white bold'
											: 'subTextStyle darkBlue bold'
									}
								>
									{strings.Business}
								</text>
							</div>
						</div>
						<div
							className={
								passwordSelected
									? 'sectionTitleContainerSelected'
									: 'sectionTitleContainer'
							}
							onClick={() => {
								setCompanyInfoSelected(false);
								setBusinessInfoSelected(false);
								setPasswordSelected(true);
							}}
						>
							<div className='textPositioner'>
								<text
									className={
										passwordSelected
											? 'subTextStyle white bold'
											: 'subTextStyle darkBlue bold'
									}
								>
									{strings.Password}
								</text>
							</div>
						</div>
					</div>
					{companyInfoSelected ? (
						<div>
							<div >
								<button className='imagePickerSection2'>
									<div className='topRow'>
										<div>
											<input
												type='file'
												id='upload'
												style={{ display: 'none' }}
												onChange={(e) => {
													setImagePreview(
														URL.createObjectURL(e.target.files[0])
													);
													if (e.target.files.length) {
														Resizer.imageFileResizer(
															e.target.files[0],
															400,
															250,
															'JPEG',
															100,
															0,
															(uri) => {
																setImage(uri);
															},
															'blob'
														);
													}
												}}
											/>
											<label htmlFor='upload'>
												{image.preview ? (
													<img
														src={image.preview}
														alt='dummy'
														width='300'
														height='300'
													/>
												) : (
													<>
														{image === '' ? (
															<div
																className='imagePickerCircle'
																id='imagePickerCircle'
															>
																<FontAwesomeIcon
																	icon={'camera'}
																	color='#5cc6bc'
																	size='7x'
																/>
															</div>
														) : (
															<img
																src={imagePreview}
																className='serviceImage'
															/>
														)}
													</>
												)}
											</label>
										</div>
										<div className='helpbutton4'>
											<HelpButton
												title={strings.EditProfilePicture}
												width='15vw'
												height='5vh'
											/>
										</div>
									</div>
								</button>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.BusinessName}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
								<div className='input2'>
									<text className='subTextStyle darkBlue bold'>
										{strings.Email}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.Website}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
								<div className='input2'>
									<text className='subTextStyle darkBlue bold'>
										{strings.PhoneNumber}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.Address}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'40vw'}
											isMultiline={false}
										/>
									</div>
								</div>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.BusinessDescription}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'10vh'}
											width={'40vw'}
											isMultiline={true}
										/>
									</div>
								</div>
							</div>
							<div className='helpbutton'>
								<HelpButton title={strings.SaveChanges} width='20vw' height='7.5vh' />
							</div>
						</div>
					) : businessScheduleSelected ? (
						<div>
							<div id='business_schedule' className='bigTitleTextStyle gray'>
								{strings.BusinessSchedule}
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Monday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={mondayStartTime}
									onChange={(time) => setMondayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={mondayEndTime}
									onChange={(time) => setMondayEndTime(time)}
								/>
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Tuesday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={tuesdayStartTime}
									onChange={(time) => setTuesdayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={tuesdayEndTime}
									onChange={(time) => setTuesdayEndTime(time)}
								/>
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Wednesday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={wednesdayStartTime}
									onChange={(time) => setWednesdayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={wednesdayEndTime}
									onChange={(time) => setWednesdayEndTime(time)}
								/>
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Thursday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={thursdayStartTime}
									onChange={(time) => setThursdayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={thursdayEndTime}
									onChange={(time) => setThursdayEndTime(time)}
								/>
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Friday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={fridayStartTime}
									onChange={(time) => setFridayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={fridayEndTime}
									onChange={(time) => setFridayEndTime(time)}
								/>
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Saturday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={saturdayStartTime}
									onChange={(time) => setSaturdayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={saturdayEndTime}
									onChange={(time) => setSaturdayEndTime(time)}
								/>
							</div>
							<div className='days'>
								<label id='day_title' className='mainTextStyle gray'>
									{strings.Sunday}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={sundayStartTime}
									onChange={(time) => setSundayStartTime(time)}
								/>
								<label id='to_text' className='mainTextStyle gray'>
									{strings.to}
								</label>
								<TimePicker
									widthPercent={'10vw'}
									marginLeft='20px'
									value={sundayEndTime}
									onChange={(time) => setSundayEndTime(time)}
								/>
							</div>

							<div className='helpbutton3'>
								<HelpButton title={strings.SaveChanges} width='20vw' height='7.5vh' />
							</div>
						</div>
					) : (
						<div>
							<div className='titleContainer'>
								<text className='bigTextStyle darkBlue bold'>
									{strings.ChangePassword}
								</text>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.OldPassword}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.NewPassword}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
							</div>
							<div className='secondRow'>
								<div className='input1'>
									<text className='subTextStyle darkBlue bold'>
										{strings.ConfirmNewPassword}
									</text>
									<div className='inputcontainer'>
										<HelpTextInput
											height={'5vh'}
											width={'15vw'}
											isMultiline={false}
										/>
									</div>
								</div>
							</div>
							<div className='helpbutton2'>
								<HelpButton title={strings.SaveChanges} width='20vw' height='7.5vh' />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
