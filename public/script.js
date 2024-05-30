document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const userSetup = document.getElementById('userSetup');
  const postForm = document.getElementById('postForm');
  const usernameInput = document.getElementById('username');
  const saveNameButton = document.getElementById('saveName');
  const messageInput = document.getElementById('message');
  const postsContainer = document.getElementById('posts');

  // Load the username from local storage if it exists
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
      usernameInput.value = savedUsername;
      userSetup.style.display = 'none';
      postForm.style.display = 'block';
  }

  // Save the username when the button is clicked
  saveNameButton.addEventListener('click', () => {
      const username = usernameInput.value.trim();
      if (username) {
          localStorage.setItem('username', username);
          userSetup.style.display = 'none';
          postForm.style.display = 'block';
      }
  });

  // Handle form submission
  postForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = localStorage.getItem('username');
      const message = messageInput.value.trim();

      if (username && message) {
          const post = { username, message };
          socket.emit('message', post);
          postForm.reset();
      }
  });

  // Listen for incoming messages
  socket.on('message', (post) => {
      addPost(post.username, post.message);
  });

  // Initialize with existing messages
  socket.on('init', (messages) => {
      messages.forEach((post) => addPost(post.username, post.message));
  });

  // Function to add a new post
  function addPost(username, message) {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `<strong>${username}</strong>: ${message}`;
      postsContainer.appendChild(postElement);
  }
});
