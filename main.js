let allBooks = [];
const pagesLists = document.getElementById('pagesLists');
let url = new URLSearchParams(window.location.search);
let step = 20;
let page = url.get('page') || 1;
let selectedElements = JSON.parse(localStorage.getItem("selectedElements")) || [];
const searchElementTitle = document.getElementById('searchElementTitle');


function renderPagination(length) {
  let result = '';
  let pageNumber = Math.ceil(length / step);
  localStorage.setItem('key', JSON.stringify(page));
  localStorage.setItem('page', JSON.stringify('page-active'));

  for (let i = 0; i < pageNumber; i++) {
    result += `
        <button class="page-btn">${i + 1}</button>
    `;
  }

  pagesLists.innerHTML = result;
  for (let i = 0; i < Array.from(document.querySelectorAll('.page-btn')).length; i++) {
    document.querySelectorAll('.page-btn').forEach(item => {
      item.classList.remove('btn__active');
    })
    Array.from(document.querySelectorAll('.page-btn'))[page - 1]?.classList?.add('btn__active');
  }

  document.querySelectorAll('.page-btn').forEach(item => {
    item.addEventListener('click', (e) => {
      page = +e.target.innerHTML;
      searchElements(page);
      getAllBooks();
    })
  })
}


function renderHtmlElements(books) {
  let result = books.map((item, index) => {
    let element = `
    <div class="product__card">
      <div id="cart__mark">${item.category}</div>
          <img src="${item.thumbnail}" alt="">
          <div class="product__desc">
            <h2>${item.title}</h2>
            <h4>${item.description}</h4>
            <div class="cart__success">
              <h4 id="product__price">$${item.price}</h4>
              <div class="cart__cicrle" onclick="addToCartNumberFunc(${item.id})">
                <ion-icon name="add-circle-outline"></ion-icon>
              </div>
              </div>
            </div>
          </div>
          </div>
    `
    return element;
  }).join(' ');
  document.querySelector('.products__cards').innerHTML = result;
}


function choppedPagination(books) {
  let start = page * step - step;
  let end = start + step;
  return books.slice(start, end);
}

function searchElements(searchValue) {
  let url = new URL(window.location.href);
  let query = new URLSearchParams();
  query.append('page', searchValue);
  const urlSearchQuery = query.toString();
  url.search = urlSearchQuery;
  window.history.pushState(null, "", url.toString());
}



function getAllBooks() {
  fetch("https://dummyjson.com/products").then(res => {
      if (!res.ok) throw new Error('Xatolik bor')
      return res.json();
    })
    .then(res => {
      allBooks = res.products;
      renderHtmlElements(choppedPagination(allBooks));
      renderPagination(res.products.length);
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {})
}
getAllBooks();

function addToCartNumberFunc(id){
  let count = 0;
  fetch(`https://dummyjson.com/products/${id}`).then(res => {
      if (!res.ok) throw new Error('Xatolik bor')
      return res.json();
    }).then(res => {
      if(selectedElements.length < 1){
        selectedElements.unshift(res);
        localStorage.setItem("selectedElements", JSON.stringify(selectedElements));
        alert("Mahsulot savatga qo'shildi");
      }else{
        selectedElements.forEach((item) => {
          if(item.id !== res.id){
            count++;
          }
        })
        if(count === selectedElements.length){
          selectedElements.unshift(res);
          alert("Mahsulot savatga qo'shildi");
          localStorage.setItem("selectedElements", JSON.stringify(selectedElements));
        }else{
          alert("Bu mahsulotni savatga qo'shgansiz");
        }
      }
    }).finally(() => {
      console.log(selectedElements);
    })


}

document.querySelector('#replaceCart').addEventListener('click', () => {
  location.replace('./about.html');
});

let searchElementList = [];
searchElementTitle.addEventListener("input", (e) => {
  searchElementList = allBooks.filter((item) => {
    let finded = new RegExp(e.target.value, "gi");
    return finded.test(item.title);
  })
  renderHtmlElements(searchElementList);
});