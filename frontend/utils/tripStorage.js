const STORAGE_KEY = "travel_dashboard_trips";

export function loadTripsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTripsToStorage(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}
