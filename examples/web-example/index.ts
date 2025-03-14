import { createTurfetch } from 'turfetch';

const api = createTurfetch({ baseUrl: 'https://jsonplaceholder.typicode.com' });

async function fetchData() {
  try {
    const posts = await api.get('/posts', { timeout: 5000 });
    document.getElementById('output')!.innerText = JSON.stringify(posts.slice(0, 3), null, 2);
  } catch (error) {
    document.getElementById('output')!.innerText = 'Error: ' + error;
  }
}

document.getElementById('fetchData')!.addEventListener('click', fetchData);
