import React, { useEffect, useRef } from 'react';
import { CiViewList, CiDollar, CiBeerMugFull, CiAlignBottom } from 'react-icons/ci';
import { PiTreeLight } from 'react-icons/pi';
import { gsap } from 'gsap'; 
import IconCard from '@components/general/IconCard';
import './Home.css';

const HomePage = () => {
    const brandLeftRef = useRef(null);
    const brandRightRef = useRef(null);
    const iconCardRefs = useRef([]);

    useEffect(() => {
        // Brand Left Entrance
        gsap.from(brandLeftRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: 'back.out(1.2)' 
        });  
    
        // Brand Right Entrance (Slight Variation)            
        gsap.from(brandRightRef.current, {
            opacity: 0,
            // Slide in from the left
            x: -50, 
            duration: 1,
            // Slight delay after brandLeft
            delay: 0.3,  
            ease: 'power3.out'
        });
    
        iconCardRefs.current.forEach((ref, index) => {
            gsap.from(ref, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                delay: index * 0.15, 
                ease: 'power2.out'
            }); 
        });
    }, []);

    return (
        <main id='Home-Main'>
            <section id='Home-Brand-Container'>
                <article id='Home-Brand-Left-Container' ref={brandLeftRef}>
                    <h3 id='Home-Brand-Left-Title'>The <span className='Highlight-Color'>next-generation</span> solution for <span className='Highlight-Color'>your</span> recycling points <span className='Highlight-Color'>and garbage containers.</span></h3>
                    <p id='Home-Brand-Left-Description'>
                        <span className='Highlight-Color'>You don't need to reinvent the wheel.</span>
                        <span>We use cutting-edge technologies to improve the way you manage your waste through real-time monitoring and data analysis.</span>
                    </p>
                </article>
                <article id='Home-Brand-Right-Container' ref={brandRightRef}>
                    <div id='Home-Brand-Features-Header-Container'>
                        <h3 id='Home-Brand-Features-Header-Title'>Let's work <span className='Highlight-Color'>together</span>, <br /> <span className='Overline'>and</span> let's enhance <span className='Highlight-Color Underline'>your value.</span></h3>
                        <p id='Home-Brand-Features-Header-Description'>We transform the way you manage your recycling points and trash containers. You gained full control in real time, optimizing waste management and reducing costs. Additionally, our eco-friendly solution drives a positive environmental impact by promoting sustainable practices.</p>
                    </div>
                    <div id='Home-Brand-Features-Body-Container'>
                        {[
                            ['Data that transforms', 'Obtain key information to make strategic decisions and continually improve.', CiViewList],
                            ['Costs reduction', 'Reduce operating costs by scheduling pickups based on actual container capacity.', CiDollar],
                            ['Efficient resource management', 'Use accurate data to allocate resources smarter and more effectively.', CiAlignBottom],
                            ['Minimization of downtime', 'Avoid overflows and emergency situations by anticipating the need to empty containers.', CiBeerMugFull],
                            ['Better company image', 'By adopting more efficient and sustainable waste management practices.', PiTreeLight]
                        ].map(([ title, description, Icon ], index) => (
                            <IconCard 
                                key={index} 
                                title={title} 
                                ref={(el) => iconCardRefs.current[index] = el}
                                description={description} 
                                Icon={Icon} />
                        ))}
                    </div>
                </article>
            </section>
        </main>
    );
};

export default HomePage;