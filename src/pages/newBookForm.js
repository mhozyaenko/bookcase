import {bookListInit, BooksList} from './booksList';

class BookForm  {
  constructor() {
    this.data = (localStorage.getItem('books')) ? JSON.parse(localStorage.getItem('books')) : [];
    this.book = {
      name: "",
      category: "",
      company: "",
      id: `f${(+new Date).toString(16)}`,
      address: "",
      authors: [],
      phone: "",
      published: "",
      photo: [],      
    };    
  }  
  inputChange = (event) => {    
    this.book[event.target.name] = event.target.value;
    console.log(this.book);
  }
  renderListPage = () => {
    this.book = {};
    bookListInit();
  }
  addInfoToArray(input, array, result) {
    if (input.value.length===0) return;
    const author = {name: input.value}
    array.push(author);
    input.value = "";
    result.innerHTML = array.map(item => item.name).join(', ');
    console.log(this.book);
  }
 
}
export class AddBookForm extends BookForm {
  constructor(data, book) {
    super(data, book);
  }
  render = () => {
    const root = document.getElementById('root');
    const node = document.createElement('div');
    node.className = "bookForm";
    node.innerHTML = `
    <h2>Добавьте книгу</h2>
    <a href="#" class="bookForm-backToList">Назад к списку</a>
    <form class="bookForm-form">    
      <input name="name" type="text" class="_input" placeholder="Название" />
      <input name="category" type="text" class="_input" placeholder="Рубрика" />
      <input type="text" placeholder="Автор" class="_authorInput"/> <button class="_addAuthor" type="button"> Добавить автора</button>
      <p class = "bookForm-form-authorsList"></p>
      <input name = "published" type="text" placeholder="Год издания" class="_input" />
      <input name="company" type="text" placeholder="Издательство" class="_input" />
      <input name="phone" type="text" placeholder="Телефон издательства" class="_input" />
      <input name="address" type="text" placeholder="Адрес издательства" class="_input" />
      <input type="text" placeholder="URL фото" class="_photoInput" /> <button type="button" class="_addPhoto"> Добавить фото</button>
      <p class = "bookForm-form-photoList"></p>
      <button type="submit" class="redButton _addBookToStorage"> Добавить книгу</button>
    </form>  
    `;

    root.innerHTML = '';
    root.appendChild(node);
    const backToList = node.querySelector('.bookForm-backToList');
    const inputs = node.querySelectorAll('._input');
    const addAuthor = node.querySelector('._addAuthor');
    const authorValue = node.querySelector('._authorInput');
    const authorsList = node.querySelector('.bookForm-form-authorsList');
    const addPhoto = node.querySelector('._addPhoto');
    const photoValue = node.querySelector('._photoInput');
    const photoList = node.querySelector('.bookForm-form-photoList');
    const addToStorage = node.querySelector('._addBookToStorage');

    inputs.forEach(item => item.onkeyup = () => this.inputChange(event) );    
    backToList.onclick = () => this.renderListPage();
    addAuthor.onclick = () => this.addInfoToArray(authorValue, this.book.authors, authorsList);
    addPhoto.onclick = () => this.addInfoToArray(photoValue, this.book.photo, photoList);
    addToStorage.onclick = () => this.addToStorage(this.book);
  }
  addToStorage = (book) => {
    const storage = (localStorage.getItem('books')) ? JSON.parse(localStorage.getItem('books')) : [];
    storage.push(book);
    localStorage.setItem('books', JSON.stringify(storage));
    new BooksList(storage).render();

  }

}

export class EditForm extends BookForm  {
  constructor(id, data) {
    super(data);
    this.storage = JSON.parse(localStorage.getItem('books'));
    this.book = this.storage.find(elem => elem.id===id);
  }
  render = () => {
    console.log(this.book);
    const root = document.getElementById('root');
    const node = document.createElement('div');
    node.className = "bookForm";
    node.innerHTML = `
    <h2>Редактирование книги ${this.book.name}</h2>
    <a href="#" class="bookForm-backToList">Назад к списку</a>
    <form class="bookForm-form">    
      <input name="name" type="text" class="_input" placeholder="Название" value="${this.book.name}" />
      <input name="category" type="text" class="_input" placeholder="Рубрика" value="${this.book.category}" />
      <input type="text" placeholder="Автор" class="_authorInput"/> <button class="_addAuthor" type="button"> Добавить автора</button>
      <p class = "bookForm-form-authorsList">${this.book.authors.map(item => item.name)}</p>
      <input name = "published" type="text" placeholder="Год издания" class="_input" value="${this.book.published}" />
      <input name="company" type="text" placeholder="Издательство" class="_input" value="${this.book.company}" />
      <input name="phone" type="text" placeholder="Телефон издательства" class="_input" value="${this.book.phone}" />
      <input name="address" type="text" placeholder="Адрес издательства" class="_input" value="${this.book.address}" />
      <input type="text" placeholder="URL фото" class="_photoInput" /> <button type="button" class="_addPhoto"> Добавить фото</button>
      <p class = "bookForm-form-photoList">${this.book.photo.join(', ')}</p>
      <button type="submit" class="redButton _addBookToStorage">Изменить данные</button>
    </form>  
    `;

    root.innerHTML = '';
    root.appendChild(node);
    const backToList = node.querySelector('.bookForm-backToList');
    const inputs = node.querySelectorAll('._input');
    const addAuthor = node.querySelector('._addAuthor');
    const authorValue = node.querySelector('._authorInput');
    const authorsList = node.querySelector('.bookForm-form-authorsList');
    const addPhoto = node.querySelector('._addPhoto');
    const photoValue = node.querySelector('._photoInput');
    const photoList = node.querySelector('.bookForm-form-photoList');
    const addToStorage = node.querySelector('._addBookToStorage');

    inputs.forEach(item => item.onkeyup = () => this.inputChange(event) );    
    backToList.onclick = () => this.renderListPage();
    addAuthor.onclick = () => this.addInfoToArray(authorValue, this.book.authors, authorsList);
    addPhoto.onclick = () => this.addInfoToArray(photoValue, this.book.photo, photoList);
    addToStorage.onclick = () => this.addToStorage(this.book);
  }
  addToStorage = (book) => {
    this.storage.map(item => (item.id === book.id) ? book : item);
    localStorage.setItem('books', JSON.stringify(this.storage));
    new BooksList(this.storage).render();
    

  }
}