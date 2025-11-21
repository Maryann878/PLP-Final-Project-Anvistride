import React from "react";

interface DemoCardProps {
  title: string;
  description: string;
  progress?: number;
  meta?: Record<string, string | number>;
  tags?: string[];
}

export const DemoCard: React.FC<DemoCardProps> = ({ title, description, progress, meta, tags }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>

      {meta && (
        <div className="flex gap-2 mt-2 text-sm text-gray-500">
          {Object.entries(meta).map(([key, value]) => (
            <span key={key} className="bg-gray-100 px-2 py-1 rounded">
              {key}: {value}
            </span>
          ))}
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-2">
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">{progress}% Complete</span>
        </div>
      )}

      {tags && (
        <div className="flex gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
