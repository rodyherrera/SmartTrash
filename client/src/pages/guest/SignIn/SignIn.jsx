import React from 'react';
import Input from '@components/general/Input';
import Button from '@components/general/Button';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import './SignIn.css';

const SignInPage = () => {
    return (
        <main className='Simple-Form-Container'>
            <section className='Simple-Form-Left-Container'>
                <article className='Simple-Form-Title-Container'>
                    <h3 className='Simple-Form-Title'>Connecting with <span className='Highlight-Color'>your</span> <br /> <span className='Highlight-Color'>SmartTrash Cloud</span> account.</h3>
                    <p className='Simple-Form-Description'>Manage all your devices and generate detailed reports. To connect to the cloud, you must enter the requested credentials.</p>
                </article>
            </section>
            <form className='Simple-Form-Right-Container'>
                <Input
                    placeholder='Email address, e.g "johndoe@example.com"' />
                <Input
                    type='password'
                    placeholder='Enter the password associated with your account' />
                <article className='Simple-Form-Bottom-Container'>
                    <Button IconRight={HiOutlineArrowNarrowRight} variant='Form-Contained'>Connect to the cloud</Button>
                </article>
            </form>
        </main>
    );
};

export default SignInPage;