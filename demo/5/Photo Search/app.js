const accessKey = 'TM8q_71x1kvvRhN2IfQ8ZlzcMnFVB9fGXycbuF4aKO4';
const searchForm =  document.getElementById('searchForm');
const searchInput =  document.getElementById('searchInput');
const searchResult =  document.getElementById('searchResult');
const showMoreButton =  document.getElementById('showMoreButton');
let keyWord = '';
let page = 1;
async function searchImages(){
    keyWord = searchInput.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyWord}&client_id=${accessKey}&per_page=12`;
    const response  = await fetch(url);
    const data = await response.json();
    // console.log(data);
    if(page === 1){
        searchResult.innerHTML = '';
    }
    const results = data.results;
    results.map((result)=>{
        const image = document.createElement('img');
        image.src = result.urls.small;
        image.className = 'image';
        const imageLink = document.createElement('a');
        imageLink.href = result.links.html;
        imageLink.className = 'd-block';
        imageLink.appendChild(image);
        const column = document.createElement('div');
        column.className = 'col-12 col-sm-6 col-md-6 col-lg-4 col-xxl-4 mb-4';
        column.appendChild(imageLink);
        searchResult.appendChild(column);
    });
    showMoreButton.classList.remove('d-none');
    showMoreButton.classList.add('d-block');
}
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    page = 1;
    if (searchInput.value.trim() !== '') {
        searchImages();
    }
});
showMoreButton.addEventListener('click', ()=>{
    page++;
    searchImages();
});