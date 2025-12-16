/**
 * Auth Store for Astro
 * Manages authentication with multi-account switching support
 */

const AUTH_STORAGE_KEY = 'auth-storage';
const TOKEN_COOKIE_NAME = 'token';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface AccountWithToken extends User {
  token: string;
}

interface AuthState {
  user: AccountWithToken | null;
  accounts: AccountWithToken[];
  activeAccountId: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const defaultState: AuthState = {
  user: null,
  accounts: [],
  activeAccountId: null,
  token: null,
  isAuthenticated: false,
};

/**
 * Load auth state from localStorage
 */
export function loadAuthState(): AuthState {
  if (typeof localStorage === 'undefined') {
    return defaultState;
  }

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }

    const parsed = JSON.parse(stored);
    return {
      ...defaultState,
      ...parsed.state,
    };
  } catch (error) {
    console.error('Failed to load auth state:', error);
    return defaultState;
  }
}

/**
 * Save auth state to localStorage
 */
export function saveAuthState(state: Partial<AuthState>): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    const current = loadAuthState();
    const updated = { ...current, ...state };

    // Match Zustand persist format
    const data = {
      state: {
        user: updated.user,
        token: updated.token,
        accounts: updated.accounts,
        activeAccountId: updated.activeAccountId,
        isAuthenticated: updated.isAuthenticated,
      },
      version: 0,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
}

/**
 * Get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Set cookie value
 */
function setCookie(name: string, value: string, days = 1): void {
  if (typeof document === 'undefined') {
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;${secure ? 'secure;' : ''}samesite=strict`;
}

/**
 * Remove cookie
 */
function removeCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Login with credentials
 */
export async function login(credentials: {
  email: string;
  password: string;
  remember?: boolean;
}): Promise<void> {
  // Mock login - replace with actual API call
  const mockUser: AccountWithToken = {
    id: '1',
    name: '演示用户',
    email: credentials.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
    role: 'admin',
    token: `mock-token-${Date.now()}`,
  };

  const mockAccounts = [mockUser];

  setCookie(TOKEN_COOKIE_NAME, mockUser.token, credentials.remember ? 7 : 1);

  saveAuthState({
    user: mockUser,
    token: mockUser.token,
    accounts: mockAccounts,
    activeAccountId: mockUser.id,
    isAuthenticated: true,
  });
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  removeCookie(TOKEN_COOKIE_NAME);
  saveAuthState({
    user: null,
    token: null,
    accounts: [],
    activeAccountId: null,
    isAuthenticated: false,
  });

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}

/**
 * Switch to a different account
 */
export async function switchAccount(accountId: string): Promise<void> {
  const state = loadAuthState();
  const account = state.accounts.find((item) => item.id === accountId);

  if (!account) {
    throw new Error('账号不存在');
  }

  setCookie(TOKEN_COOKIE_NAME, account.token, 7);

  saveAuthState({
    user: account,
    token: account.token,
    activeAccountId: account.id,
    isAuthenticated: true,
  });

  // Refresh page to apply new account
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Load accounts from API (mock)
 */
export async function loadAccounts(): Promise<void> {
  const state = loadAuthState();

  // Mock accounts - replace with actual API call
  const mockAccounts: AccountWithToken[] = [
    {
      id: '1',
      name: '主账号',
      email: 'admin@halolight.h7ml.cn',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: 'admin',
      token: 'mock-token-1',
    },
    {
      id: '2',
      name: '测试账号',
      email: 'test@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      role: 'user',
      token: 'mock-token-2',
    },
  ];

  const activeAccount =
    mockAccounts.find((acc) => acc.id === state.activeAccountId) ||
    mockAccounts.find((acc) => acc.token === state.token) ||
    state.user ||
    null;

  if (activeAccount) {
    setCookie(TOKEN_COOKIE_NAME, activeAccount.token, 7);
  } else {
    removeCookie(TOKEN_COOKIE_NAME);
  }

  saveAuthState({
    accounts: mockAccounts,
    user: activeAccount,
    activeAccountId: activeAccount?.id || null,
    token: activeAccount?.token || null,
    isAuthenticated: Boolean(activeAccount),
  });
}

/**
 * Check authentication status
 */
export async function checkAuth(): Promise<boolean> {
  const token = getCookie(TOKEN_COOKIE_NAME);
  const state = loadAuthState();

  if (!token) {
    saveAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      activeAccountId: null,
    });
    return false;
  }

  // Check if token matches cached account
  const cachedAccount = state.accounts.find((acc) => acc.token === token);
  if (cachedAccount) {
    saveAuthState({
      user: cachedAccount,
      token,
      activeAccountId: cachedAccount.id,
      isAuthenticated: true,
    });
    return true;
  }

  // Mock user fetch - replace with actual API call
  const mockUser: AccountWithToken = {
    id: '1',
    name: '演示用户',
    email: 'demo@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    role: 'admin',
    token,
  };

  saveAuthState({
    user: mockUser,
    token,
    accounts: [mockUser],
    activeAccountId: mockUser.id,
    isAuthenticated: true,
  });

  return true;
}

/**
 * Get current user
 */
export function getCurrentUser(): AccountWithToken | null {
  const state = loadAuthState();
  return state.user;
}

/**
 * Get all accounts
 */
export function getAccounts(): AccountWithToken[] {
  const state = loadAuthState();
  return state.accounts;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const state = loadAuthState();
  return state.isAuthenticated;
}
