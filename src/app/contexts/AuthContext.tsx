"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../utils/api";

// Define interfaces for token data
interface DecodedToken {
  token_type?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  user_id?: number;
  id?: number;
  email?: string;
  username?: string;
  // Add other fields as necessary
}

interface LoginResponse {
  refresh?: string;
  access?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  [key: string]: any;
}

type User = {
  id?: number;
  email?: string;
  username?: string;
  // Add other user fields as needed
}

type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, password2: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Base API URL
  const API_BASE_URL = "https://ameera-org.my.id";

  // Parse and extract user data from token or response
  const extractUserInfo = (token: string | null, responseData?: any): User | null => {
    // First try to get user data from the response if available
    if (responseData && responseData.user) {
      return responseData.user;
    }
    
    // If not, try to decode the token
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return {
          id: decoded.user_id || decoded.id,
          email: decoded.email,
          username: decoded.username
          // Add other properties as needed
        };
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    return null;
  };

  // Check for existing tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        const storedUserInfo = localStorage.getItem("userInfo");
        
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          
          try {
            // First try to parse stored user info
            if (storedUserInfo) {
              setUser(JSON.parse(storedUserInfo));
            } else {
              // Otherwise extract from token
              const userData = extractUserInfo(storedAccessToken);
              if (userData) {
                setUser(userData);
                localStorage.setItem("userInfo", JSON.stringify(userData));
              }
            }
          } catch (error) {
            console.error("Error initializing auth:", error);
          }
        }
        
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // API login function
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      // Create a request body
      const requestBody = {
        username,
        password,
      };
      
      // Call the API endpoint
      const response = await axiosInstance.post<LoginResponse>('/api/login/', requestBody);
      const data = response.data;
      
      console.log("Login response:", data);
      
      // Extract tokens from response (handle different response formats)
      const accessToken = data.access || data.token || data.accessToken;
      const refreshToken = data.refresh || data.refreshToken;
      
      if (!accessToken) {
        throw new Error('Access token not found in response');
      }
      
      // Save tokens to local storage
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      // Update state
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      // Extract and store user data
      const userData = extractUserInfo(accessToken, data);
      if (userData) {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        if (userData.id) {
          localStorage.setItem("userId", userData.id.toString());
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = 'An unknown error occurred';
      
      if (error.response) {
        // Handle different error response formats
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // API register function
  const register = async (email: string, password: string, password2: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      // Create a request body
      const requestBody = {
        email,
        password,
        password2
      };
      
      // Call the API endpoint
      const response = await axiosInstance.post('/api/register/', requestBody);
      
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = 'An unknown error occurred';
      
      if (error.response) {
        // Handle validation errors which might be in different formats
        if (error.response.data.email) {
          errorMessage = `Email: ${error.response.data.email.join(', ')}`;
        } else if (error.response.data.password) {
          errorMessage = `Password: ${error.response.data.password.join(', ')}`;
        } else if (error.response.data.password2) {
          errorMessage = `Confirm Password: ${error.response.data.password2.join(', ')}`;
        } else if (error.response.data.detail || error.response.data.message) {
          errorMessage = error.response.data.detail || error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Clear tokens from local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userInfo");
      
      // Update state
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      
      // If you have a logout endpoint, call it here
      // if (accessToken) {
      //   try {
      //     await axiosInstance.post('/api/logout/', { 
      //       refresh: refreshToken 
      //     });
      //   } catch (error) {
      //     console.warn('Logout API call failed, but proceeding with local logout');
      //   }
      // }
      
      // Redirect to login page
      router.push("/login");
      
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred during logout' 
      };
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        refreshToken,
        login,
        register,
        logout,
        loading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
