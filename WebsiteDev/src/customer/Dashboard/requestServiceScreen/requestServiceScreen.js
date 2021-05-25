import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import colors from '../../../config/colors';
import HelpButton from '../../../components/HelpButton/HelpButton';
import fonts from '../../../config/fontStyles';
import strings from '../../../config/strings';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import HelpAlert from '../../../components/HelpAlert/HelpAlert';
import ReactLoading from 'react-loading';
import SideMenu from "../../../components/customerSideMenu/customerSideMenu"
import style from './requestServiceScreenStyle';
import { MdArrowBack } from 'react-icons/md';
import profilePic from './placeholderProfilePic.png';

export default function (props) {
	// props = {navigation:{push:()=>{},state:{params:{serviceID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing
    
    // const [expandedServices, setExpandedServices] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [service, setService] = useState(null);
    const [serviceID, setServiceID] = useState('');

	async function getData() {
		//Declares the screen name in Firebase
		// FirebaseFunctions.setCurrentScreen('ProfileScreen', 'profileScreen');
		// const { serviceID: SID } = props.navigation.state.params;

		// const serviceObj = await FirebaseFunctions.call('getServiceByID', {
		// 	serviceID: SID,
		// });

        // //NOTE: I have no idea how the database schema is, as currently the database has no data and the database documentation isn't finished. This data is unused
		// setServiceID(SID);
        // setService(serviceObj);
		setIsLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);


    function renderOptions(arr){
        let elements = [];
        for(let i in arr)
            elements.push(
                <option value={arr[i]}>{arr[i]}</option>
            );
        return elements;
    }
    function getTimes(){
        let arr = [];
        for(let i = 1; i < 24; i++)
            arr.push(i+":00");
        return arr;
    }
    function renderQuestions(arr){
        let elements = [];
        for(let i in arr){
            elements.push(
                <text style={style.serviceText}>{arr[i]}</text>
            );
            elements.push(
                <input style={style.inputBox} onChange={()=>{/*TODO: this*/}}></input>
            );
        }
        return elements;
    }

    if(isLoading) return (
        <div style={style.body}>
            <SideMenu selected={0}/>
            <div style={{ justifyContent: 'center', alignItems: 'center', flex: 1, display:'flex' }}>
                <text style={{...fonts.bigSubTitleStyle, color: colors.darkBlue, fontWeight: 'bold', textAlign:'center'}}>{strings.Loading}</text>
            </div>
        </div>
    );
    else return (
        <div style={style.body}>
            <style>{style.css}</style>
            <SideMenu selected={0}/>
            <div style={{padding: 25, flex:1}}>
                <div style={{...style.mainContainer, ...style.column}}>
                    <div style={style.row}>
                        <MdArrowBack color={colors.blue} size={style.backButton.size} style={{...style.backButton}} onClick={()=>{/*TODO: this*/}}/>
                        <text style={style.serviceTitle}>{"Carpet Cleaning"}</text>
                    </div>

                    <div style={style.row}>
                        <img src={profilePic} style={{borderRadius: 100, width: 120, height: 120}}/>
                        <div style={{...style.column, marginLeft: 10, justifyContent: 'center'}}>
                            <text style={style.serviceText}>{strings.OfferedBy}</text>
                            <text style={style.serviceBigText}>{"Magic Hands LLC"}</text>
                        </div>
                    </div>

                    <text style={{...style.serviceBigText, marginLeft: 10, marginTop: 20, marginBottom: 5}}>{strings.Questions}</text>

                    <div style={{...style.row, flex:1, marginBottom: 10}}>
                        <div style={style.leftColumn}>
                            <text style={style.serviceText}>{strings.Day}</text>
                            <div>
                                <select style={style.selectionBox} onChange={()=>{/*TODO: this*/}}>
                                    {renderOptions(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'])}
                                </select>
                            </div>

                            <text style={style.serviceText}>{strings.Time}</text>
                            <div style={{...style.row, alignItems: 'center'}}>
                                <select style={style.selectionBox} onChange={()=>{/*TODO: this*/}}>
                                    {renderOptions(getTimes())}
                                </select>
                                <text style={{...style.inlineServiceText, marginTop: 0}}>{strings.To}</text>
                                <select style={style.selectionBox} onChange={()=>{/*TODO: this*/}}>
                                    {renderOptions(getTimes())}
                                </select>
                            </div>
                            <div style={{...style.row, alignItems: 'center', marginTop: 5}}>
                                <text style={{...style.inlineServiceText, marginTop: 0}}>{strings.Repeat}</text>
                                <select style={style.selectionBox} onChange={()=>{/*TODO: this*/}}>
                                    {renderOptions(['Daily', 'Weekly', 'Monthly', 'Quartery'])}
                                </select>
                            </div>

                            {renderQuestions(["How many carpets do you have?", "What is your address?", "Which rooms will need cleaning?"])}

                        </div>
                        <div style={style.rightColumn}>
                            <div style={{...style.column, alignItems: 'center'}}>
                                <text style={{...style.serviceBigText, marginBottom: 10}}>{strings.Payment}</text>
                                <select style={style.selectionBox} onChange={()=>{/*TODO: this*/}}>
                                    {renderOptions(['Credit Card', 'Debit Card'])}
                                </select>
                            </div>

                            <div style={{...style.row, width: '100%', }}>
                                <div style={style.columnField}>
                                    <text style={style.inlineServiceText}>{strings.FirstName}</text>
                                    <input style={style.inputBox} onChange={()=>{/*TODO: this*/}}></input>
                                </div>
                                <div style={style.inlineSpacer}/>
                                <div style={style.columnField}>
                                    <text style={style.inlineServiceText}>{strings.LastName}</text>
                                    <input style={style.inputBox} onChange={()=>{/*TODO: this*/}}></input>
                                </div>
                            </div>

                            <text style={style.inlineServiceText}>{strings.CardNumber}</text>
                            <input style={style.inputBox} onChange={()=>{/*TODO: this*/}}></input>

                            
                            <div style={{...style.row, width: '100%'}}>
                                <div style={style.columnField}>
                                    <text style={style.inlineServiceText}>{strings.Expiration}</text>
                                    <input style={style.inputBox} onChange={()=>{/*TODO: this*/}}></input>
                                </div>
                                <div style={style.inlineSpacer}/>
                                <div style={style.columnField}>
                                    <text style={style.inlineServiceText}>{strings.CCV}</text>
                                    <input style={style.inputBox} onChange={()=>{/*TODO: this*/}}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <HelpButton
                        title={strings.Request}
                        isLightButton={false}
                        width={"40vw"}
                        height={40}
                        // biggerText={true}
                        // bold={true}
                        onPress={() => {
                            //TODO: this

                            //NOTE: this as well as some above fields are left unused for a few reasons:
                            //  - stripe needs to be able to access the payment information and create a payment token to submit a request
                            //  - we currently have no support for repeatable requests
                            //  - we probably need to slighlty change this UI to add a date field for the request
                        }}
                    />
                </div>
            </div>
        </div>
    );
}