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
    <div className='flex bg-slate-300 flex-col justify-center items-center'>
      <h1 className='text-xl'>Blog List</h1>
      <ul className='flex flex-wrap m-2'>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {editingBlogId === blog.id ? ( 
              <div className='flex flex-col'>
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
                <div className='flex flex-col justify-center bg-blue-300 m-3 p-2'>
                  <p className='text-gray-600'>@{blog.authorEmail}</p> 
                  <h2>{blog.title}</h2>
                  <p>{blog.content}</p>
                  {auth && auth.email === blog.authorEmail && (
                    <>
                    <div>
                      <button onClick={() => handleEdit(blog.id)} className="bg-sky-300/100 rounded-xl p-1 px-3 my-1 hover:bg-sky-300/70 mx-1">Edit</button>
                      <button onClick={() => handleDelete(blog.id)} className="bg-sky-300/100 rounded-xl p-1 px-3 my-1 hover:bg-sky-300/70 mx-1">Delete</button>
                    </div>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
