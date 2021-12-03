import React from "react";
import API from "../API";
import "../App.css";

class CovidScreen extends React.Component {

    constructor() {
        super();
        this.getStatistics = this.getStatistics.bind(this);
        this.getCountries = this.getCountries.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.state = {
            statistics: "",
            cases: "",
            countries: [],
            country: "",
            date: "",
        };
    }

    componentDidMount() {
        this.getCountries();
    }

    async getStatistics(event) {
        event.preventDefault();

        const { country } = this.state;
        const res = await API.get(`/statistics?country=${country}`);
        
        let statistics = "";
        let cases = "";
        let date = "";

        if (res.status === 200) {
            statistics = res.data.response[0];
            cases = statistics.cases;
            date = new Date(statistics.time).toLocaleString("en-UK")
        }

        this.setState({
            ...this.state,
            statistics,
            cases,
            date,
        });
        console.log("getStatistics executed");
        console.log("Statistics: ", statistics);
    }

    async getCountries() {
        const res = await API.get("/countries");
        
        let countries = [];

        if (res.status === 200) {
            countries = res.data.response;
        }

        this.setState({
            ...this.state,
            countries,
        });
        console.log("getCountries executed")
    }

    async selectCountry(event) {
        event.preventDefault();

        const currentCountry = event.target.value;
        this.setState({
            ...this.state,
            country: currentCountry,
        });
        console.log("selectCountry executed")
    }

    render() {
        const { statistics } = this.state;
        const { cases } = this.state;
        const { countries } = this.state;
        const { date } = this.state;

        return(
            <div className="display">
                <h1>Current Covid Statistics in: {statistics.country}</h1>
                <form onSubmit={this.getStatistics}>
                    <label>
                        Select a Country:
                        <select className="select" onChange={this.selectCountry}>
                            <option selected disabled>Select a Country</option>
                            {countries.map((country) => {
                                return <option key={country}>{country}</option>
                            })}
                        </select>
                    </label>
                    <button>Search</button>
                </form>
                <ul>
                    <li>Population: {statistics.population}</li>
                    <li>Last Updated: {date}</li>
                    <hr />
                    <li>Active Cases: {cases.active}</li>
                    <li>New: {cases.new}</li>
                    <li>Critical: {cases.critical}</li>
                    <li>Recovered: {cases.recovered}</li>
                    <li>Total: {cases.total}</li>
                </ul>
            </div>
        )
    }
}

export default CovidScreen;