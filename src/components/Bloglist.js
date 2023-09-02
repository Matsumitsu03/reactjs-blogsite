import React, { useEffect, useState, useContext } from 'react';
import { getDocs, collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; 
import { AuthContext } from '../context/AuthProvider'; 

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null); 
  const [editedTitle, setEditedTitle] = useState(''); 
  const [editedContent, setEditedContent] = useState(''); 
  const { auth } = useContext(AuthContext); 

  useEffect(() => {
    const fetchData = async () => {
      const blogCollection = collection(firestore, 'blogs'); 
      const blogSnapshot = await getDocs(blogCollection);
      const blogData = blogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogData);
    };

    fetchData();
  }, []);

  const handleDelete = async (blogId) => {
    const blogRef = doc(firestore, 'blogs', blogId); 
    try {
      await deleteDoc(blogRef);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog: ', error);
    }
  };

  const handleEdit = async (blogId) => {
    setEditingBlogId(blogId); 
    const blogToEdit = blogs.find((blog) => blog.id === blogId);
    setEditedTitle(blogToEdit.title);
    setEditedContent(blogToEdit.content);
  };

  const handleSaveEdit = async (blogId) => {
    const blogRef = doc(firestore, 'blogs', blogId); 
    try {
      await updateDoc(blogRef, {
        title: editedTitle,
        content: editedContent,
      });
      setEditingBlogId(null); 
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, title: editedTitle, content: editedContent } : blog
        )
      );
    } catch (error) {
      console.error('Error updating blog: ', error);
    }
  };

  return (
    <div>
      <h1>Blog List</h1>
      {auth && <p>User Email: {auth.email}</p>}
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {editingBlogId === blog.id ? ( 
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(blog.id)}>Save</button>
                <button onClick={() => setEditingBlogId(null)}>Cancel</button>
              </div>
            ) : ( // View mode
              <>
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>
                {auth && auth.email === blog.authorEmail && (
                  <>
                    <button onClick={() => handleEdit(blog.id)}>Edit</button>
                    <button onClick={() => handleDelete(blog.id)}>Delete</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
