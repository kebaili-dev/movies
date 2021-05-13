'use strict';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const API_KEY = '60a2e5a69a97fbd2ed6179f0ba108a6a';
const STORAGE_NAME = 'cache';

const app = new Vue({
    el: '#app',
    data: {
        search: '',
        movies: null,
        totalPages: 0,
        lang: 'en-US',
        selectedPage: 1
    },
    methods: {
        searchMovie(page = 1) {
            if (this.search.length > 3) {
                this.selectedPage = page;
                
                const cache = JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];
                
                // Si le cache ne contient pas la recherche (si on récupère -1), on fait la requête normalement
                // et on enregistre les résultats dans le cache
                const movieId = this.indexOfMovie(this.search);
 
                if (movieId === -1) {
                
                    // Envoi de la reqête
                    const url = this.formatUrl();
                    
                    fetch(url)
                    .then(response => response.json())
                    .then(json => {
                        this.movies = json.results;
                        this.totalPages = json.total_pages;
                        
                        cache.push({
                            search: this.search,
                            time: Date.now(),
                            results: {
                                page: page,
                                results: json.results
                            }
                        });
                        
                        this.saveCache(cache);
                    });
                } else {
                    let now = Date.now();
                    
                    // Si le film a été trouvé mais que le cache a expiré
                    if (now > cache[movieId].time + (60 * 1000)) {
                        
                        // On renvoie une requête vers l'API
                        fetch(url)
                        .then(response => response.json())
                        .then(json => {
                            this.movies = json.results;
                            this.totalPages = json.total_pages;
                        
                            // On met à jour le cache, l'heure d'expiration et les résultats
                            cache[movieId].time = Date.now();
                            cache[movieId].results.results = json.results;
                        });
                    
                    } else {
                        // On a trouvé une recherche déjà existante dans le cache
                        // On récupère le film correspondant à l'index renvoyé par la fonction indexOfMovie
                        this.movies = cache[movieId].results.results;
                    }
                }
                
                // fetch(BASE_URL + '?' + new URLSearchParams({
                //     api_key: API_KEY,
                //     query: this.search,
                //     page: page,
                //     language: this.lang,
                //     include_adult: true,
                //     year: 2015
                // })).then(response => response.json())
                // .then(json => {
                //     this.movies = json.results;
                //     this.totalPages = json.total_pages;
                // });
                
                // // Envoi d'une requête AJAX vers l'url spécifiée
                // fetch(`${BASE_URL}?api_key=${API_KEY}&query=${this.search}&page=${page}&language=${this.lang}&include_adult=true`)
                // // Récupération de la réponse puis on renvoie la réponse dans le format choisi
                // .then(response => response.json())
                // // json => la réponse au format choisi
                // .then(json => {
                //     this.movies = json.results;
                //     this.totalPages = json.total_pages;
                // });
            }
        },
        formatUrl(page) {
            const url = new URL(BASE_URL);
            const params = {
                api_key: API_KEY,
                query: this.search,
                page: this.selectedPage,
                language: this.lang
            };
            
            // Chaîne de requête de l'url (queryString)
            url.search = new URLSearchParams(params).toString();
            
            return url;
        },
        indexOfMovie(search, page) {
            // On récupère le cache
            let cache = this.loadCache();
            
            // Parcours du cache
            // index : numéro du film parcouru dans le tableau
            // movie : les informations du film parcouru
            for (let [index, movie] of cache.entries()) {

                // Si le film est trouvé dans le cache
                // On renvoie l'index du cache dans le tableau
                if (movie.search === search) {
                    return index;
                }
            }
            
            // Si dans la boucle de parcours du cache on n'a pas trouvé le film
            // on renvoie -1
            return -1;
        },
        loadCache() {
            return JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];
        },
        saveCache(data) {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
        }
    }
});

// VERSION SIMPLIFIER SANS CACHE
// const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
// const API_KEY = '60a2e5a69a97fbd2ed6179f0ba108a6a';

// const app = new Vue({
//     el: '#app',
//     data: {
//         search: '',
//         movies: null,
//         totalPages: 0,
//         lang: 'en-US',
//         selectedPage: 1
//     },
//     methods: {
//         searchMovie(page = 1) {
//             if (this.search.length > 3) {
//                 this.selectedPage = page;
                
//                 const url = this.formatUrl();
                
//                 fetch(url)
//                 .then(response => response.json())
//                 .then(json => {
//                     this.movies = json.results;
//                     this.totalPages = json.total_pages;
//                 });
                
//                 // fetch(BASE_URL + '?' + new URLSearchParams({
//                 //     api_key: API_KEY,
//                 //     query: this.search,
//                 //     page: page,
//                 //     language: this.lang,
//                 //     include_adult: true,
//                 //     year: 2015
//                 // })).then(response => response.json())
//                 // .then(json => {
//                 //     this.movies = json.results;
//                 //     this.totalPages = json.total_pages;
//                 // });
                
//                 // // Envoi d'une requête AJAX vers l'url spécifiée
//                 // fetch(`${BASE_URL}?api_key=${API_KEY}&query=${this.search}&page=${page}&language=${this.lang}&include_adult=true`)
//                 // // Récupération de la réponse puis on renvoie la réponse dans le format choisi
//                 // .then(response => response.json())
//                 // // json => la réponse au format choisi
//                 // .then(json => {
//                 //     this.movies = json.results;
//                 //     this.totalPages = json.total_pages;
//                 // });
//             }
//         },
//         formatUrl(page) {
//             const url = new URL(BASE_URL);
//             const params = {
//                 api_key: API_KEY,
//                 query: this.search,
//                 page: this.selectedPage,
//                 language: this.lang
//             };
            
//             // Chaîne de requête de l'url (queryString)
//             url.search = new URLSearchParams(params).toString();
            
//             return url;
//         }
//     }
// });