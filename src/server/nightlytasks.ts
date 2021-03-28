const nodeFetch = require('node-fetch');

(async () => {
    let response = await nodeFetch('http://orifin-prototype.herokuapp.com/api/db-update');
    console.log(response);
})();