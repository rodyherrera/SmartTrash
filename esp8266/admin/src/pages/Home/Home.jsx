import React from 'react';
import { CiWifiOn, CiCloudOn, CiStreamOn, CiViewList, CiDollar, CiBeerMugFull, CiAlignBottom } from 'react-icons/ci';
import { PiTreeLight } from 'react-icons/pi';
import Card from '@components/general/Card';
import './Home.css';

const HomePage = () => {
    return (
        <main id='Home-Main'>
            <section id='Home-Product-Container'>
                <article id='Home-Product-Left-Container'>
                    <div id='Home-Product-Left-Top-Container'>
                        <h3 id='Home-Product-Left-Title'><span className='Highlight-Color'>The way you</span> control, monitor and manage <span className='Highlight-Color'>your environment</span> in real-time.</h3>
                    </div>
                    
                    <div id='Home-Product-Middle-Container'>
                        {[
                            ['Connect to the Internet', '/wifi/networks/', CiWifiOn],
                            ['Link device to Cloud Service', '/cloud/connect/', CiCloudOn],
                            ['Access Point Configuration ', '/server/ap-config/', CiStreamOn]
                        ].map(([ title, to, Icon ], index) => (
                            <Card title={title} Icon={Icon} to={to} key={index} />
                        ))}
                    </div>

                    <div id='Home-Product-Bottom-Container'>
                        <p id='Home-Product-Description'>Now with <span className='Highlight-Color'>© SmartTrash Historical Analytics</span> explore the behavior and performance of <span className='Highlight-Color'>your recycling points,</span> identify usage patterns and activity peaks.</p>
                    </div>
                </article>
                
                <article id='Home-Product-Right-Container'>
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