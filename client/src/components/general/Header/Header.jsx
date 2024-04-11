import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        </header>
    );
};

export default Header;