import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from "react-leaflet";
export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => (a.cases > b.cases)
        ? -1 : 1)
};
const caseTypeColors = {
    cases: {
        hex: '#CC1034',
        multiplier: 800,
    },
    recovered: {
        hex: '#7dd71d',
        multiplier: 1200,
    },
    deaths: {
        hex: '#fb4443',
        multiplier: 2000,
    },
};
// draw circles on map with interactive tooltip

export const showDataOnMap = (data, caseType = "cases") => {
    return data.map((country) => {
        return (<Circle center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={caseTypeColors[caseType].hex}
            fillColor={caseTypeColors[caseType].hex}
            radius={Math.sqrt(country[caseType])
                * caseTypeColors[caseType].multiplier}>
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className='info-name'>{country.country}</div>
                    <div className="info-confirmed">Cases:{numeral(country.cases).format('0,0')}</div>
                    <div className="info-recovered">Recovered:{numeral(country.recovered).format('0,0')}</div>
                    <div className="info-deaths">deaths:{numeral(country.deaths).format('0,0')}</div>
                </div>
            </Popup>

        </Circle>);
    })
}

export const prettyPrintStat = (stat) => {
    return stat ? `+${numeral(stat).format('0.0a')}` : null;
}