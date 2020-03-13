import React from 'react'
import Button from '@material-ui/core/Button'
import colors from '../config/colors'

export default function HelpButton(props) {
    const {label} = props;
    return(
        <Button variant="contained" color='primary' style={{backgroundColor: colors.lightBlue}}>{label}</Button>
    )
}