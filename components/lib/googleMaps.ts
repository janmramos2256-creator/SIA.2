/**
 * Loads Google Maps JavaScript API once. Safe to call multiple times.
 * Enable in Google Cloud: Maps JavaScript API + Distance Matrix API (if using Distance Matrix).
 */
const CALLBACK_NAME = '__googleMapsInit';

export function getGoogleMapsApiKey(): string {
  return String((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '').trim();
}

export function getBusinessOrigin(): string {
  const fromEnv = String((import.meta as any).env?.VITE_BUSINESS_ORIGIN || '').trim();
  if (fromEnv) return fromEnv;
  // Default: Metro Manila area (change via .env)
  return 'Manila, Metro Manila, Philippines';
}

export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (!apiKey) return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'));
  if (typeof window !== 'undefined' && (window as any).google?.maps) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-google-maps="true"]`)) {
      const check = () => {
        if ((window as any).google?.maps) resolve();
        else setTimeout(check, 50);
      };
      check();
      return;
    }
    (window as any)[CALLBACK_NAME] = () => {
      resolve();
      delete (window as any)[CALLBACK_NAME];
    };
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry&callback=${CALLBACK_NAME}`;
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}
