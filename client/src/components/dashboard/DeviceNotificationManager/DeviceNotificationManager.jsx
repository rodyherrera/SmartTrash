import React, { useEffect, useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { IoIosAdd } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { updateMyDevice } from '@services/device/operations';
import { gsap } from 'gsap';
import Avatar from '@components/general/Avatar';
import Input from '@components/general/Input';
import './DeviceNotificationManager.css';

const DeviceNotificationManager = ({ id, notificationEmails }) => {
    const [newNotificationEmails, setNewNotificationsEmails] = useState(JSON.parse(JSON.stringify(notificationEmails)));
    const dispatch = useDispatch();

    useEffect(() => {
        gsap.fromTo('.Device-Notification-Manager-Address-Container', {
            opacity: 0,
            y: 5
        }, { 
            duration: 0.5, 
            opacity: 1, 
            y: 0, 
            stagger: 0.1 
        });
    }, []);

    // verify changes, and update the device notification emails, 
    // this is updating when mount too, but it's not a problem
    useEffect(() => {
        const timeout = setTimeout(() => {
            const notEmptyFields = [];
            newNotificationEmails.forEach(({ fullname, email }) => {
                if(fullname && email) notEmptyFields.push({ fullname, email });
            });
            dispatch(updateMyDevice(id, { notificationEmails: notEmptyFields }));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [newNotificationEmails]);

    const onRemoveAddress = (index) => {
        gsap.to(`.Device-Notification-Entry-${index}`, { duration: 0.5, opacity: 0, x: 50, onComplete: () => {
            const newNotificationEmailsCopy = [...newNotificationEmails];
            newNotificationEmailsCopy.splice(index, 1);
            setNewNotificationsEmails(newNotificationEmailsCopy);
        }});
    };

    const onFullNameChange = (index, value) => {
        const newNotificationEmailsCopy = [...newNotificationEmails];
        newNotificationEmailsCopy[index].fullname = value;
        setNewNotificationsEmails(newNotificationEmailsCopy);
    };

    const onEmailChange = (index, value) => {
        const newNotificationEmailsCopy = [...newNotificationEmails];
        newNotificationEmailsCopy[index].email = value;
        setNewNotificationsEmails(newNotificationEmailsCopy);
    };

    return (
        <div className='Device-Notification-Manager-Container'>
            <div className='Device-Notification-Manager-Header-Container'>
                <h3 className='Device-Notification-Manager-Header-Title'>Manage Notifications</h3>
                <div className='Device-Notification-Manager-Icon-Container'>
                    <i className='Device-Notification-Manager-Icon'>
                        <CiMail />
                    </i>
                    <span className='Device-Notification-Manager-Icon-Length'>{newNotificationEmails.length}</span>
                </div>
            </div>

            <div className='Device-Notification-Manager-Body-Container'>
                {newNotificationEmails.map(({ fullname, email }, index) => (
                    <div className={`Device-Notification-Manager-Address-Container Optimized-For-Animation Device-Notification-Entry-${index}`}>
                        <Avatar title={fullname || 'J'} />
                        <div className='Device-Notification-Manager-Address-Data-Container'>
                            <Input
                                onChange={(e) => onFullNameChange(index, e.target.value)} 
                                value={fullname}
                                placeholder='John Doe' 
                                variant='Small No-Focus Text' />
                            <Input 
                                onChange={(e) => onEmailChange(index, e.target.value)}
                                placeholder='hello@example.com' 
                                value={email}
                                variant='Small No-Focus Text' />
                        </div>

                        <div className='Device-Notification-Manager-Remove-Container' onClick={() => onRemoveAddress(index)}>
                            <span className='Device-Notification-Manager-Remove-Text'>Remove</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='Device-Notification-Manager-Add-Icons-Container'>
                <React.Fragment>
                    <i className='Device-Notification-Manager-Add-Icon-Container' onClick={() => setNewNotificationsEmails([...newNotificationEmails, { }]) }>
                        <IoIosAdd />
                    </i>
                </React.Fragment>
            </div>
        </div>
    );
};

export default DeviceNotificationManager;