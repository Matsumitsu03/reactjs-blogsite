import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    onSnapshot, // Import onSnapshot for real-time updates
} from 'firebase/firestore';
import { firestore } from '../firebase';

function Comments({ blogId, user }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch comments for the current blog post
        const fetchComments = async () => {
            const commentsCollection = collection(firestore, 'comments');
            const commentsQuery = query(commentsCollection, where('blogId', '==', blogId));
            const commentsSnapshot = await getDocs(commentsQuery);
            const commentsData = commentsSnapshot.docs.map((commentDoc) => commentDoc.data());
            setComments(commentsData);
        };

        fetchComments();

        const fetchUsername = async () => {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                setUsername(userDocSnapshot.data().username);
            }
        };

        if (user && user.uid) {
            fetchUsername();
        }

        const commentsCollection = collection(firestore, 'comments');
        const commentsQuery = query(commentsCollection, where('blogId', '==', blogId));
        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const updatedComments = snapshot.docs.map((commentDoc) => commentDoc.data());
            setComments(updatedComments);
        });

        return () => {
            unsubscribe();
        };
    }, [blogId, user]);

    const handleAddComment = async () => {
        if (comment.trim() === '') {
            return;
        }

        try {
            const commentData = {
                blogId,
                userId: user.uid,
                username, 
                content: comment,
                timestamp: serverTimestamp(),
            };

            await addDoc(collection(firestore, 'comments'), commentData);
            setComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    return (
        <div>
            <div className='relative flex flex-row w-full m-1 mt-4'>
                <input
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full px-3 py-1 border rounded-l-xl'
                />
                <button onClick={handleAddComment} className='px-3 py-2 border border-l-0 rounded-r-xl bg-blue-300 hover:bg-blue-500 transition duration-300 mr-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M23 0l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-8.698 6.825l-1.439-.507 5.701-5.215 1.436.396-5.698 5.326zm3.262 4.287l-1.323-.565 4.439-4.503 1.32.455-4.436 4.613zm-4.083.387l-1.481-.507 8-7.89 1.437.397-7.956 8z"/>
                    </svg>
                </button>
            </div>

            <div className='bg-blue-200 rounded-xl p-3'>
                <h3>Comments:</h3>
                <ul className='flex flex-col'>
                    {comments.map((commentData) => (
                        <li key={commentData.timestamp?.toDate()?.getTime()} className=' bg-blue-300 p-1 mb-[2px] rounded-md '>
                            <div className='flex sm:flex-row flex-col'>
                                <h1 className='mr-2 text-md font-semibold'>@{commentData.username}:</h1>
                                <p className='break-all'>{commentData.content}</p>
                            </div>
                            <div className='grid'>
                                <p className='place-self-end mt-1 mr-1 text-gray-600 opacity-80 text-sm'>{commentData.timestamp ? commentData.timestamp.toDate().toLocaleString() : 'N/A'}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Comments;
