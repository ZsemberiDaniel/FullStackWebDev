import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FilterCountries = ({ filter, onFilterChanged }) => {
    return (
        <div>
            find countries <input value={filter} onChange={onFilterChanged} />
        </div>
    )
}

const DisplayLanguage = ({ language }) => {
    return (
        <><li>{language.name}</li></>
    )
}

const Weather = ({ capital }) => {
    // I'm not sure why the course taught me to keep the state in the App component, I've tried this out
    // and it seems to work so I'm keeping it
    // maybe I should've done this with the country show booleans as well, but I was afraid I'm doing
    // something wring since the course especially said to keep the state in the upper levels
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const api_key = process.env.REACT_APP_API_KEY;
        axios
            .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
            .then(response => {
                setWeatherData(response.data.current);
            });
        }, [capital]);

    if (weatherData === null)
    {
        return (<div>Loading weather data...</div>);
    }
    else 
    {
        return (
            <div>
                <h3>Weather in {capital}</h3>
                <p><b>temperature: </b> {weatherData.temperature}</p>
                {weatherData.weather_icons.map(iconUrl => <img src={iconUrl} width={100} key={iconUrl} alt={"weather icon"}/>)}
                <p><b>wind: </b> {weatherData.wind_speed} mph with direction {weatherData.wind_dir}</p>
            </div>
        )
    }
}

const FullCountry = ({ country }) => {
    return (
        <div>
            <h1>{country.name}</h1>
            <p>Capital {country.capital}</p>
            <p>Population {country.population}</p>

            <h3>languages</h3>
            <ul>
                {country.languages.map(language => <DisplayLanguage language={language} key={language["iso639_1"]} />)}
            </ul>

            <img src={country.flag} alt={`Flag of ${country.name}`} width="200px"></img>

            <Weather capital={country.capital} />
        </div>
    )
}

const Country = ({ country, onShowCountryPressed }) => {
    return (
        <div>
            {country.name}
            <button onClick={() => onShowCountryPressed(country.numericCode)}>{country.shown ? "hide" : "show"}</button>

            {country.shown ? <FullCountry country={country} /> : <></>}
        </div>
    )
}

const DisplayCoutnries = ({ countries, filter, onShowCountryPressed }) => {
    const displayedCountries = 
        filter === '' ? 
        countries : 
        countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()));

    if (displayedCountries.length > 10)
    {
        return (
            <div>Too many matches, specify another filter!</div>
        )
    }
    else if (displayedCountries.length === 1)
    {
        return (
            <div>
                <FullCountry country={displayedCountries[0]} />
            </div>
        )
    }
    else
    {
        return (
            <div>
                {displayedCountries.map(country => <Country country={country} key={country.numericCode} onShowCountryPressed={onShowCountryPressed} />)}
            </div>
        )
    }
}

const App = () => {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get("https://restcountries.eu/rest/v2/all").then(response => {
            setCountries(response.data);
        })
    }, []);

    function onFilterChanged(event) {
        setFilter(event.target.value);
    }

    function onShowCountryPressed(id)
    {
        const newCountries = [...countries];
        for (let i = 0; i < newCountries.length; i++)
        {
            if (newCountries[i].numericCode === id)
            {
                newCountries[i].shown = !newCountries[i].shown;
                break;
            }
        }
        setCountries(newCountries);
    }

    return (
        <div>
            <FilterCountries filter={filter} onFilterChanged={onFilterChanged} />
            <DisplayCoutnries countries={countries} filter={filter} onShowCountryPressed={onShowCountryPressed} />
        </div>
    );
}

export default App;
