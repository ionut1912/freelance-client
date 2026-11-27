import { store } from "../store";

export function isAuthenticated(): boolean {
  try {
    const state = store.getState();
    const role = state.auth.role;
    // A role alone is only the choice made before registering.
    return Boolean(role) && Boolean(localStorage.getItem("jwt"));
  } catch {
    return false;
  }
}
