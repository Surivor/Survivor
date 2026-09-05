const TOKEN_KEY = "Ticket_tout_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

function decodeJwtPayload(token: string) {
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;

  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = decodeJwtPayload(token);
    return payload?.status || null;
  } catch (e) {
    console.error("Erreur de décodage du token", e);
    return null;
  }
}