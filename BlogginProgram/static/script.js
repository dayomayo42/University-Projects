let currentUserId;

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
    if (data.user_id) {
        currentUserId = data.user_id;
        alert(data.message);
    } else {
        alert(data.message);
    }
}

async function createPost() {
    const content = document.getElementById("post-content").value;
    const tags = document.getElementById("tags").value.split(',');
    const hidden = document.getElementById("hidden-post").checked;

    const response = await fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, tags, hidden })
    });

    const data = await response.json();
    alert(data.message);
    loadPosts();
}

async function loadPosts() {
    const tagFilter = document.getElementById('tag-filter').value;
   
    const response = await fetch(`/posts?tag=${encodeURIComponent(tagFilter)}`); 
    const posts = await response.json();
    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; 

    posts.forEach(post => {
     
        const postContentElement = document.createElement('p'); 
        postContentElement.textContent = post.content + ' - ' + post.tags.join(', ');
        postList.appendChild(postContentElement); 

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';

        editButton.onclick = () => editPost(post.id); 

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
  
        deleteButton.onclick = () => deletePost(post.id);

        postList.appendChild(editButton);
        postList.appendChild(deleteButton);


        postList.appendChild(document.createElement('br')); 

        const commentInput = document.createElement('input');
        commentInput.placeholder = 'Добавить комментарий...';
        const commentButton = document.createElement('button');
        commentButton.textContent = 'Комментировать';

        commentButton.onclick = () => addComment(post.id, commentInput.value);

        postList.appendChild(commentInput);
        postList.appendChild(commentButton);
        
        postList.appendChild(document.createElement('br')); 

        const commentsContainer = document.createElement('div');
        commentsContainer.id = `comments-for-post-${post.id}`; 
        postList.appendChild(commentsContainer);
        

        postList.appendChild(document.createElement('br'));

        loadComments(post.id, commentsContainer); 
    });
}

// Функция для загрузки комментариев
async function loadComments(postId, parentDiv) {
    const response = await fetch(`/posts/${postId}/comments`);
    
    const commentsListDiv = document.createElement('div');
    
    const commentsData = await response.json();
    
    commentsData.forEach(comment => {
        const commentElement = document.createElement('p'); 
        commentElement.textContent = comment.content;
        
        commentsListDiv.appendChild(commentDiv);
    });
    
    parentDiv.appendChild(commentsListDiv);
}

// Функция для добавления комментария
async function addComment(postId, content) {
    const response = await fetch(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });

    const data = await response.json();
    alert(data.message);
    
    // Обновление комментариев после добавления
    loadPosts();
}

// Функция для редактирования поста
async function editPost(postId) {
    const newContent = prompt("Введите новый текст поста:");
    
    if (newContent) {
        const newTags = prompt("Введите новые теги (через запятую):");
        
        const response = await fetch(`/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent, tags: newTags.split(',') })
        });

        const data = await response.json();
        alert(data.message);
        
        loadPosts();
    }
}

// Функция для удаления поста
async function deletePost(postId) {
    if (confirm("Вы уверены, что хотите удалить этот пост?")) {
        const response = await fetch(`/posts/${postId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        alert(data.message);
        
        loadPosts();
    }
}

// Функция для подписки на пользователя
async function subscribe() {
    const subscribedUserId = document.getElementById("subscribedUserId").value;

    const response = await fetch(`/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: currentUserId, subscribed_user_id: subscribedUserId })
    });

    const data = await response.json();
    alert(data.message);
}

// Загрузить посты при загрузке страницы
window.onload = loadPosts;