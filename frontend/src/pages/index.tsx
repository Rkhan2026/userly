import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';

// Define the User interface to ensure type safety
interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  // Get API URL from environment variables or use a default value
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // State to store the list of users
  const [users, setUsers] = useState<User[]>([]);

  // State to manage the form input for creating a new user
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  // State to manage the form input for updating an existing user
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

  // Fetch the list of users from the API when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data.reverse()); // Reverse to display newest users first
      } catch (error) {
        console.error('Error fetching data:', error); // Log errors if fetching fails
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle the creation of a new user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(`${apiUrl}/users`, newUser);
      setUsers([response.data, ...users]); // Add the new user to the top of the list
      setNewUser({ name: '', email: '' }); // Reset the form inputs
    } catch (error) {
      console.error('Error creating user:', error); // Log errors if creation fails
    }
  };

  // Function to handle updating an existing user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await axios.put(`${apiUrl}/users/${updateUser.id}`, {
        name: updateUser.name,
        email: updateUser.email,
      });
      setUpdateUser({ id: '', name: '', email: '' }); // Reset the update form inputs
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email }; // Update the user in the state
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error updating user:', error); // Log errors if update fails
    }
  };

  // Function to handle deleting a user
  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId)); // Remove the user from the state
    } catch (error) {
      console.error('Error deleting user:', error); // Log errors if deletion fails
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        {/* App Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center">CRUD User Management</h1>

        {/* Form for creating a new user */}
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name" // Placeholder text for name input
            value={newUser.name} // Bind value to state
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} // Update state on change
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email" // Placeholder text for email input
            value={newUser.email} // Bind value to state
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} // Update state on change
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Add User
          </button>
        </form>

        {/* Form for updating an existing user */}
        <form onSubmit={handleUpdateUser} className="p-4 bg-green-100 rounded shadow">
          <input
            placeholder="User ID" // Input for the user ID to update
            value={updateUser.id} // Bind value to state
            onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })} // Update state on change
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Name" // Input for the new name
            value={updateUser.name} // Bind value to state
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })} // Update state on change
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Email" // Input for the new email
            value={updateUser.email} // Bind value to state
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })} // Update state on change
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
            Update User
          </button>
        </form>

        {/* List of users */}
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              {/* CardComponent to display user details */}
              <CardComponent card={user} />
              {/* Button to delete a user */}
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
