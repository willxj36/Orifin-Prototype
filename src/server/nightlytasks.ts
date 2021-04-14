const nodeFetch = require('node-fetch');

(async () => {
    let response = await nodeFetch('http://orifin-prototype.herokuapp.com/api/update/db');
    console.log(response);
})();

(async () => {
    let response = await nodeFetch('http://orifin-prototype.herokuapp.com/api/update/hours');
    console.log(response);
})();