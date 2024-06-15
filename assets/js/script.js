const failedError = document.querySelector(".failed-error")
const searchForm = document.querySelector("#searchForm")
const information = document.querySelector(".information")
const neighbors = document.querySelector(".neighbors")
const cardInformation = document.querySelector(".card-information")
const inputText = document.querySelector(".inputText")

searchForm.addEventListener("submit", function (event) {
    event.preventDefault()
    country(inputText.value)
})

function country(country) {
    fetch('https://restcountries.com/v3.1/name/' + country)
        .then((response) => {
            if (!response.ok)
                throw new Error("Country not found");
            return response.json();
        })
        .then((data) => {
            filterCountry(data[0]);
            const countries = data[0].borders;
            if (!countries)
                throw new Error("Neighbors country not found")
            return fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
        })
        .then(response => response.json())
        .then((data) => neighbor(data))
        .catch(err => error(err))
}



function filterCountry(data) {
    cardInformation.innerHTML = "";
    neighbors.innerHTML = "";

    let html = `
            <div class="col-5">
                <img src="${data.flags.png}" >
            </div>
            <div class="col-7">
                <h3 class="card-title">${data.name.common}</h3>
                <hr>
                <div class="row">
                    <div class="col-5"> Population : </div>
                    <div class="col-7">${data.population} milyon</div>
                </div>
                <div class="row">
                    <div class="col-5"> Language : </div>
                    <div class="col-7">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                    <div class="col-5"> Capital : </div>
                    <div class="col-7">${data.capital}</div>
                </div>
                <div class="row">
                    <div class="col-5"> Currency : </div>
                    <div class="col-7">${Object.values(data.currencies)[0].name}</div>
                </div>

            </div>
    `;
    information.style.display = "block";
    cardInformation.innerHTML = html;
}


function neighbor(data) {
    let html = "";
    for (let country of data) {
        html += `
            <div class="col-2" style="margin-top:20px">
                <div class="card" style="height:200px">
                    <img src="${country.flags.png}">
                    <div>
                        <h6>${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;

    }
    neighbors.innerHTML = html;
}


function error(err) {
    let html = ''
    html = `
        <div class="alert alert-danger">
        ${err.message}
        </div>
    `;

    setTimeout(() => {
        failedError.innerHTML = "";
    }, 5000);
    failedError.innerHTML = html;
}
