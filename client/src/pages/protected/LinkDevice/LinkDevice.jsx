import React, { useRef, useEffect } from 'react';
import Input from '@components/general/Input';
import LinkDeviceImage from '@images/Link-Device.png';
import DeviceWiFiNetworkImage from '@images/Device-WiFi-Network.png';
import AdministratorOptionsImage from '@images/Administrator-Options.png';
import ArticleItem from '@components/general/ArticleItem';
import { IoSendOutline } from 'react-icons/io5';
import { gsap } from 'gsap/all';
import './LinkDevice.css';

const LinkDevice = () => {
    const titleRef = useRef(null);

    useEffect(() => {
        gsap.from(titleRef.current, { 
            duration: 0.5, 
            opacity: 0, 
            y: -30, 
            ease: 'power2.out' 
        });
    }, []);

    return (
        <main id='Link-Device-Main'>
            <section id='Link-Device-Header-Container' ref={titleRef}>
                <article id='Link-Device-Header-Title-Container'>
                    <h3 id='Link-Device-Header-Title'><span className='Highlight-Color'>Linking</span> <span className='Underline'>your device</span> to SmartTrash <span className='Highlight-Color'>Cloud Service</span></h3>
                </article>

                <article id='Link-Device-STUID-Container'>
                    <Input 
                        variant='Highlight'
                        maxLength='16'
                        required='true'
                        placeholder={`Enter your device's unique id, e.g "st/3C41BD213DBF"`}
                        RightIcon={IoSendOutline}
                    />
                </article>
            </section>

            <section id='Link-Device-Body-Container'>
                <ArticleItem
                    title={<span>Don't know how to obtain the <span className='Highlight-Color'>unique identifier</span> of your SmartTrash?</span>}
                    items={[
                        'When you connect your SmartTrash, it will turn on, and consequently if it is the first time you turn it on, it will start flashing with a blue light. This is completely normal, and it only tells us that the device has turned on correctly but it is not connected to the internet.',
                        <React.Fragment>
                            <span>To connect your device to the internet, you must connect to your SmartTrash's WiFi network from your computer or phone, because when it turns on, it will automatically create an access point, which by default will have a name like "SmartTrash-AP" followed by a combination of random characters. The default network password is "toortoor".</span>
                            <div>
                                <img src={DeviceWiFiNetworkImage} height='140px' />
                            </div>
                        </React.Fragment>,
                        <React.Fragment>
                            <span>Once you have connected to the internet, you must open your favorite browser (it can be Google Chrome, Firefox or any other that you have installed) and enter the following address: "http://192.168.1.1".</span>
                            <div>
                                <img src={AdministratorOptionsImage} height='400px' />
                            </div>
                        </React.Fragment>,
                        'After entering the page, the local administrator panel of your SmartTrash will load, where in the list of options you can connect to the internet, change the access point configuration, link your device with the cloud, among others...',
                        'We will only use two options, first you must go to the "Connect to the Internet" option, consequently you will have a list of available connections to connect to, you must select one and then enter the respective password to continue.',
                        <React.Fragment>
                            <span>Are we connected to the internet? If so we can continue, well now you must go to the "Link device with the cloud" option also available on the administrator's home page, once inside, you will have a code highlighted in blue, the which you should copy and paste on this page. Consider that this code is sensitive, and you should not share it under any circumstances with other people. Only you and no one else but you, for that reason you should change the password of your SmartTrash access point if you have not already done so.</span>
                            <div>
                                <img src={LinkDeviceImage} height='250px' />
                            </div>  
                        </React.Fragment>
                    ]}
                />
            </section>
        </main>
    );
};

export default LinkDevice;