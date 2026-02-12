
const AUTH_KEY = 'openshelf_auth';

export const authService = {
  login: (username: string) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username, isLoggedIn: true }));
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
  isAuthenticated: (): boolean => {
    const data = localStorage.getItem(AUTH_KEY);
    return !!data && JSON.parse(data).isLoggedIn;
  },
  getUser: () => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }
};
