const searchTermElem = document.querySelector('#searchTerm');
const searchResultElem = document.querySelector('#searchResult');
const paginationContainer = document.getElementById('pagination');

searchTermElem.focus();

searchTermElem.addEventListener('input', function (event) {
    search(event.target.value);
});

const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

let currentPage = 1;
let resultsPerPage = 5;
let totalResults = 0;

const search = debounce(async (searchTerm) => {
    // if the search term is removed, 
    // reset the search result
    if (!searchTerm) {
        // reset the search result
        searchResultElem.innerHTML = '';
        paginationContainer.innerHTML = '';
        return;
    }

    try {
        // make an API request
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=${resultsPerPage}&sroffset=${(currentPage - 1) * resultsPerPage}&srsearch=${searchTerm}`;
        const response = await fetch(url);
        const searchResults = await response.json();

        // Calculate total results
        totalResults = searchResults.query.searchinfo.totalhits;

        // render search result
        const searchResultHtml = generateSearchResultHTML(searchResults.query.search, searchTerm);

        // add the search result to the searchResultElem
        searchResultElem.innerHTML = searchResultHtml;

        // Display pagination
        displayPagination();
    } catch (error) {
        console.log(error);
    }
});

const stripHtml = (html) => {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
};

const highlight = (str, keyword, className = "highlight") => {
    const hl = `<span class="${className}">${keyword}</span>`;
    return str.replace(new RegExp(keyword, 'gi'), hl);
};

const generateSearchResultHTML = (results, searchTerm) => {
    return results
        .map(result => {
            const title = highlight(stripHtml(result.title), searchTerm);
            const snippet = highlight(stripHtml(result.snippet), searchTerm);

            return `<article>
                <a href="https://en.wikipedia.org/?curid=${result.pageid}">
                    <h2>${title}</h2>
                </a>
                <div class="summary">${snippet}...</div>
            </article>`;
        })
        .join('');
}

function displayPagination() {
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    // Disable previous button if on first page
    const prevButton = document.createElement('button');
    prevButton.classList.add('pagination-button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage = Math.max(currentPage - 1, 1);
        search(searchTermElem.value);
    });
    paginationContainer.appendChild(prevButton);

    // Display current page number
    const currentPageButton = document.createElement('button');
    currentPageButton.classList.add('pagination-button', 'active');
    currentPageButton.textContent = currentPage;
    paginationContainer.appendChild(currentPageButton);

    // Disable next button if on last page
    const nextButton = document.createElement('button');
    nextButton.classList.add('pagination-button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage = Math.min(currentPage + 1, totalPages);
        search(searchTermElem.value);
    });
    paginationContainer.appendChild(nextButton);
}