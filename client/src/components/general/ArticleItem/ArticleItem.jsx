import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap/all';
import './ArticleItem.css';

const ArticleItem = ({ title, items }) => {
    const headerRef = useRef(null);
    const listItemsRefs = useRef([]);

    useEffect(() => {
        gsap.from(headerRef.current, { 
            duration: 1, 
            opacity: 0, 
            y: -20, 
            ease: 'power2.out' 
        });

        listItemsRefs.current.forEach((ref, index) => {
            gsap.from(ref, { 
              duration: 1, 
              opacity: 0,
              x: -30,
              ease: 'power2.out',
              delay: index * 0.2  
            });
        });
    }, []);

    return (
        <div className='Article-Item-Container'>
            <div className='Article-Item-Header-Container' ref={headerRef}>
                <h3 className='Article-Item-Header-Title'>{title}</h3>
            </div>

            <ul className='Article-Item-List-Container'>
                {items.map((item, index) => (
                    <li 
                        ref={el => listItemsRefs.current[index] = el} 
                        className='Article-SubItem-Container' 
                        key={index}
                    >
                       {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticleItem