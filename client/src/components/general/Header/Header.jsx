import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsHeaderAnimated } from '@services/core/slice';
import { gsap } from 'gsap';
import Button from '@components/general/Button';
import Link from '@components/general/Link';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isHeaderAnimated } = useSelector((state) => state.core);
    const navLeftRef = useRef(null);
    const navRightRef = useRef(null);
    const brandTitleRef = useRef(null);

    useEffect(() => {
        if(isHeaderAnimated) return;
        dispatch(setIsHeaderAnimated(true));
        gsap.from(navLeftRef.current, { 
            x: -100, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        });
    
        gsap.from(navRightRef.current, { 
            x: 100, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        }); 
    
        gsap.from(brandTitleRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1)'
        }); 
    }, [isHeaderAnimated]); 
    

    return (
        <header className='Header-Container'>
            <section className='Header-Brand-Related-Container' ref={brandTitleRef}>
                <article className='Header-Brand-Container' onClick={() => navigate('/')}>
                    <h3 className='Header-Brand-Title'>ST</h3>
                </article>
            </section>

            <ul className='Header-Brand-Center-Navigation-Container' ref={navLeftRef}>
                {[
                    ['Privacy Policy', '/'],
                    ['Documentation', '/'],
                    ['Developer Resources', '/'],
                    ['Building your SmartTrash', '/']
                ].map(([ title, link ], index) => (
                    <Link link={link} title={title} key={index} />
                ))}
            </ul>

            <ul className='Header-Brand-Right-Navigation-Container' ref={navRightRef}>
                <Button to='/auth/sign-in/' variant='Outline'>Sign In</Button>
                <Button variant='Contained Big'>Try Free</Button>
            </ul>
        </header>
    );
};

export default Header;