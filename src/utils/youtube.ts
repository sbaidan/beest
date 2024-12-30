export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const videoId = getYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?origin=${window.location.origin}` : null;
  } catch {
    return null;
  }
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}