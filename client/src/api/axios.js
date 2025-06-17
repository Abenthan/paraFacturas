import axios from 'axios'; 

const instance = axios.create({
    baseURL: 'https://parafacturas-production.up.railway.app/api' || 'http://localhost:5173/api',
    withCredentials: true,
});

export default instance;