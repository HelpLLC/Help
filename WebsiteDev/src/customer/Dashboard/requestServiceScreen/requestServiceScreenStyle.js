import React, { useState, useEffect } from 'react';
import colors from '../../../config/colors';
import fonts from '../../../config/fontStyles';

export default {
    body:{
        flex: 1,
        boxSizing: "border-box",
        flexDirection: "row",
        alignItems:'center',
        display: "flex",
        margin: 0,
        border: 0,
    },
    column:{
        flexDirection: "column",
        display: "flex",
    },
    row:{
        flexDirection: "row",
        // alignItems:"center",
        display: "flex",
    },

    mainContainer:{
        border:`2px solid ${colors.fountainBlue}`,
        background: colors.white,
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 20,
        padding: 10,
        margin: 0,
        boxShadow: `0px 3px 2px ${colors.fountainBlue}`,
    },
    leftColumn:{
        flexDirection: "column",
        display: "flex",
        width: "60%",
        boxSizing: "border-box",
        paddingRight: 10,
    },
    rightColumn:{
        borderLeft:`2px solid ${colors.fountainBlue}`,
        flexDirection: "column",
        display: "flex",
        width: "40%",
        boxSizing: "border-box",
        paddingLeft:10,
        justifyContent: 'center',
    },
    columnField:{
        flexDirection: "column",
        display: "flex",
        flex:1,
        // alignItems: 'center',
    },
    inlineSpacer:{
        width: 25,
    },

    serviceTitle:{
        ...fonts.bigTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        flex:1,
        textAlign: 'center',
    },
    serviceText:{
        ...fonts.subTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginTop:10,
    },
    inlineServiceText:{
        ...fonts.subTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginLeft:10,
        marginRight:10,
        marginTop: 10,
    },
    serviceBigText:{
        ...fonts.mainTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
    selectionBox:{
        ...fonts.subTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        border:`2px solid ${colors.fountainBlue}`,
        borderRadius: 25,
        paddingLeft:5,
        paddingRight:5,
    },
    inputBox:{
        ...fonts.subTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        border:`2px solid ${colors.fountainBlue}`,
        borderRadius: 25,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:2,
        paddingBottom:2,
        boxSizing: "border-box",
        width:'100%',
    },

    backButton:{
        cursor: "pointer",
        padding: 0,
        width:30,
        height:30,
        size: 30,
        marginRight: -25,
        zIndex:2,
    },
    css:`textarea:focus, input:focus{outline: none;}`
}