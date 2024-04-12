import React from 'react';
import { CiViewList, CiDollar, CiBeerMugFull, CiAlignBottom } from 'react-icons/ci';
import { PiTreeLight } from 'react-icons/pi';
import './Home.css';

const HomePage = () => {

    return (
        <main id='Home-Main'>
            <section id='Home-Brand-Container'>
                <article id='Home-Brand-Left-Container'>
                    <h3 id='Home-Brand-Left-Title'>The <span className='Highlight-Color'>next-generation</span> solution for <span className='Highlight-Color'>your</span> recycling points <span className='Highlight-Color'>and garbage containers.</span></h3>
                    <p id='Home-Brand-Left-Description'>
                        <span className='Highlight-Color'>You don't need to reinvent the wheel.</span>
                        <span>We use cutting-edge technologies to improve the way you manage your waste through real-time monitoring and data analysis.</span>
                    </p>
                </article>
                <article id='Home-Brand-Right-Container'>
                    <div className='Rounded-Container'>
                        <div className='Rounded-Header-Container'>
                            <h3 className='Rounded-Header-Title'>Let's work <span className='Highlight-Color'>together</span>, <br /> <span className='Overline'>and</span> let's enhance <span className='Highlight-Color Underline'>your value.</span></h3>
                            <p className='Rounded-Header-Description'>We transform the way you manage your recycling points and trash containers. You gained full control in real time, optimizing waste management and reducing costs. Additionally, our eco-friendly solution drives a positive environmental impact by promoting sustainable practices.</p>
                        </div>
                        <div className='Rounded-Body-Container'>
                            {[
                                ['Data that transforms', 'Obtain key information to make strategic decisions and continually improve.', CiViewList],
                                ['Costs reduction', 'Reduce operating costs by scheduling pickups based on actual container capacity.', CiDollar],
                                ['Efficient resource management', 'Use accurate data to allocate resources smarter and more effectively.', CiAlignBottom],
                                ['Minimization of downtime', 'Avoid overflows and emergency situations by anticipating the need to empty containers.', CiBeerMugFull],
                                ['Better company image', 'By adopting more efficient and sustainable waste management practices.', PiTreeLight]
                            ].map(([ title, description, Icon ], index) => (
                                <div className='Benefit-Container' key={index}>
                                    <div className='Benefit-Icon-Container'>
                                        <Icon />
                                    </div>
                                    <div className='Benefit-Content-Container'>
                                        <h3 className='Benefit-Title'>{title}</h3>
                                        <p className='Benefit-Description'>{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
};

export default HomePage;