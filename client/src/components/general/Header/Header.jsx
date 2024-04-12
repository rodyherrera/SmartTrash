import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/general/Button';
import Link from '@components/general/Link';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className='Header-Container'>
            <section className='Header-Brand-Related-Container'>
                <article className='Header-Brand-Container' onClick={() => navigate('/')}>
                    <h3 className='Header-Brand-Title'>ST</h3>
                </article>
            </section>

            <ul className='Header-Brand-Center-Navigation-Container'>
                {[
                    ['Privacy Policy', '/'],
                    ['Documentation', '/'],
                    ['Developer Resources', '/'],
                    ['Building your SmartTrash', '/']
                ].map(([ title, link ], index) => (
                    <Link linnk={link} title={title} key={index} />
                ))}
            </ul>

            <ul className='Header-Brand-Right-Navigation-Container'>
                <Button variant='Outline'>Sign In</Button>
                <Button variant='Contained Big'>Try Free</Button>
            </ul>
        </header>
    );
};

export default Header;