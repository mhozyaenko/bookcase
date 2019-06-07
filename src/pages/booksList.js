import {
  EditForm,
  AddBookForm
} from './newBookForm';

export const bookListInit = () => {
  fetch('http://www.json-generator.com/api/json/get/cesVIVwSxu?indent=2')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('books', JSON.stringify(data));
      return data;
    })
    .then(data => new BooksList(data).render());
}

export class BooksList {
  constructor(data) {
    this.data = data;
  }
  render = () => {
    const root = document.getElementById('root');
    root.innerHTML = '';
    const node = document.createElement('div');
    node.className = 'booksList';
    node.innerHTML = `
    <h2>Список книг</h2>
    <input class="filterByName" type = "search" placeholder="Поиск по названию" />
    <button class="_addBook">Добавить книгу</button>
    <ul class="_list"> 
     ${this.renderList(this.data)}
    </ul>
    `
    root.appendChild(node);
    const filter = node.querySelector('.filterByName');
    const list = node.querySelector('._list');
    const addBookButton = node.querySelector('._addBook')

    filter.onkeyup = () => this.filteredList(event, list);
    filter.onsearch = () => this.filteredList(event, list);
    addBookButton.onclick = () => this.addBookAction();
    this.addEvents(list);
  }
  renderList = (data) => {
    return data.map(item => {
      return `<li class="booksList-item">
      <p class="booksList-itemName">${item.name}</p>
             <p class="booksList-itemCategory"> <span>Рубрика: </span>${item.category}</p>
             <p class="booksList-itemAuthors"> <span>Авторы: </span>${item.authors.map(elem => elem.name)}</p>
             <p class="booksList-itemAuthors"> <span>Издано: </span>${item.published}</p>
             <div class="booksList-itemPublisher"> 
              <span>Издательство: </span>${item.company} 
              <div class="booksList-itemPublisher-viewDetails"> Контакты
                <div class="booksList-itemPublisher-viewDetails-popOver">
                  <p>${item.phone}</p>
                  <p>${item.address}</p>
                </div>
              </div>                
            </div>
            <div class="booksList-itemPhoto">${(item.photo.length === 0) ? `Фотографий нет` 
              : `<button data-id=${item.id} type="button" class="booksList-itemPublisher-showPhotos">Смотреть фото (${item.photo.length} шт)</button>`}
              
            </div>
            <div class="booksList-itemPhoto">
              <button class="_editButton" data-id=${item.id}>Редактировать</button>
              <button class="redButton _deleteButton" data-id=${item.id}>Удалить</button>
            </div>
      </li>`
    }).join('');
  }
  addEvents = list => {
    const photoButtons = list.querySelectorAll('.booksList-itemPublisher-showPhotos');
    const deleteButtons = list.querySelectorAll('._deleteButton');
    const editButtons = list.querySelectorAll('._editButton');
    photoButtons.forEach(item => item.onclick = () => this.showGallery(event));
    deleteButtons.forEach(item => item.onclick = () => this.deleteItem(event, list));
    editButtons.forEach(item => item.onclick = () => this.editItem(event));

  }
  filteredList = (event, list) => {
    const query = event.target.value;
    const filteredData = (query.length === 0) ? this.data : this.data.filter(item => item.name.includes(query));
    list.innerHTML = this.renderList(filteredData);
    this.addEvents(list);
  }
  deleteItem = (event, list) => {
    event.preventDefault();
    const newData = this.data.filter(item => item.id !== event.target.dataset.id);
    localStorage.setItem('books', JSON.stringify(newData));
    this.data = JSON.parse(localStorage.getItem('books'));
    list.innerHTML = this.renderList(this.data);
    this.addEvents(list);
  }
  editItem = (event) => {
    new EditForm(event.target.dataset.id).render();
  }
  showGallery = (event) => {
    event.preventDefault();
    const target = this.data.find(item => item.id === event.target.dataset.id)
    new Gallery(target.photo).render();
  }
  addBookAction = () => {
    console.log('add book');
    new AddBookForm().render();
  }
}

class Gallery {
  constructor(images) {
    this.images = images;
    this.activeSlide = 0;
  }
  render() {
    const root = document.getElementById('root');
    const node = document.createElement('div');
    node.className = 'gallery';
    node.innerHTML = `
    <a href="#" class="gallery-closeGallery">X</a>
    <div class="gallery-inner">
      <img class="_image" alt="" src=${this.images[this.activeSlide]} />
      <a href="#" class="gallery-inner-control prev"><</a>
      <a href="#" class="gallery-inner-control next">></a>      
    </div>
    `;
    root.appendChild(node);
    const closeButton = node.querySelector('.gallery-closeGallery');
    const prevButton = node.querySelector('.prev');
    const nextButton = node.querySelector('.next');
    const image = node.querySelector('._image');

    closeButton.onclick = () => this.closeGallery(node, root);
    prevButton.onclick = () => this.showPrevious(image);
    nextButton.onclick = () => this.showNext(image);
  }
  closeGallery = (node, root) => {
    root.removeChild(node);
  }
  showPrevious = image => {
    this.activeSlide = (this.activeSlide === 0) ? this.images.length - 1 : this.activeSlide - 1;
    image.setAttribute('src', this.images[this.activeSlide]);
    console.log(this.activeSlide);
  }
  showNext = image => {
    this.activeSlide = (this.activeSlide === this.images.length - 1) ? 0 : this.activeSlide + 1;
    image.setAttribute('src', this.images[this.activeSlide]);
    console.log(this.activeSlide);
  }
}