import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { logout } from '@services/authentication/operations';
import { useNavigate } from 'react-router-dom';
import { VscLink } from 'react-icons/vsc';
import BrandBallIcon from '@components/general/BrandBallIcon';
import './UserNavigation.css';

const UserNavigation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            setIsVisible(false);
        };
    }, []);

    return (
        <div className='User-Navigation-Container'>
            <div className='User-Navigation-Clickable-Container' onClick={() => setIsVisible(!isVisible)}>
                <span className='User-Navigation-Clickable-Username'>{user.username}</span>
                <i className='User-Navigation-Clickable-Icon'>
                    {isVisible ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </i>
            </div>

            {isVisible && (
                <div className='User-Navigation-Content-Container'>
                    <div className='User-Navigation-Header-Container'>
                        <BrandBallIcon />
                        <div className='User-Navigation-Information-Container'>
                            <h3 className='User-Navigation-Fullname'>{user.fullname}</h3>
                            <p className='User-Navigation-Email'>{user.email}</p>
                        </div>
                    </div>

                    <ul className='User-Navigation-Body-Container'>
                        {[
                            [RxDashboard, 'Dashboard', '/dashboard/'],
                            [VscLink, 'Link new device', '/device/new/']
                        ].map(([ Icon, title, to ], index) => (
                            <li className='User-Navigation-Option-Container' key={index} onClick={() => navigate(to)}>
                                <i className='User-Navigation-Option-Icon'>
                                    <Icon />
                                </i>
                                
                                <div className='User-Navigation-Option-Content'>
                                    <h4 className='User-Navigation-Option-Title'>{title}</h4>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className='User-Navigation-Bottom-Container'>
                        <div className='User-Navigation-Logout-Container' onClick={() => dispatch(logout())}>
                            <h4 className='User-Navigation-Logout-Title'>Log out</h4>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserNavigation;