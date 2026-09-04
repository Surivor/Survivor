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

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    return payload.status || null; 
  } catch (e) {
    console.error("Erreur de décodage du token", e);
    return null;
  }
}