import React from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  title: string;
  subtitle: string;
  badge?: string;
  emoji?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, badge, emoji, link = "#" }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => link !== "#" && navigate(link)}
      className="
        bg-white shadow-md rounded-xl p-5 cursor-pointer
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200
        border border-gray-100
      "
    >
      <div className="text-4xl mb-3">{emoji}</div>

      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>

      {badge && (
        <span
          className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mt-3"
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default Card;
