// ==UserScript==
// @name         YouTube Search Translator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Translate YouTube search queries from Portuguese to English
// @author       Kauan
// @match        *://www.youtube.com/results?search_query=*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Function to translate text from Portuguese to English using Google Translate API
    async function translateText(text) {
        console.log("Translating text:", text);
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        console.log("Translation result:", data);
        return data[0][0][0];
    }

    // Function to get query parameter by name
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to update query parameter and reload the page
    function updateQueryParam(newQuery) {
        const url = new URL(window.location.href);
        url.searchParams.set('search_query', newQuery);
        url.searchParams.set('translated', 'true'); // Add a flag to mark as translated
        console.log("New URL:", url.toString());
        window.location.assign(url.toString()); // Navigate to the new URL
    }

    // Main function to handle the translation and page reload
    async function handleTranslation() {
        const searchQuery = getQueryParam('search_query');
        const translatedFlag = getQueryParam('translated');

        // Check if the query has already been translated
        if (searchQuery && !translatedFlag) {
            const translatedQuery = await translateText(searchQuery);
            updateQueryParam(translatedQuery);
        }
    }

    // Run the main function
    handleTranslation();
})();

(function() {
    'use strict';

    function reloadWithDelay() {
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    function reloadOnSearch() {
        const searchButton = document.querySelector('button#search-icon-legacy');
        const searchInput = document.querySelector('input#search');

        if (searchButton) {
            searchButton.addEventListener('click', reloadWithDelay);
        }

        if (searchInput) {
            searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    reloadWithDelay();
                }
            });
        }
    }

    // Aguarda a página carregar completamente
    window.addEventListener('load', reloadOnSearch);
})();
