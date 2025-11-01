import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name?: string;
  isVerified?: boolean;
}

export interface UserSession {
  user: User;
  token: string;
}

const USER_SESSION_KEY = 'user_session';

export const userSession = {
  // Store user session data
  async setSession(session: UserSession): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to store user session:', error);
    }
  },

  // Get user session data
  async getSession(): Promise<UserSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem(USER_SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Failed to get user session:', error);
      return null;
    }
  },

  // Clear user session data
  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear user session:', error);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const session = await this.getSession();
    return session?.user || null;
  },

  // Get auth token
  async getToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.token || null;
  }
};
