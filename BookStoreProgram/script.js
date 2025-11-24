async function fetchBooks(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/books?${queryString}`);
    return await response.json();
}

async function displayBooksForUser() {
    const books = await fetchBooks();
    
    const bookListDiv = document.getElementById('book-list-user');
    bookListDiv.innerHTML = '';

    books.forEach(book => { 
        const bookDiv = document.createElement('div'); 
        bookDiv.innerHTML = `
            <h3>${book.title}</h3> 
            <p>Автор: ${book.author}</p> 
            <p>Год: ${book.year}</p> 
            <p>Цена: $${book.price}</p> 
            <button onclick="rentBook('${book._id}')">Арендовать</button>
        `;  
        bookListDiv.appendChild(bookDiv); 
    });
}

async function displayBooksForAdmin() {
    const books = await fetchBooks();
    
    const bookListDiv = document.getElementById('book-list-admin');
    bookListDiv.innerHTML = '';

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <p>Автор: ${book.author}</p>
            <p>Год: ${book.year}</p>
            <p>Цена: $${book.price}</p>
            <button onclick="deleteBook('${book._id}')">Удалить</button>
        `;
        bookListDiv.appendChild(bookDiv);
    });
}

document.getElementById('filter-button').addEventListener('click', async () => {
    const filters = {
        category: document.getElementById('filter-category').value,
        author: document.getElementById('filter-author').value,
        year: document.getElementById('filter-year').value,
    };
    
    await displayBooksForUser(filters);
});

document.getElementById('add-book-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    
    await displayBooksForAdmin();
});

async function rentBook(bookId) {
    const duration = prompt("Введите продолжительность аренды (2 weeks, 1 month, 3 months):");
    
    if (!duration) return;

    await fetch(`/api/books/${bookId}/rent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
    });
    
    alert("Книга арендована!");
}

async function deleteBook(bookId) {
    await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
    
    await displayBooksForAdmin();
}

// Инициализация интерфейсов
async function init() {
    // Здесь можно добавить логику для определения роли пользователя
    const isAdmin = true; // Замените на реальную проверку

    if (isAdmin) {
        document.getElementById('admin-interface').style.display = 'block';
        await displayBooksForAdmin();
    } else {
        document.getElementById('user-interface').style.display = 'block';
        await displayBooksForUser();
    }
}

init();