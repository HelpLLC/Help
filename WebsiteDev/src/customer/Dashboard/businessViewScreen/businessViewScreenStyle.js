import React, { useState, useEffect } from 'react';
import colors from '../../../config/colors';
import fonts from '../../../config/fontStyles';

export default {
    body:{
        flex:1,
        boxSizing: "border-box",
        flexDirection: "row",
        display: "flex",
        margin: 0,
        border: 0
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

    middleSection:{
        flex:1,
        height:"100vh",
        boxSizing: "border-box",
        padding: 20,
    },
    mainContainer:{
        border:`2px solid ${colors.fountainBlue}`,
        background: colors.white,
        borderRadius: 20,
        padding: 10,
        margin: 15,
        boxShadow: `0px 3px 2px ${colors.fountainBlue}`,
    },
    businessTitle:{
        ...fonts.bigTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
    businessDescription:{
        ...fonts.mainTextStyle,
        color: colors.blue,
        fontWeight: 'bold',
    },
    serviceImage:{
        width: "15vw",
    },
    serviceTitle:{
        ...fonts.bigTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    serviceText:{
        ...fonts.mainTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    
    rightSection:{
        width:"28%",
        height:"100%",
        boxSizing: "border-box",
        padding: 20,
    },
    featuredTitle:{
        ...fonts.mainTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',
    },
    secondaryContainer:{
        border:`2px solid ${colors.fountainBlue}`,
        background: colors.white,
        borderRadius: 20,
        padding: 5,
        margin: 5,
        // width: '100%',
    },
    featuredImage:{
        width: "8vw",
        height: "6.5vw",
    },
    featuredText:{
        ...fonts.subTextStyle,
        color: colors.darkBlue,
        fontWeight: 'bold',

    },

    clickable:{
        cursor: "pointer",
    },
    css:``
}