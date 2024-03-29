import React from 'react';
import { CiWifiOn, CiCloudOn } from 'react-icons/ci';
import Card from '@components/general/Card';
import './Home.css';

const HomePage = () => {
    return (
        <main id='Home-Main'>
            <section id='Home-Header-Container'>
                <h3 id='Home-Header-Title'>What will we do today?</h3>
            </section>
            <section id='Home-Body-Container'>
                <article id='Home-Navigation-Container'>
                    {[
                        ['Connect to the Internet', '/wifi-connection/', CiWifiOn],
                        ['Link device to Cloud Service', '', CiCloudOn]
                    ].map(([ title, to, Icon ], index) => (
                        <Card title={title} Icon={Icon} to={to} key={index} />
                    ))}
                </article>
            </section>
        </main>
    );
};

export default HomePage;