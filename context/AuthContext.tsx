import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '@/config/appwriteConfig';
import { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  logout: () => Promise<void>;
  userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    profilePicture?: string;
  };
  updateUserData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  userData: {
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: undefined,
  },
  updateUserData: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: undefined,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      // Fetch user data from Appwrite
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setUserData({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePicture: undefined,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUserData = async (data: any) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const updatedData = await response.json();
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, userData, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
