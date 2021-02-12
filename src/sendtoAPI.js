export default async(key, text) => {

    const axios = require("axios");

    return axios({
        "method":"POST",
        "url":"https://text-sentiment.p.rapidapi.com/analyze",
        "headers":{
        "content-type":"application/json",
        "x-rapidapi-host":"text-sentiment.p.rapidapi.com",
        "x-rapidapi-key":key,
        "useQueryString":true
        },"data":{
        "text":text
        }
        })
        .then((response)=>{
            return {
                "error": false,
                "data": response.data
            };
        })
        .catch((error)=>{

            const errorLog = {
                "status": error.response.status,
                "message": error.response.data.message,
            };
            
            return {
                "error": true,
                "log": errorLog,
            };
        })
};