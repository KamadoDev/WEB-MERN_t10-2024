// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         // target: 'http://4000', // URL thực của backend
//         target: 'https://mern-fullstack-server-1024.onrender.com', // URL thực của backend
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''), // Chuyển hướng URL bắt đầu bằng /api
//       },
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
