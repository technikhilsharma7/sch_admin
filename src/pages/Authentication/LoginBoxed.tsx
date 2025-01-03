import { Link, useNavigate } from 'react-router-dom';
import React, { FormEvent,useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
// import {loginRequest} from '../../backend/apis/login';

import { setPageTitle } from '../../store/themeConfigSlice';

const LoginBoxed = () => {
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login'));
    });
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const username = e.currentTarget.username.value;
        const password = e.currentTarget.password.value;
        console.log(username);
        console.log(password);
        
    // const response = await loginRequest(brandAndBread, page, search, showEmptyFields, selectedLangArray);


    }

    
    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel sm:w-[480px] m-6 max-w-lg w-full">

                <h2 className="font-bold text-2xl mb-3">Sign In</h2>
                <p className="mb-7">Enter your email and password to login</p>
                <form className="space-y-5" onSubmit={submitForm}>
                    <div>
                        <label htmlFor="User">Username</label>
                        <input id="User" type="text" name='username' className="form-input" placeholder="Enter User" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name='password' className="form-input" placeholder="Enter Password" />
                    </div>
                    <div>
                        <label className="cursor-pointer">
                            <input type="checkbox" className="form-checkbox" />
                            <span className="text-white-dark">Subscribe to weekly newsletter</span>
                        </label>
                    </div>
                    
                    <button  type="submit" className="btn btn-primary w-full">
                        SIGN IN
                    </button>
                </form>
                
                <p className="text-center mt-3">
                    Dont&apos;t have an account ?
                    <Link to="/auth/boxed-signup" className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginBoxed;
