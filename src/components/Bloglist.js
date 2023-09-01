import React from 'react';

const BlogList = () => {
  const blogs = [
    { id: 1, title: 'Blog 1', content: 'This is the content of Blog 1.' },
    { id: 2, title: 'Blog 2', content: 'This is the content of Blog 2.' },
    { id: 3, title: 'Blog 3', content: 'This is the content of Blog 3.' },
    { id: 4, title: 'Blog 4', content: 'This is the content of Blog 4.' },
    { id: 5, title: 'Blog 5', content: 'This is the content of Blog 5.' },
    { id: 6, title: 'Blog 6', content: 'This is the content of Blog 6.' },
    { id: 7, title: 'Blog 7', content: 'This is the content of Blog 7.' },
    { id: 8, title: 'Blog 8', content: 'This is the content of Blog 8.' },
    { id: 9, title: 'Blog 9', content: 'This is the content of Blog 9.' },
  ];

  return (
    <div className="flex justify-center items-center flex-col">
      <h2>Blog List</h2>
      <ul className='flex flex-wrap justify-center'>
        {blogs.map(blog => (
          <li className='p-6 bg-lime-600 m-2' key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
