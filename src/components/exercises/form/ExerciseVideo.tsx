import React from 'react';
import { getYouTubeEmbedUrl } from '../../../utils/youtube';

interface ExerciseVideoProps {
  videoUrl: string;
  onChange: (url: string) => void;
}

export default function ExerciseVideo({ videoUrl, onChange }: ExerciseVideoProps) {
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <div>
      <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
        YouTube Video URL
      </label>
      <input
        type="url"
        id="videoUrl"
        value={videoUrl}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="https://www.youtube.com/watch?v=..."
      />
      {embedUrl && (
        <div className="mt-4 aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}