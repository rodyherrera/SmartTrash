import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@components/general/Breadcrumbs';
import Input from '@components/general/Input';
import Button from '@components/general/Button';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        return () => {
            setEmail('');
            setPassword('');
        };
    }, []);

    return (
        <main id='SignIn-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connecting to the SmartTrash Cloud', to: '/cloud/connect/' },
                    { title: 'Authenticating in the cloud', to: '/auth/sign-in/' }
                ]}
            />
            <section id='SignIn-Page-Header-Container'>
                <h3 id='SignIn-Page-Header-Title'>Let's start logging into your account</h3>
            </section>
            <form id='SignIn-Page-Body-Container'>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    placeholder='Enter your email address i.e "john@example.com"' />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    placeholder='Enter the password of your account' />
                <Button
                    type='submit'
                    title='Connect to the Cloud' />
            </form>
        </main>
    );
};

export default SignIn;