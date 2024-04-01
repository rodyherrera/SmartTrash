import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@components/general/Breadcrumbs';
import Button from '@components/general/Button';
import Input from '@components/general/Input';
import { useSelector, useDispatch } from 'react-redux';
import { signUp } from '@services/auth/operations';
import './SignUp.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(signUp({ username, password, passwordConfirm, email, fullname }));
    };

    useEffect(() => {
        return () => {
            setUsername('');
            setPassword('');
            setPasswordConfirm('');
            setEmail('');
            setFullname('');
        };
    }, []);

    return (
        <main id='SignUp-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connecting to the SmartTrash Cloud', to: '/cloud/connect/' },
                    { title: 'Creating a new cloud account', to: '/auth/sign-up/' }
                ]}
            />
            <section id='SignUp-Header-Container'>
                <h3 id='SignUp-Header-Title'>Let's start creating your account!</h3>
            </section>
            <form id='SignUp-Body-Container' onSubmit={formSubmitHandler}>
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type='text'
                    placeholder='Enter a username, what would you like us to call you?' />
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    placeholder='Enter an email address where service notifications will be sent.' />
                <Input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    type='text'
                    placeholder='What is your full name? We want to know more about you.' />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    placeholder='Enter a strong password for your account.' />
                <Input
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    type='password'
                    placeholder='Confirm the password previously entered.' />
                <Button
                    isLoading={isLoading}
                    type='submit'
                    title='Create account' />
            </form>
        </main>
    );
};

export default SignUp;