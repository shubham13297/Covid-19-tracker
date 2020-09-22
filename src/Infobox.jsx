import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react';
import './Infobox.css';

const Infobox = (props) => {
    return (
        <Card onClick={props.onClick} className={`infoBox ${props.active && 'infoBox--selected'} ${(props.isRed && props.active) && 'infoBox--red'}`}>
            <CardContent>
                {/* title */}
                <Typography className="infoBox_title" color="textSecondary">
                    {props.title}
                </Typography>

                {/* no of cases */}
                <h2 className={`infoBox_cases ${!props.isRed && 'infoBox_cases--green'}`}>{props.cases}</h2>

                {/* total */}
                <Typography className="infoBox_total" color="textSecondary">
                    {props.total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
