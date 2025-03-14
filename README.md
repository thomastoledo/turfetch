### **📖 Turfetch - A Boosted Fetch API**
🚀 **Turfetch** is a lightweight, feature-rich wrapper around the native `fetch` API, providing:
- **Automatic error handling** 🛑
- **Built-in timeouts** ⏳
- **Retry logic** 🔄
- **Query string support** with [urlchemy](https://github.com/thomastoledo/urlchemy) 🔗
- **Base URL configuration** 🌍
- **TypeScript support** ✅

---

## **📦 Installation**
Install via **npm** or **yarn**:
```sh
npm install turfetch
# or
yarn add turfetch
```

---

## **🚀 Quick Start**
### **Creating a Turfetch instance**
You can create an instance with a **base URL** for convenient API calls.
```ts
import { createTurfetch } from 'turfetch';

const api = createTurfetch({ baseUrl: 'https://jsonplaceholder.typicode.com' });

async function fetchPosts() {
  try {
    const posts = await api.get('/posts');
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}

fetchPosts();
```

---

## **🌟 Features**
### **1. Automatic Error Handling**
If the request fails (e.g., 404 or 500 status), an error is thrown.
```ts
try {
  const user = await api.get('/invalid-endpoint');
} catch (error) {
  console.error(error); // Logs: "HTTP error: 404 Not Found"
}
```

---

### **2. Built-in Timeouts**
Requests will **automatically abort** if they exceed the specified timeout.
```ts
try {
  const data = await api.get('/slow-endpoint', { timeout: 5000 }); // Timeout in 5s
} catch (error) {
  console.error(error); // Logs: "Request timed out"
}
```

---

### **3. Retry Logic**
You can configure the number of retries and an optional retry callback.
```ts
const response = await api.get('/unstable-endpoint', {
  retry: 3,
  onRetry: (attempt) => console.log(`Retry attempt: ${attempt}`),
});
```
Example output:
```
Retry attempt: 1
Retry attempt: 2
Retry attempt: 3
```

---

### **4. Query Parameters Support**
Using [urlchemy](https://github.com/thomastoledo/urlchemy), query parameters are **automatically formatted**.
```ts
const data = await api.get('/users', { query: { id: 42, name: 'John Doe' } });
// Makes request: GET /users?id=42&name=John%20Doe
```

---

### **5. Flexible Request Methods**
Turfetch supports **GET, POST, PUT, and DELETE** methods.
```ts
const newUser = await api.post('/users', {
  body: { name: 'John Doe', age: 30 },
});
```

---

## **🔧 API Reference**
### **`createTurfetch({ baseUrl?: string }): TurfetchInstance`**
Creates a new **Turfetch instance** with an optional base URL.

#### **Methods:**
| Method  | Description |
|---------|------------|
| `get(endpoint: string, options?: TurfetchOptions)` | Performs a **GET** request |
| `post(endpoint: string, options?: TurfetchOptions)` | Performs a **POST** request |
| `put(endpoint: string, options?: TurfetchOptions)` | Performs a **PUT** request |
| `delete(endpoint: string, options?: TurfetchOptions)` | Performs a **DELETE** request |

---

## **📌 Roadmap (Future Features)**
✅ **Current Features:**
- [x] Error handling
- [x] Timeout support
- [x] Retry mechanism
- [x] Query parameters

🚀 **Planned Features:**
- [ ] **Custom Error Handling Hooks** (define error-handling callbacks)
- [ ] **Progress Tracking** (track upload/download progress)
- [ ] **Request Cancellation** (manually cancel an ongoing request)

---

## **📜 License**
MIT © 2025 [Thomas Toledo-Pierre](https://github.com/thomastoledo)

---

Would you like to extend Turfetch further? Feel free to contribute! 🚀