import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import colors from '../../config/colors';
import fonts from '../../config/fontStyles';
import strings from '../../config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import ReactLoading from 'react-loading';
import style from './customerSideMenuStyle';
import { RiMenuFill } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RiHome4Fill } from "react-icons/ri";
import { RiUser3Fill } from "react-icons/ri";


export default function (props) {
    const {
        selected
    } = props;

    function renderOptions(){
        const titles = [strings.Home, strings.Profile];
        const icons = [RiHome4Fill, RiUser3Fill];

        let elements = [];
        for(let i = 0; i < titles.length; i++)
            elements.push(renderRow(icons[i], titles[i], i));

        return elements;
    }
    function renderRow(Icon, title, index){
        return (
            <div style={{...style.row, ...style.bodyRow, ...(index == selected ? style.selected : {})}}>
                <div style={{...style.clickable, ...style.row}}  onClick={()=>{/*TODO: this*/}}>
                    <Icon size={style.icon.size} style={style.icon}/>
                    <text style={style.text}>{title}</text>
                </div>
            </div>
        );
    }

    return (
        <div style={style.container}>
            <style>{style.css}</style>
            
            <div style={{...style.header, ...style.row}}>
                <text style={style.headText}>{strings.Help}</text>
                <RiMenuFill size={style.headIcon.size} style={style.headIcon} onClick={()=>{/*TODO: this*/}}/>
            </div>


            <div style={{...style.body, ...style.column}}>
                {renderOptions()}
            </div>


            <div style={{...style.footer, ...style.row}}>
                <div style={{...style.clickable, ...style.row}}  onClick={()=>{/*TODO: this*/}}>
                    <RiLogoutBoxRLine size={style.icon.size} style={style.icon}/>
                    <text style={style.text}>{strings.LogOut}</text>
                </div>
            </div>
        </div>
    );
}