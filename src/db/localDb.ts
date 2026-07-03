/**
 * Enterprise Database Interface (Client-Side Persistence)
 * Simulates a robust database storage for users and workspace configuration
 */

export interface RegisteredUser {
  id: string;
  email: string;
  phone: string;
  passwordHash: string; // Simplified hash representation
  createdAt: string;
}

const USERS_KEY = 'ai_business_os_db_users';

export const localDb = {
  // Get all users
  getUsers(): RegisteredUser[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read from local DB', e);
      return [];
    }
  },

  // Check if a user with email or phone already exists
  userExists(email: string, phone: string): { exists: boolean; field: 'email' | 'phone' | null } {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { exists: true, field: 'email' };
    }
    if (phone && users.some((u) => u.phone === phone)) {
      return { exists: true, field: 'phone' };
    }
    return { exists: false, field: null };
  },

  // Save a new registered user
  saveUser(user: Omit<RegisteredUser, 'id' | 'createdAt'>): RegisteredUser {
    const users = this.getUsers();
    const newUser: RegisteredUser = {
      ...user,
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  // Authenticate user
  authenticate(identifier: string, passwordPlain: string): RegisteredUser | null {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.phone === cleanId
    );
    if (foundUser && foundUser.passwordHash === passwordPlain) {
      return foundUser;
    }
    return null;
  },
};
