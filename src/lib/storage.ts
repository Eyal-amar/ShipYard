import { AppState } from "./types";
import { STORAGE_KEY, DEFAULT_STATE } from "./constants";

export function load(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as AppState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function save(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}
