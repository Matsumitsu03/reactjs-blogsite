import React, { useEffect, useState, useContext } from 'react';
import { collection, doc, deleteDoc, updateDoc, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { AuthContext } from '../context/AuthProvider';
import Comments from './Comments';
import DropDown from './DropDown';
import AddBlog from './AddBlog';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const blogCollection = collection(firestore, 'blogs');
      const q = query(blogCollection);

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const updatedBlogs = [];

        for (const docRef of querySnapshot.docs) {
          const blog = docRef.data();
          blog.id = docRef.id;

          const userQuery = query(collection(firestore, 'users'), where('email', '==', blog.authorEmail));
          const userQuerySnapshot = await getDocs(userQuery);

          if (!userQuerySnapshot.empty) {
            const userData = userQuerySnapshot.docs[0].data();
            blog.username = userData.username;
          }

          updatedBlogs.push(blog);
        }

        setBlogs(updatedBlogs);
      });

      return unsubscribe;
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
      <h1 className='text-xl font-bold m-5'>Welcome to MatsuThoughts</h1>
      <div>
        <AddBlog />
      </div>
      <ul className='flex flex-col md:w-1/2 w-11/12'>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {editingBlogId === blog.id ? (
              <div className="flex flex-col justify-center bg-blue-300 m-2 p-2 rounded-md">
                <h1 className='self-center font-bold text-lg mb-2'>Edit Mode</h1>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="px-3 py-2 rounded-lg m-1 focus:outline-blue-500 bg-slate-300/50"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="px-3 py-2 rounded-lg mb-2 mx-1 focus:outline-blue-500 bg-slate-300/50"
                />
                <div className="space-x-2 self-center mb-4">
                  <button
                    onClick={() => handleSaveEdit(blog.id)}
                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-1 px-4 rounded-xl focus:outline-none"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBlogId(null)}
                    className="bg-red-500 hover:bg-red-500 text-white font-semibold py-1 px-4 rounded-xl focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
                <div>                  
                  {blog.timestamp && (
                    <p className='text-gray-400'>Posted at {blog.timestamp.toDate().toLocaleString()}</p>
                  )}
                  <Comments blogId={blog.id} user={auth} />
                </div>
              </div>
            ) : ( // View mode
              <>

                <div className='flex flex-col justify-center bg-blue-300 m-2 p-2 rounded-md'>
                  <div className='flex flex-row justify-between'>
                    <p className='text-gray-600'>@{blog.username}</p>
                    {auth && auth.email === blog.authorEmail && (
                      <DropDown
                        handleEdit={() => handleEdit(blog.id)}
                        handleDelete={() => handleDelete(blog.id)}
                      />
                    )}
                  </div>
                  <h2 className='text-xl font-semibold'>{blog.title}</h2>
                  <p className='text-md'>{blog.content}</p>
                  {blog.timestamp && (
                    <p className='text-gray-400 text-sm'>Posted at {blog.timestamp.toDate().toLocaleString()}</p>
                  )}
                  <Comments blogId={blog.id} user={auth} />
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
