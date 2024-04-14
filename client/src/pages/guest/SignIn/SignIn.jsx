import React from 'react';
import SimpleForm from '@components/general/SimpleForm';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '@services/authentication/operations';
import './SignIn.css';

const SignInPage = () => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const submitHandler = (data) => {
        console.log(data);
        dispatch(signIn(data));
    };

    return (
        <SimpleForm
            title={
                <React.Fragment>
                    Connecting with <span className='Highlight-Color'>your</span> <br /> <span className='Highlight-Color'>SmartTrash Cloud</span> account.
                </React.Fragment>
            }
            isLoading={isLoading}
            description='Manage all your devices and generate detailed reports. To connect to the cloud, you must enter the requested credentials.'
            submitHandler={submitHandler}
            inputs={[
                {
                    name: 'email',
                    type: 'email',
                    required: true,
                    placeholder: 'Email address, e.g "johndoe@example.com' 
                },
                { 
                    name: 'password',
                    type: 'password', 
                    minLength: 8,
                    maxLength: 16,
                    required: true,
                    placeholder: 'Enter the password associated with your account'
                }
            ]}
            btnTitle='Connect to the cloud'
        />
    );
};

export default SignInPage;