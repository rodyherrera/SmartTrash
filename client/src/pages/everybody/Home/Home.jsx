import React from 'react';
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
            </section>
        </main>
    );
};

export default HomePage;