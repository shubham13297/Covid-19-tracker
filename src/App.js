import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Infobox from './Infobox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


const App = () => {
  const [countries, setCountries] = useState([]); //it is to list all countries
  const [selectedCountry, setSelectedcountry] = useState("worldwide"); //to take a note which country is selected
  const [countryInfo, setCountryInfo] = useState({}); // to get the data of selected country
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState('cases');

  // to show the world wide data before selecting anything
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])
  // useEffect runs a piece of code based on given condition
  useEffect(() => {
    // async-> send a request, wait for it, do something with info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          let countries = data.map((country) => {
            return ({
              name: country.country,
              value: country.countryInfo.iso2
            });
          });
          countries = countries.filter((country) => country.value !== null); //filtring out countries which have no data
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        })
    }
    getCountriesData();
  }, []);
  console.log("tabledata", tableData);
  const onCountrychange = async (event) => {
    const countryCode = event.target.value;
    setSelectedcountry(countryCode);
    // for worldwide "https://disease.sh/v3/covid-19/all"
    // for countries "https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]"
    const url = countryCode === "worldwide"
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedcountry(countryCode);
        // all of data from selected country
        setCountryInfo(data);
        const mapObj = countryCode === "worldwide" ? { lat: 34.80746, lng: -40.4796 }
          : { lat: data.countryInfo.lat, lng: data.countryInfo.long };
        setMapCenter(mapObj);
        setMapZoom(3); //same as initial value because map glitch it dont changes when first country is selected
      })
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountrychange} value={selectedCountry}>
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => {
                return <MenuItem value={country.value}>{country.name}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <Infobox isRed active={caseType === 'cases'} onClick={(e) => { return setCaseType('cases') }} title=" Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />

          <Infobox active={caseType === 'recovered'} onClick={(e) => { return setCaseType('recovered') }} title=" Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />

          <Infobox isRed active={caseType === 'deaths'} onClick={(e) => { return setCaseType('deaths') }} title=" Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        <Map caseType={caseType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className='app_right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app_graph_title">World Wide New {caseType}</h3>

          <LineGraph className="app_graph" caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
