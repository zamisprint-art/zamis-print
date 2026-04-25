import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = "#eab308" }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-500">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star size={14} fill={color} color={color} />
            ) : value >= index - 0.5 ? (
              <StarHalf size={14} fill={color} color={color} />
            ) : (
              <Star size={14} color="#4b5563" /> // gray-600
            )}
          </span>
        ))}
      </div>
      {text && <span className="text-xs text-gray-400">{text}</span>}
    </div>
  );
};

export default Rating;
