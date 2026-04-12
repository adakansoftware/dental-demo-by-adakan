function normalizeUrl(value: string) {
  return value.trim();
}

export function isValidGoogleMapsEmbedUrl(value: string) {
  const normalized = normalizeUrl(value);
  if (!normalized) {
    return true;
  }

  try {
    const url = new URL(normalized);
    return (
      (url.hostname === "www.google.com" || url.hostname === "google.com") &&
      url.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}

export function getGoogleMapsEmbedError(value: string) {
  const normalized = normalizeUrl(value);
  if (!normalized) {
    return null;
  }

  if (isValidGoogleMapsEmbedUrl(normalized)) {
    return null;
  }

  return "Google Maps icin yalnizca 'Harita yerlestir' adimindan gelen https://www.google.com/maps/embed?... linki kullanilabilir.";
}
