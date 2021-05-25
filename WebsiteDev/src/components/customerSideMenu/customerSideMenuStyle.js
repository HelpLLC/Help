import React, { useState, useEffect } from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fontStyles';

export default {
    container:{
        width: "15%",
        height:'100%',
        background: colors.blue,
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'flex-start',
        boxSizing: "border-box",
        paddingTop:15,
        paddingBottom:15,
    },
    column:{
        flexDirection: "column",
    },
    row:{
        flexDirection: "row",
        alignItems:"center",
        display: "flex",
    },



    header:{
        width:'100%',
        justifyContent: "space-between",
        boxSizing: "border-box",
        paddingLeft:15,
        paddingRight:15,
    },
    headText:{
        ...fonts.bigSubTitleStyle,
        color: colors.white,
        fontWeight: "bold",
    },
    headIcon:{
        size: fonts.bigSubTitleStyle.fontSize,
        cursor: "pointer",
    },

    body:{
        width:'100%',
        flex: 1,
        marginTop:20,
    },
    bodyRow:{
        marginTop:10,
        marginBottom:10,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:2,
        paddingBottom:2,
    },
    selected:{
        background: colors.lightBlue,
        borderLeft: 2,
        borderColor: colors.white,
        borderLeftStyle: "solid",
    },
    text:{
        ...fonts.mainTextStyle,
        color: colors.white,
        fontWeight: "bold",
    },
    icon:{
        size: fonts.mainTextStyle.fontSize,
        marginRight: 10,
    },
    clickable:{
        cursor: "pointer",
    },

    footer:{
        paddingLeft:15,
        paddingRight:15,
    },

    css:`svg{color:${colors.white}} svg path{stroke:${colors.white}} body{margin:0}`
}