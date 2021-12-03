import React from "react";
import API from "../API";
import "../App.css";

class HistoryScreen extends React.Component {

    constructor() {
        super();
        this.getHistory = this.getHistory.bind(this);
        this.getCountries = this.getCountries.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.getDates = this.getDates.bind(this);
        this.state = {
            historyArr: [],
            countries: [],
            country: "",
            dates: [],
        };
    }

    componentDidMount() {
        this.getCountries();
        this.getDates();
    }

    getDates() {
        let dates = [];
        for (let i = 0; i < 8; i++) {
            let currentDate = new Date();
            let offset = currentDate.getTimezoneOffset();
            let date = new Date(currentDate.setDate(currentDate.getDate() - i));
            let dateWithOffset = new Date(date.getTime() - (offset * 60 * 1000));
            dates.push(dateWithOffset.toISOString().split('T')[0]);
        }
        this.setState({
            ...this.state,
            dates,
        });
        console.log("getDates executed");
    }

    // Issue Start Here

    getHistory(event) {
        event.preventDefault();

        const { country } = this.state;
        const { dates } = this.state;
        let historyArr = [];

        let myPromise = new Promise((resolve) => {
            historyArr = dates.map(async (date) => {
                return API.get(`/history?country=${country}&day=${date}`)
                    .then(res => res.data.response[0])
            });
            resolve();
        });

        myPromise.then(
            this.setState({
                ...this.state,
                historyArr,
        })
        ).then(
            console.log("Array: ", historyArr) // Error: Returning Promise Pending, State = Fulfilled
        );
    }

    // Issue End Here

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
        const { countries } = this.state;

        return (
            <div className="display">
                <h1>Current Covid history in:</h1>
                <form onSubmit={this.getHistory}>
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
                {/* <ul>
                    <li>Population: {history.population}</li>
                    <li>Last Updated: {date}</li>
                    <hr />
                    <h3>Last 7 Days</h3>
                    <li>Active Cases: {cases.active}</li>
                    <li>New: {cases.new}</li>
                    <li>Critical: {cases.critical}</li>
                    <li>Recovered: {cases.recovered}</li>
                    <li>Total: {cases.total}</li>
                </ul> */}
            </div>
        )
    }
}

export default HistoryScreen;