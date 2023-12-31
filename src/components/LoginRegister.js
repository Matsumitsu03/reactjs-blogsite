import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, } from 'firebase/auth';
import { collection, setDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Link } from "react-router-dom";
import '../App.css';

const firebaseAuth = getAuth();

const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@(.+)$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const LoginRegister = () => {
    const usernameRef = useRef();
    const emailRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [loginUsername, setLoginUsername] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPwd, setLoginPwd] = useState('');

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd]);

    const checkUsernameAvailability = async (username) => {
        try {
            const userQuery = query(collection(firestore, 'users'), where('username', '==', username));
            const userQuerySnapshot = await getDocs(userQuery);

            return userQuerySnapshot.empty;
        } catch (err) {
            console.error('Error checking username availability:', err);
            throw err;
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
          setErrMsg("Invalid Input");
          return;
        }
    
        const isUsernameAvailable = await checkUsernameAvailability(username);
    
        if (!isUsernameAvailable) {
          setErrMsg("Username is Taken");
          return;
        }
      
        try {
          const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pwd);
      
          const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      
          await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            username,
            email,
          });
      
          setSuccess(true);
          setEmail('');
          setPwd('');
          setMatchPwd('');
          setUsername('');
        } catch (err) {
          const errorCode = err.code;
          if (errorCode === 'auth/email-already-in-use') {
            setErrMsg('Email Taken');
          } else {
            setErrMsg('Registration Failed');
          }
          errRef.current.focus(null);
        }
      };
      

    const signInWithUsernameAndPassword = async (username, password) => {
        try {
            const userQuery = query(collection(firestore, 'users'), where('username', '==', username));
            const userQuerySnapshot = await getDocs(userQuery);

            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userData = userDoc.data();

                return await signInWithEmailAndPassword(firebaseAuth, userData.email, password);
            } else {
                throw new Error('User not found.');
            }
        } catch (err) {
            console.error('Error during signInWithUsernameAndPassword:', err);
            throw err;
        }
    };


    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const isEmail = EMAIL_REGEX.test(loginEmail);
            const signInCredential = isEmail
                ? await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPwd)
                : await signInWithUsernameAndPassword(loginUsername, loginPwd);

            if (signInCredential && signInCredential.user) {
                setSuccess(true);
            } else {
                setErrMsg('Login failed. Please check your credentials.');
                errRef.current.focus();
            }
        } catch (err) {
            console.error('Error during login:', err);
            setErrMsg('Login failed. Please check your credentials.');
            errRef.current.focus();
        }
    };

    return (
        <>
            <div className="bgbubbles">
                <div className="bubbles">
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 14 }}></span>
                    <span style={{ "--i": 16 }}></span>
                    <span style={{ "--i": 11 }}></span>
                    <span style={{ "--i": 18 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 11 }}></span>
                    <span style={{ "--i": 15 }}></span>
                    <span style={{ "--i": 13 }}></span>
                    <span style={{ "--i": 4 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 14 }}></span>
                    <span style={{ "--i": 16 }}></span>
                    <span style={{ "--i": 9 }}></span>
                    <span style={{ "--i": 18 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 8 }}></span>
                    <span style={{ "--i": 15 }}></span>
                    <span style={{ "--i": 13 }}></span>
                    <span style={{ "--i": 19 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 14 }}></span>
                    <span style={{ "--i": 16 }}></span>
                    <span style={{ "--i": 15 }}></span>
                    <span style={{ "--i": 18 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 11 }}></span>
                    <span style={{ "--i": 15 }}></span>
                    <span style={{ "--i": 13 }}></span>
                    <span style={{ "--i": 19 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 14 }}></span>
                    <span style={{ "--i": 16 }}></span>
                    <span style={{ "--i": 11 }}></span>
                    <span style={{ "--i": 18 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 11 }}></span>
                    <span style={{ "--i": 15 }}></span>
                    <span style={{ "--i": 13 }}></span>
                    <span style={{ "--i": 19 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 14 }}></span>
                    <span style={{ "--i": 16 }}></span>
                    <span style={{ "--i": 11 }}></span>
                    <span style={{ "--i": 18 }}></span>
                    <span style={{ "--i": 21 }}></span>
                    <span style={{ "--i": 12 }}></span>
                    <span style={{ "--i": 15 }}></span>
                    <span style={{ "--i": 13 }}></span>
                    <span style={{ "--i": 19 }}></span>
                </div>

                <div className="flex bg-gray-800 h-screen items-center justify-center w-auto">
                    {success ? (
                        <section>
                            <h1>{success === 'login' ? "You are logged in!" : "Success!"}</h1>
                            <br />
                            {success === 'login' ? (
                                <p>
                                    Go to the <Link to="/">Main Page</Link>
                                </p>
                            ) : (
                                <p>
                                    You are now registered. <Link to="/">Sign In</Link>
                                </p>
                            )}
                        </section>
                    ) : (
                        <section className="flex flex-col container w-80 bg-blue-900 p-5 rounded-xl shadow-md z-10">
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <div className="self-center text-teal-200 text-xl m-1 font-semibold text-border ">Login</div>
                            <form onSubmit={handleLoginSubmit} className="flex flex-col items-center">
                                <div className="flex flex-row items-center w-full my-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="m-1 fill-teal-400">
                                        <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                                    </svg>
                                    <input
                                        className="border-2 rounded-md p-1 w-full"
                                        type={EMAIL_REGEX.test(loginEmail) ? "email" : "text"}
                                        id={EMAIL_REGEX.test(loginEmail) ? "email" : "username"}
                                        ref={EMAIL_REGEX.test(loginEmail) ? emailRef : usernameRef}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            if (EMAIL_REGEX.test(e.target.value)) {
                                                setLoginEmail(e.target.value);
                                            } else {
                                                setLoginUsername(e.target.value);
                                            }
                                        }}
                                        value={EMAIL_REGEX.test(loginEmail) ? loginEmail : loginUsername}
                                        required
                                        placeholder="Email or Username"
                                    />
                                </div>
                                <div className="flex flex-row items-center w-full my-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="m-1 fill-teal-400">
                                        <path d="M10 17c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm3 0c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm3 0c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm2-7v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10-4c0-2.206 1.795-4 4-4s4 1.794 4 4v4h-8v-4zm11 16h-14v-10h14v10z" />
                                    </svg>
                                    <input
                                        type="password"
                                        id="password"
                                        className="border-2 rounded-md p-1 w-full"
                                        onChange={(e) => setLoginPwd(e.target.value)}
                                        value={loginPwd}
                                        required
                                        placeholder="Password"
                                    />
                                </div>
                                <button className="bg-sky-300/100 rounded-xl p-1 px-3 my-1 hover:bg-sky-300/70">Sign In</button>
                            </form>
                            {/* Divider */}
                            <div className="self-center m-1 rounded-lg border-2 h-2 w-full border-emerald-800" />
                            {/* Divider */}
                            <div className="self-center text-teal-200 text-xl m-1 text-border font-semibold">Register</div>
                            <form onSubmit={handleRegisterSubmit} className="flex flex-col items-center">
                                <div className="flex flex-row items-center w-full my-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="m-1 fill-teal-400">
                                        <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                                    </svg>
                                    <input
                                        className="border-2 rounded-md p-1 w-full"
                                        type="text"
                                        id="username"
                                        ref={usernameRef}
                                        autoComplete="off"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        required
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="flex flex-row items-center w-full my-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="m-1 fill-teal-400">
                                        <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                                    </svg>
                                    <input
                                        className="border-2 rounded-md p-1 w-full"
                                        type="email"
                                        id="email"
                                        ref={emailRef}
                                        autoComplete="off"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                        aria-invalid={validEmail ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        placeholder="Email"
                                    />
                                    <FontAwesomeIcon
                                        icon={validEmail ? faCheck : (email ? faTimes : null)}
                                        className={`ml-1 ${validEmail ? 'text-green-500' : 'text-red-500'} w-4 h-4`}
                                    />
                                </div>

                                <div className="flex flex-row items-center w-full my-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="m-1 fill-teal-400">
                                        <path d="M10 17c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm3 0c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm3 0c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm2-7v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10-4c0-2.206 1.795-4 4-4s4 1.794 4 4v4h-8v-4zm11 16h-14v-10h14v10z" />
                                    </svg>
                                    <input
                                        className="border-2 rounded-md p-1 w-full"
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        placeholder="Password"
                                    />
                                    <FontAwesomeIcon
                                        icon={validPwd ? faCheck : (pwd ? faTimes : null)}
                                        className={`ml-1 ${validPwd ? 'text-green-500' : 'text-red-500'} w-4 h-4`} />
                                </div>

                                {pwdFocus && !validPwd && (
                                    <div className="absolute z-10 bg-white shadow-md p-2 rounded-md mt-1 text-[11px]">
                                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-red-500" />
                                        Password should be 8 to 24 characters and include uppercase, lowercase, and a number.
                                    </div>
                                )}

                                <div className="flex flex-row items-center w-full my-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="m-1 fill-teal-400">
                                        <path d="M10 17c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm3 0c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm3 0c0 .552-.447 1-1 1s-1-.448-1-1 .447-1 1-1 1 .448 1 1zm2-7v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10-4c0-2.206 1.795-4 4-4s4 1.794 4 4v4h-8v-4zm11 16h-14v-10h14v10z" />
                                    </svg>
                                    <input
                                        className="border-2 rounded-md p-1 w-full"
                                        type="password"
                                        id="confirm_pwd"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="confirmnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                        placeholder="Confirm Password"
                                    />
                                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "text-green-500 ml-1" : "hidden"} />
                                    <FontAwesomeIcon icon={faTimes} className={!validMatch && matchPwd ? "text-red-500 ml-1" : "hidden"} />
                                </div>

                                {matchFocus && !validMatch && (
                                    <div className="absolute z-10 bg-white shadow-md p-2 rounded-md mt-14 text-[11px]">
                                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-red-500" />
                                        Passwords do not match.
                                    </div>
                                )}
                                <button disabled={!validEmail || !validPwd || !validMatch ? true : false}
                                    className="bg-sky-300/100 rounded-xl p-1 px-3 my-1 hover:bg-sky-300/70">
                                    Sign Up
                                </button>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </>
    )
}

export default LoginRegister