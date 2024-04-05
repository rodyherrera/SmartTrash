import React from 'react';
import Breadcrumbs from '@components/general/Breadcrumbs';
import Card from '@components/general/Card';
import { CiLogin } from 'react-icons/ci';
import { PiUserLight, PiUserPlusLight } from 'react-icons/pi';
import './LinkingDevice.css';

const LinkingDevice = () => {
    return (
        <main id='Linking-Device-Main'>
            <Breadcrumbs
                items={[
                    { title: 'Home', to: '/' },
                    { title: 'Connecting to the SmartTrash Cloud' }
                ]}
            />
            <section id='Linking-Device-Header'>
                <h3 id='Linking-Device-Title'>Connecting to the SmartTrash Cloud Service</h3>
            </section>
            <section id='Linking-Device-Body'>
                <article id='Linking-Device-Navigation-Container'>
                    {[
                        ["Already you have an account? Let's Log in", '/auth/sign-in/', CiLogin],
                        ['Create a new SmartTrash cloud account', '/auth/sign-up/', PiUserPlusLight]
                    ].map(([ title, to, Icon ], index) => (
                        <Card title={title} Icon={Icon} to={to} key={index} />
                    ))}
                </article>    
            </section> 
        </main>
    );
};

export default LinkingDevice;