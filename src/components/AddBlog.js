import React, { useState, useContext } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp
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
        timestamp: serverTimestamp(), // Add the serverTimestamp
      });

      setNewBlog({ title: '', content: '' });
      console.log('New blog added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding blog: ', error);
    }
  };

  return (
    <div>
      <h2>Add New Blog</h2>
      {auth && <p>User Email: {auth.email}</p>}
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          name="content"
          value={newBlog.content}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleAddBlog}>Add Blog</button>
    </div>
  );
}

export default AddBlog;
