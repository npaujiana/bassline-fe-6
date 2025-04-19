import axios from 'axios';

// Membuat instance axios dengan URL base API
const axiosInstance = axios.create({
  baseURL: 'https://ameera-org.my.id',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token pada header request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Specific function for registration with valid headers (without HTTP/2 pseudo-headers)
// Define interfaces for user data and registration response
interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface RegistrationResponse {
  [key: string]: any; // This can be refined based on actual API response
}

export const registerUser = async (userData: UserRegistrationData): Promise<RegistrationResponse> => {
  // Get CSRF token from cookies if available
  const getCsrfToken = (): string => {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] || '' : '';
  };

  const csrfToken: string = getCsrfToken();

  return await axios<RegistrationResponse>({
    method: 'POST',
    url: 'https://ameera-org.my.id/api/register/',
    headers: {
      'accept': 'application/json',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/json',
      'origin': 'https://ameera-org.my.id',
      'referer': 'https://ameera-org.my.id/swagger/',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'x-csrftoken': csrfToken || 'vHzKk8vmXVQ2rShkN5YkLHIww4CNzdrEQujGxuaHsKXwaLxb7TFHv3TjVks1UqDR'
    },
    data: userData,
  });
};

export default axiosInstance;
