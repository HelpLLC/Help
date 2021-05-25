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
import style from './businessViewScreenStyle';
import servicePicture from './servicePlaceholder.png';
import featuredPicture from './featuredPlaceholder.png';
import Rating from 'react-rating';
import { FaStar } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa';

export default function (props) {
	// props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing
    
    const [expandedServices, setExpandedServices] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState(null);
    const [businessID, setBusinessID] = useState('');

	async function getData() {
		//Declares the screen name in Firebase
		// FirebaseFunctions.setCurrentScreen('ProfileScreen', 'profileScreen');
		// const { businessID: BID } = props.navigation.state.params;

		// const servicesObj = await FirebaseFunctions.call('getServicesByBusinessID', {
		// 	businessID: BID,
		// });

        // //NOTE: I have no idea how the database schema is, as currently the database has no data and the database documentation isn't finished. This data is unused
		// setBusinessID(BID);
		// setProfilePicture(servicesObj);
		setIsLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);


    function renderServices(services){
        let elements = [];
        for(let i = 0; i < (expandedServices ? services.length : 2); i++)
            elements.push(
                <div style={{...style.mainContainer, ...style.row}}>
                    <img src={servicePicture} style={style.serviceImage}/>
                    <div style={{...style.column, marginLeft: 10, marginRight: 10, flex:1}}>
                        <text style={style.serviceTitle}>{services[i]}</text>
                        <Rating initialRating={4} emptySymbol={<FaRegStar size={20} color={'gold'}/>} fullSymbol={<FaStar size={20} color={'gold'}/>} readonly/>
                    </div>
                    <div style={{...style.column, justifyContent: 'center', marginRight: 10}}>
                        <text style={style.serviceText}>{"$100 per hour"}</text>
                        <HelpButton
                            title={strings.Request}
                            isLightButton={false}
                            width={"10vw"}
                            height={35}
                            // biggerText={true}
                            // bold={true}
                            onPress={() => {
                                //TODO: this
                            }}
                        />
                    </div>
                </div>
            );
        return elements;
    }

    function renderFeatured(services){
        let elements = [];
        for(let i = 0; i < services.length; i++)
            elements.push(
                <div style={{...style.secondaryContainer, ...style.row, alignItems: 'center'}}>
                    <img src={featuredPicture} style={style.featuredImage}/>
                    <div style={{...style.column, marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                        <text style={style.featuredText}>{services[i]}</text>
                        <Rating initialRating={4} emptySymbol={<FaRegStar size={20} color={'gold'}/>} fullSymbol={<FaStar size={20} color={'gold'}/>} readonly/>
                        <text style={{...style.featuredText, marginBottom: 5}}>{"$100 per hour"}</text>
                        <HelpButton
                            title={strings.ViewMore}
                            isLightButton={false}
                            width={"8vw"}
                            height={25}
                            subText={true}
                            // biggerText={true}
                            // bold={true}
                            onPress={() => {
                                //TODO: this
                            }}
                        />
                    </div>
                </div>
            );
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
            <div style={style.middleSection}>
                <div style={{...style.column, height: "12%"}}>
                    <text style={style.businessTitle}>{"Magic Hands LLC"}</text>
                    <text style={style.businessDescription}>{"Bussiness Description goes here"}</text>
                </div>
                <div style={{height: "88%", overflowX: "hidden", overflowY: "auto"}}>
                    {renderServices(["Carpet Cleaning", "Room Cleaning", "Gardening", "Lawn Mowing"])}
                    {!expandedServices ? 
                        <div style={{marginTop: 20}}> <HelpButton
                            title={strings.SeeAllServices}
                            isLightButton={false}
                            width={"100%"}
                            height={40}
                            // biggerText={true}
                            // bold={true}
                            onPress={() => {
                                setExpandedServices(true);
                            }}
                        /> </div>
                    : null}
                </div>
            </div>
            {/* <div style={style.rightSection}>
                <div style={{...style.mainContainer, ...style.column, alignItems: "center"}}>
                    <text style={style.featuredTitle}>{strings.FeaturedServices}</text>
                    {renderFeatured(["Carpet Cleaning", "Room Cleaning"])}
                </div>
            </div> NOTE: this is the featured services, commented out as it isn't supported as of yet*/}
        </div>
    );
}