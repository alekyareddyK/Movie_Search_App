const API_KEY = "b7eece4a";
let currentPage = 1;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function searchMovies(page = 1) {
    const query = document.getElementById("search-input").value;
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === "True") {
        displayMovies(data.Search);
        setupPagination(data.totalResults);
    } else {
        document.getElementById("movie-list").innerHTML = `<p>${data.Error}</p>`;
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    movies.forEach(movie => {
        const movieItem = document.createElement("div");
        movieItem.className = "movie-item";
        movieItem.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}" width="150" height="200">
            <div class="movie-details">
                <h3>${movie.Title}</h3>
                <h6>Year:${movie.Year}</h6>
                <button onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
            </div>
        `;
        movieList.appendChild(movieItem);
    });
}

function setupPagination(totalResults) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalResults / 10);
    
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            searchMovies(currentPage);
        };
        pagination.appendChild(pageButton);
    }
}

function addToFavorites(id) {
    if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
    }
}

function displayFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = "";
    favorites.forEach(id => loadFavoriteDetails(id));
}

async function loadFavoriteDetails(id) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`;
    const response = await fetch(url);
    const movie = await response.json();
    
    if (movie.Response === "True") {
        const favoriteItem = document.createElement("div");
        favoriteItem.className = "favorite-item";
        favoriteItem.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}" width="150" height="200">
            <div class="movie-details">
                <h3>${movie.Title}</h3>
                <h6>Year:${movie.Year}</h6>
                <p>${movie.Genre} - ${movie.imdbRating}</p>
                <button onclick="removeFromFavorites('${movie.imdbID}')">Remove</button>
            </div>
        `;
        document.getElementById("favorites-list").appendChild(favoriteItem);
    }
}

function removeFromFavorites(id) {
    favorites = favorites.filter(favId => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

displayFavorites();
