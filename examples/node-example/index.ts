import { createTurfetch } from 'turfetch';

// Create a Turfetch instance with a base URL
const api = createTurfetch({ baseUrl: 'https://jsonplaceholder.typicode.com' });

async function run() {
  try {
    console.log('Fetching posts...');
    const posts = await api.get('/posts', { timeout: 5000 });
    console.log('Posts:', posts.slice(0, 3)); // Display only the first 3 posts

    console.log('\nCreating a new post...');
    const newPost = await api.post('/posts', {
      body: { title: 'New Post', body: 'This is a new post', userId: 1 },
    });
    console.log('New Post:', newPost);

    console.log('\nUpdating a post...');
    const updatedPost = await api.put('/posts/1', {
      body: { title: 'Updated Title', body: 'Updated Content' },
    });
    console.log('Updated Post:', updatedPost);

    console.log('\nDeleting a post...');
    const deleteResponse = await api.delete('/posts/1');
    console.log('Delete Response:', deleteResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
