/**
 * Modular Auth Backend Controller
 */

import { dbEngine } from '../../src/db/dbEngine';

export class AuthController {
  public static async authenticate(email: string, pass: string) {
    const user = dbEngine.users.getAll().find(u => u.email === email && u.passwordHash === pass);
    if (user) {
      return { success: true, user: { id: user.id, email: user.email, role: user.role } };
    }
    return { success: false, message: 'Invalid credentials' };
  }
}
