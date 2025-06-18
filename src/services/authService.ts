import { STORAGE_KEYS } from "@/constants";
/**
 * Authentication Service
 * Handles user authentication, session management, and security
 */

import { config } from "@/config";
import { User } from "@/types";
import { secureStorage } from "@/utils/secureStorage";
import { logError, logSecurityEvent, logAudit } from "@/utils/logger";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

export interface LoginAttempt {
  email: string;
  timestamp: number;
  successful: boolean;
  ipAddress?: string;
}

// Mock authentication service for development
class MockAuthService {
  static async authenticate(
    email: string,
    password: string
  ): Promise<User | null> {
    // For development purposes only
    if (password === "password123") {
      return {
        id: "mock-user-1",
        name: "Test User",
        email: email,
        role: 1, // Court role
        roleTitle: "Court Administrator",
        status: "active",
        added: new Date().toISOString(),
        caseCount: 0,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
    }
    return null;
  }

  static generateMockToken(id: string): string {
    return `mock-token-${id}-${Date.now()}`;
  }
}

class AuthenticationService {
  private readonly maxLoginAttempts = config.security.maxLoginAttempts;
  private readonly lockoutDuration = config.security.lockoutDuration;
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();

  constructor() {
    this.cleanupExpiredAttempts();
    // Clean up expired attempts every 5 minutes
    setInterval(() => this.cleanupExpiredAttempts(), 5 * 60 * 1000);
  }

  /**
   * Authenticate user with email and password
   */
  async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { email, password, rememberMe = false } = credentials;

      // Validate input
      if (!this.validateEmail(email)) {
        logSecurityEvent("Invalid email format during login", { email });
        return { success: false, error: "Invalid email format" };
      }

      if (!this.validatePassword(password)) {
        return { success: false, error: "Password does not meet requirements" };
      }

      // Check for account lockout
      if (this.isAccountLocked(email)) {
        logSecurityEvent("Login attempt on locked account", { email });
        return {
          success: false,
          error: "Account temporarily locked due to multiple failed attempts",
        };
      }

      // Attempt authentication
      let user: User | null = null;

      if (config.features.mockAuth) {
        user = await MockAuthService.authenticate(email, password);
      } else {
        // TODO: Implement real authentication with backend API
        user = await this.authenticateWithAPI(email, password);
      }

      // Record login attempt
      this.recordLoginAttempt(email, !!user);

      if (!user) {
        logSecurityEvent("Failed login attempt", { email });
        return { success: false, error: "Invalid credentials" };
      }

      // Create session
      const session = await this.createSession(user, rememberMe);
      await this.storeSession(session);

      logAudit("User login successful", {
        userId: user.id,
        email: user.email,
        role: user.roleTitle,
      });

      return { success: true, user };
    } catch (error) {
      logError(
        "Login process failed",
        { email: credentials.email },
        error instanceof Error ? error : new Error(String(error))
      );
      return { success: false, error: "Login failed due to technical error" };
    }
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      if (session) {
        logAudit("User logout", { userId: session.user.id });
      }

      await this.clearSession();
    } catch (error) {
      logError(
        "Logout process failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await this.getCurrentSession();
      return session?.user || null;
    } catch (error) {
      logError(
        "Failed to get current user",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      return null;
    }
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      if (!session) return false;

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        await this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      logError(
        "Session validation failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * Refresh session token
   */
  async refreshSession(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      if (!session || !session.refreshToken) return false;

      // TODO: Implement token refresh with backend API
      if (config.features.mockAuth) {
        const newSession = await this.createSession(session.user, true);
        await this.storeSession(newSession);
        return true;
      }

      return false;
    } catch (error) {
      logError(
        "Session refresh failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * Request a password reset for a user
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      // Validate email
      if (!this.validateEmail(email)) {
        return false;
      }

      if (config.features.mockAuth) {
        // Simulate API call success
        logAudit("Password reset requested", { email });
        return true;
      } else {
        // TODO: Implement actual API call
        // const response = await api.post('/auth/reset-password', { email });
        // return response.success;
        throw new Error("API password reset not implemented");
      }
    } catch (error) {
      logError(
        "Password reset request failed",
        { email },
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * Reset a user's password with a valid token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Validate password
      if (!this.validatePassword(newPassword)) {
        return false;
      }

      if (!token || token.length < 10) {
        return false;
      }

      if (config.features.mockAuth) {
        // Simulate API call success
        logAudit("Password reset completed", { tokenValid: true });
        return true;
      } else {
        // TODO: Implement actual API call
        // const response = await api.post('/auth/reset-password/confirm', {
        //   token,
        //   newPassword,
        // });
        // return response.success;
        throw new Error("API password reset completion not implemented");
      }
    } catch (error) {
      logError(
        "Password reset failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  // Private methods

  private async authenticateWithAPI(
    _email: string,
    _password: string
  ): Promise<User | null> {
    // TODO: Implement actual API authentication
    throw new Error("API authentication not implemented");
  }

  private async createSession(
    user: User,
    rememberMe: boolean
  ): Promise<AuthSession> {
    const sessionDuration = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : config.security.sessionTimeout; // 30 days or session timeout
    const expiresAt = Date.now() + sessionDuration;

    let token: string;
    let refreshToken: string | undefined;

    if (config.features.mockAuth) {
      token = MockAuthService.generateMockToken(user.id);
      refreshToken = rememberMe
        ? MockAuthService.generateMockToken(user.id + "_refresh")
        : undefined;
    } else {
      // TODO: Generate real JWT tokens
      token = "real_jwt_token";
      refreshToken = rememberMe ? "real_refresh_token" : undefined;
    }

    return {
      user,
      token,
      expiresAt,
      refreshToken,
    };
  }

  private async storeSession(session: AuthSession): Promise<void> {
    await secureStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(session.user)
    );
    await secureStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, session.token);

    if (session.refreshToken) {
      await secureStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        session.refreshToken
      );
    }
  }

  private async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const [userStr, token] = await Promise.all([
        secureStorage.getItem(STORAGE_KEYS.USER_DATA),
        secureStorage.getItem(STORAGE_KEYS.SESSION_TOKEN),
      ]);

      if (!userStr || !token) return null;

      const user = JSON.parse(userStr) as User;
      const refreshToken = await secureStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN
      );

      return {
        user,
        token,
        expiresAt: Date.now() + config.security.sessionTimeout, // Approximate, should be from token
        refreshToken: refreshToken || undefined,
      };
    } catch {
      return null;
    }
  }

  private async clearSession(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(STORAGE_KEYS.USER_DATA),
      secureStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN),
      secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  }

  private validateEmail(email: string): boolean {
    return config.validation.EMAIL_REGEX.test(email);
  }

  private validatePassword(password: string): boolean {
    return (
      password.length >= config.validation.MIN_PASSWORD_LENGTH &&
      password.length <= config.validation.MAX_PASSWORD_LENGTH
    );
  }

  private recordLoginAttempt(email: string, successful: boolean): void {
    const attempt: LoginAttempt = {
      email,
      timestamp: Date.now(),
      successful,
    };

    const attempts = this.loginAttempts.get(email) || [];
    attempts.push(attempt);

    // Keep only recent attempts
    const cutoff = Date.now() - this.lockoutDuration;
    const recentAttempts = attempts.filter((a) => a.timestamp > cutoff);

    this.loginAttempts.set(email, recentAttempts);
  }

  private isAccountLocked(email: string): boolean {
    const attempts = this.loginAttempts.get(email) || [];
    const cutoff = Date.now() - this.lockoutDuration;
    const recentFailedAttempts = attempts.filter(
      (a) => !a.successful && a.timestamp > cutoff
    );

    return recentFailedAttempts.length >= this.maxLoginAttempts;
  }

  private cleanupExpiredAttempts(): void {
    const cutoff = Date.now() - this.lockoutDuration;

    for (const [email, attempts] of this.loginAttempts.entries()) {
      const validAttempts = attempts.filter((a) => a.timestamp > cutoff);

      if (validAttempts.length === 0) {
        this.loginAttempts.delete(email);
      } else {
        this.loginAttempts.set(email, validAttempts);
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthenticationService();

export default authService;
