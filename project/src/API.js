import axios from "axios";

const API = axios.create({
    baseURL:"https://covid-193.p.rapidapi.com",
    headers: {
        'x-rapidapi-host': 'covid-193.p.rapidapi.com',
        'x-rapidapi-key': 'f675137ff1msh8ae1e95f53ba9a4p1bb6b2jsnc4fcd0c7649b'
    }
});

export default API;