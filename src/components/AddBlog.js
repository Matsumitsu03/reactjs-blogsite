import React, { useState, useContext } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { firestore } from '../firebase';
import { AuthContext } from '../context/AuthProvider';

function AddBlog() {
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });
  const { auth } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      alert('Please fill in both title and content fields.');
      return;
    }

    try {
      const blogsCollection = collection(firestore, 'blogs');
      const docRef = await addDoc(blogsCollection, {
        title: newBlog.title,
        content: newBlog.content,
        authorEmail: auth.email,
        timestamp: serverTimestamp(), 
      });

      setNewBlog({ title: '', content: '' });
      console.log('New blog added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding blog: ', error);
    }
  };

  return (
<div className="w-full max-w-md mx-auto p-4">
  <h2 className="text-2xl font-semibold mb-4">Add New Blog</h2>
  {auth && <p className="mb-4">User: {auth.email}</p>}
  <div className="mb-4">
    <label className="block text-gray-700">Title:</label>
    <input
      type="text"
      name="title"
      value={newBlog.title}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700">Content:</label>
    <textarea
      name="content"
      value={newBlog.content}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    />
  </div>
  <button
    onClick={handleAddBlog}
    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
  >
    Add Blog
  </button>
</div>

  );
}

export default AddBlog;
