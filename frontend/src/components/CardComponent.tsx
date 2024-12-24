import React from "react";

// Define the interface for the Card props to ensure type safety
// This interface matches the structure of the "User" object used in the `Home` component
interface Card {
  id: number; // User's unique ID
  name: string; // User's name
  email: string; // User's email
}

// Define a functional component that receives a "card" object as a prop
// This component is designed to display the details of a single user
const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    // A styled container for the card
    <div className="bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
      {/* Display the user ID */}
      <div className="text-sm text-gray-600">ID: {card.id}</div>
      {/* Display the user name with prominent styling */}
      <div className="text-lg font-semibold text-gray-800">{card.name}</div>
      {/* Display the user email with a slightly subdued style */}
      <div className="text-md text-gray-700">{card.email}</div>
    </div>
  );
};

// Export the component so it can be used in other parts of the application
export default CardComponent;
