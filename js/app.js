// ==========================================
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES
// ==========================================
// Escribe tu nombre y documento exactos. Esto personalizará la aplicac
const developerName = "Sebastián Angel Castaño";
const developerId = "67613";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los favoritos (lo usaremos más adelante)
let favoritesArray = [];

// ==========================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainfooter = document.getElementById('mainFooter');


mainfooter.innerHTML = `<p>Developed with 💻by <strong>${developerName}</strong> - ID: ${developerId}</p>`;

/* funcion para poner datos (asincronia) */

async function fetchData(endpoint) {
    try {
        dataContainer.innerHTML = '<p Class="loading-text">Loading multiverse data...</p>';
        const response = await fetch(`${baseUrl}/${endpoint}`);
        const data = await response.json();

        return data.results;
    } catch (error) {
        console.error("Error:", error);
        dataContainer.innerHTML = '<p class="loading-text" style="color: red;">connection error.</p>';
    }
}

//=========================================
// 5. FUNCIONES DE RENDERIZADO (DOM)
//=========================================

// Función para pintar personajes (Incluye el botón de favoritos)
function renderCharacters(charactersData) {
    dataContainer.innerHTML = ''; // Limpiamos la pantalla

    charactersData.forEach(character => {
        // Determinamos el color del estado (Alive = verde, Dead = rojo)
        const statusColor = character.status === 'Alive'
            ? 'lime'
            : character.status === 'Dead'
                ? 'red'
                : 'gray';

        const cardHtml = `
  <article class="data-card">
    <img src="${character.image}" alt="${character.name}">
    <div class="card-info">
      <h2>${character.name}</h2>
      <p class="info-label">Status: <span style="color: ${statusColor}">${character.status}</span></p>
      <p class="info-label">Species: ${character.species}</p>
      
      <button class="btn-add-fav" onclick="addToFavorites('${character.name}', '${character.image}')">Guardar favorito</button>
    </div>
  </article>
`;
        dataContainer.innerHTML += cardHtml;
    });
}

//Función para pintar ubicaciones (Locations)
function renderLocations(locationsData) {
    dataContainer.innerHTML = "";
    locationsData.forEach(location => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2> 🌐 ${location.name}</h2>
                    <p class="info-label">Type: <span style="color: white;">${location.type}</span></p>
                    <p class="info-label">Dimension: <span style="color: white;">${location.dimension}</span></p>
                  </div>  
           </article>  `;
    });
}



// Función para pintar episodios
function renderEpisodes(episodesData) {
    dataContainer.innerHTML = '';
    episodesData.forEach(episode => {
        dataContainer.innerHTML += `
    <article class="data-card">
      <div class="card-info">
        <h2>📺 ${episode.name}</h2>
        <p class="info-label">Code: <span style="color: lime;">${episode.episode}</span></p>
        <p class="info-label">Air Date: ${episode.air_date}</p>


      </div>
    </article>
  `;


    });
}
// ==========================================
// 6. LÓGICA DE FAVORITOS (LOCALSTORAGE)
// ==========================================

// Esta función se ejecuta cuando damos clic en el botón "Add to Favorites" de una tarje
function addToFavorites(name, image) {
    // Creamos un objeto con los datos del personaje
    const newFavorite = { name: name, image: image };

    favoritesArray.push(newFavorite);

    localStorage.setItem('myfavCharacters', JSON.stringify(favoritesArray));

    alert(`"${name}" se ha agregado a tus favoritos!`);
}
function renderFavorites() {
    dataContainer.innerHTML = '';

    const savedData = localStorage.getItem('myfavCharacters');


    if (savedData) {
        // Si hay datos, los deserializamos y los mostramos
        favoritesArray = JSON.parse(savedData);
        if (favoritesArray.length === 0) {
            dataContainer.innerHTML = '<p class="loading-text">No tienes favoritos aún.</p>';
            return;

        }
        favoritesArray.forEach(fav => {
            dataContainer.innerHTML += `
    <article class="data-card">
        <img src="${fav.image}" alt="${fav.name}">
        <div class="card-info">
            <h2>✨${fav.name}</h2>
        </div>
    </article>
    `;





        });
    }else {
        dataContainer.innerHTML = '<p class="loading-text">No tienes favoritos aún.</p>';
    }
}


function setActiveButton(activeBtn) {
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}

btnCharacters.addEventListener('click', async () => {
    setActiveButton(btnCharacters);
    const Data = await fetchData('/character');
    renderCharacters(Data);
});

btnLocations.addEventListener('click', async () => {
    setActiveButton(btnLocations);
    const data = await fetchData('/location');
    renderLocations(data);
});

btnEpisodes.addEventListener('click', async () => {
    setActiveButton(btnEpisodes);
    const data = await fetchData('/episode');
    renderEpisodes(data);
}); 

btnFavorites.addEventListener('click', () => {
    setActiveButton(btnFavorites);
    renderFavorites();

});
// ==========================================
// 8. INICIO AUTOMATICO
// ==========================================

// Recuperamos los favoritos al arrancar la pagina por si habia guardado
const previousFavs = localStorage.getItem('myFavCharacters');

if (previousFavs) {
    favoritesArray = JSON.parse(previousFavs);
}   

btnCharacters.click();