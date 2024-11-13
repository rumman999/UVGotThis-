const cityInput = document.getElementById('city');
const suggestionDiv = document.getElementById('suggestions');

let cities = [];

function showSuggestion(filteredCities){

    suggestionDiv.innerHTML = '';

    if(filteredCities.length>0){
        suggestionDiv.style.display = 'block';
        filteredCities.forEach(city => {
            const div  = document.createElement('div');
            div.classList.add('suggestion-item');
            div.textContent = city;
            div.onclick = () =>{
                cityInput.value = city;
                suggestionDiv.style.display = 'none';
            }
            suggestionDiv.appendChild(div);
        });
    } else{
        suggestionDiv.style.display = 'none';
    }
}

async function fetchCities(){

    try{
        const response = await fetch('/cities');
        const data = await response.json();

        cities = data.map(city => city.city);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }

}

cityInput.addEventListener('input', () => {
    const query = cityInput.value.toLowerCase();
    const filteredCities = cities.filter(city => city.toLowerCase().includes(query));

    showSuggestion(filteredCities);
})

window.onload = fetchCities;


