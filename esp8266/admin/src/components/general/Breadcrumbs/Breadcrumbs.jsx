import React, { useEffect } from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './Breadcrumbs.css';

const Breadcrumbs = ({ items, ...props }) => {
    const navigate = useNavigate();

    useEffect(() => {
        gsap.from('.Breadcrumbs-Container li', { 
            duration: 0.4, 
            opacity: 0, 
            // Slide in slightly from the left
            x: -15,
            stagger: 0.08,
            // Add a little bounce
            ease: 'back.out(1.2)'
        });
    }, []);

    return (
        <div className='Breadcrumbs-Container' {...props}>
            <MUIBreadcrumbs separator='›'>
                {items.map((item, index) => (
                    <Link 
                        key={index} 
                        underline='hover' 
                        onClick={() => navigate(item.to)}
                    >{item.title}</Link>
                ))}
            </MUIBreadcrumbs>
        </div>
    );
};

export default Breadcrumbs;