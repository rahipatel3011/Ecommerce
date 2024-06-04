import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // Change this to your desired port number
        host: 'localhost', // Optional: allow connections from network interfaces
        open: true, // Optional: open the browser on server start
        https: false, // Optional: enable HTTPS
    },
})
