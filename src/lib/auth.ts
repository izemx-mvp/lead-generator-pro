export const DEMO_EMAIL = "naima@agence.ai";
export const DEMO_PASSWORD = "demo1234";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("naima-authed") === "1";
}

export function signIn(email: string, password: string): boolean {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem("naima-authed", "1");
    return true;
  }
  return false;
}

export function signOut() {
  localStorage.removeItem("naima-authed");
}
