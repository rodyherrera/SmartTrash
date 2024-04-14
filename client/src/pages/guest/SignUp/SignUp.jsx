import React from 'react';
import SimpleForm from '@components/general/SimpleForm';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '@services/authentication/operations';
import './SignUp.css';

const SignUpPage = () => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const submitHandler = (data) => {
        dispatch(signUp(data));
    };

    return (
        <SimpleForm
            title={
                <React.Fragment>
                    Create an account on <br /> <span className='Highlight-Color'>SmartTrash Cloud</span> Service
                </React.Fragment>
            }
            description='A SmartTrash ID is required to access the cloud platform and all related services related to your device(s).'
            submitHandler={submitHandler}
            isLoading={isLoading}
            inputs={[
                {
                    name: 'fullname',
                    required: true,
                    minLength: 8,
                    maxLength: 32,
                    placeholder: 'What is your full name? e.g "John Doe"'
                },
                {
                    name: 'username',
                    required: true,
                    minLength: 8,
                    maxLength: 16,
                    placeholder: 'Enter a username, what do you want us to call you?'
                },
                {
                    name: 'email',
                    required: true,
                    placeholder: 'Enter your email address, e.g "johndoe@example.com"',
                    type: 'email'
                },
                {
                    name: 'password',
                    required: true,
                    minLength: 8,
                    maxLength: 16,
                    placeholder: 'Enter a strong password to protect your account',
                    type: 'password'
                },
                {
                    name: 'passwordConfirm',
                    required: true,
                    minLength: 8,
                    maxLength: 16,
                    placeholder: 'Enter a strong password to protect your account',
                    type: 'password'
                }
            ]}
            btnTitle='Create cloud account'
        />
    );
}

export default SignUpPage;