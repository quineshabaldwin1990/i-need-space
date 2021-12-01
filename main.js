const apiKeyInput = document.getElementById("api-key");
const addressInput = document.getElementById("address");
const noradInput = document.getElementById("norad");
const searchBtn = document.getElementById("search");
const time = document.querySelectorAll("#time td");


function passes(norad, latitude, longitude) {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.responseType = "json";
   
    xmlHttpRequest.open("GET", encodeURI(`https://satellites.fly.dev/passes/${norad}?lat=${latitude}&lon=${longitude}&limit=1`));
   
    xmlHttpRequest.onload = function() {
        if(xmlHttpRequest.status === 200) {
            let [ satellite ] = xmlHttpRequest.response;
            console.log(satellite);
            time[0].textContent = satellite.rise.utc_datetime;
            time[1].textContent = satellite.culmination.utc_datetime;
            time[2].textContent = satellite.set.utc_datetime;
            time[3].textContent = satellite.visible.utc_datetime;
        }
    }
    
    xmlHttpRequest.onerror = function(error) {
        console.log("There was an error:",error);
    }
    xmlHttpRequest.send();
}

function search() {
    const ACCESS_TOKEN = (apiKeyInput.value) ? apiKeyInput.value: "";
    const address = (addressInput.value) ? addressInput.value: "";
    const norad = (noradInput.value) ? +noradInput.value: "";

    console.log(ACCESS_TOKEN, address, norad);

    if(ACCESS_TOKEN && address && norad) {
        const mapboxClient = mapboxSdk({
            "accessToken": ACCESS_TOKEN,
        });

        mapboxClient.geocoding.forwardGeocode({
            query: addressInput.value,
            limit: 1
        })
        .send()
        .then(response => {
            let [feature] = response.body.features;
            let [latitude, longitude] = feature.center;
            latitude = +latitude.toFixed(2);
            longitude = +longitude.toFixed(2);

           
            passes(norad, latitude, longitude);
        });
    }
    
}

searchBtn.addEventListener("click", search);
