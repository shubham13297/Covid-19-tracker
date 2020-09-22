import React from 'react';
import numeral from 'numeral';
import './Table.css';
const Table = ({ countries }) => {
    return (
        <div className='table'>
            {countries.map((value) => {
                return (
                    <tr>
                        <td>{value.country}</td>
                        <td><strong>{numeral(value.cases).format("0,0")}</strong></td>
                    </tr>)
            })}
        </div>
    )
}

export default Table