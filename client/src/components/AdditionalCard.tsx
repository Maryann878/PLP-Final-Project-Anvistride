import React from "react";

interface AdditionalCardProps {
  icon: JSX.Element;
  title: string;
  text: string;
}

const AdditionalCard: React.FC<AdditionalCardProps> = ({ icon, title, text }) => {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md scroll-animate-scale">
      <div className="text-purple-600 text-3xl mb-3">{icon}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  );
};

export default AdditionalCard;
