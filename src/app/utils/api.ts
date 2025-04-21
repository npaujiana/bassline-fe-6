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

// Venue interfaces
export interface Venue {
  id: number;
  name: string;
  address?: string;
  description?: string;
  category?: string;
  rating?: number;
  [key: string]: any; // For additional properties
}

// Amenity interfaces
export interface Amenity {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  [key: string]: any; // For additional properties
}

// Tag interfaces
export interface Tag {
  id: number;
  name: string;
  slug?: string;
  [key: string]: any; // For additional properties
}

// Genre interfaces
export interface Genre {
  id: number;
  name: string;
  description?: string;
  [key: string]: any; // For additional properties
}

// Article interfaces
export interface Article {
  id: number;
  title: string;
  url?: string;
  content: string;
  status: 'draft' | 'published';
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverImageUrl?: string;
  published_at?: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  deleted_at?: string;
  author?: string; // For compatibility with existing components
  location?: string; // For compatibility with existing components
}

export interface CreateArticleData {
  title: string;
  content: string;
  status: 'draft' | 'published';
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverImage?: File | null;
}

export interface UpdateArticleData {
  id: number;
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverImage?: File | null;
}

// Article API functions
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axiosInstance.get('/api/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchArticleById = async (id: number | string): Promise<Article> => {
  try {
    const response = await axiosInstance.get(`/api/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
};

export const createArticle = async (articleData: CreateArticleData): Promise<Article> => {
  try {
    // Handle file upload separately if coverImage is included
    let uploadedImageUrl: string | undefined;
    
    if (articleData.coverImage) {
      const formData = new FormData();
      formData.append('file', articleData.coverImage);
      
      const uploadResponse = await axiosInstance.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      uploadedImageUrl = uploadResponse.data.url;
    }
    
    // Create article with image URL if available
    const response = await axiosInstance.post('/api/articles', {
      ...articleData,
      coverImageUrl: uploadedImageUrl,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

export const updateArticle = async (articleData: UpdateArticleData): Promise<Article> => {
  try {
    // Handle file upload separately if coverImage is included
    let uploadedImageUrl: string | undefined;
    
    if (articleData.coverImage) {
      const formData = new FormData();
      formData.append('file', articleData.coverImage);
      
      const uploadResponse = await axiosInstance.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      uploadedImageUrl = uploadResponse.data.url;
    }
    
    // Prepare data for update by removing the File object
    const { coverImage, ...restData } = articleData;
    
    // Update article with image URL if available
    const response = await axiosInstance.put(`/api/articles/${articleData.id}`, {
      ...restData,
      ...(uploadedImageUrl && { coverImageUrl: uploadedImageUrl }),
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating article ${articleData.id}:`, error);
    throw error;
  }
};

export const deleteArticle = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/articles/${id}`);
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error);
    throw error;
  }
};

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
    url: 'https://ameera-org.my.id/api/register',
    // headers: {
    //   'accept': 'application/json',
    //   'accept-encoding': 'gzip, deflate, br, zstd',
    //   'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    //   'content-type': 'application/json',
    //   'origin': 'https://ameera-org.my.id',
    //   'referer': 'https://ameera-org.my.id/swagger/',
    //   'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    //   'sec-ch-ua-mobile': '?0',
    //   'sec-ch-ua-platform': '"Windows"',
    //   'sec-fetch-dest': 'empty',
    //   'sec-fetch-mode': 'cors',
    //   'sec-fetch-site': 'same-origin',
    //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    //   'x-csrftoken': csrfToken || 'vHzKk8vmXVQ2rShkN5YkLHIww4CNzdrEQujGxuaHsKXwaLxb7TFHv3TjVks1UqDR'
    // },
    data: userData,
  });
};

// Venues API functions
export const fetchVenues = async (): Promise<Venue[]> => {
  try {
    const response = await axiosInstance.get('/api/venues');
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const fetchVenueById = async (id: number | string): Promise<Venue> => {
  try {
    const response = await axiosInstance.get(`/api/venues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    throw error;
  }
};

// Amenities API functions
export const fetchAmenities = async (): Promise<Amenity[]> => {
  try {
    const response = await axiosInstance.get('/api/amenities');
    return response.data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    throw error;
  }
};

// Tags API functions
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await axiosInstance.get('/api/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Genres API functions
export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axiosInstance.get('/api/genres');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export default axiosInstance;
