let selectedElement = JSON.parse(localStorage.getItem("selectedElements")) || [];
function renderHtmlElements(books) {
  if(books.length){
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
                </div>
              </div>
            </div>
            </div>
      `
      return element;
    }).join(' ');
    document.querySelector('.products__cards').innerHTML = result;
  }else{
    document.querySelector('.products__cards').innerHTML = `
    <h1 class="note">Siz savatga mahsulot qo'shmagansiz</h1>
    `;
  }
  
}
renderHtmlElements(selectedElement);

document.querySelector('#main_page').addEventListener('click', () => {
  location.replace('./index.html');
});