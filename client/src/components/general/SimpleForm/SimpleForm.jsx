import React, { useEffect, useRef } from 'react';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { gsap } from 'gsap';
import Input from '@components/general/Input';
import Button from '@components/general/Button';
import './SimpleForm.css';

const SimpleForm = ({ title, description, inputs, btnTitle }) => {
    const formRef = useRef(null);
    const inputRefs = useRef([]);
    const formTitleRef = useRef(null);
    const formDescriptionRef = useRef(null)

    useEffect(() => {
        gsap.from(formRef.current, { 
            duration: 1, 
            opacity: 0, 
            ease: "power2.out" 
        });
    
        gsap.from(inputRefs.current, { 
            duration: 0.8, 
            // Slide in from the left
            x: -50,
            opacity: 0, 
            // Delay between each input animation
            stagger: 0.15, 
            // A slightly bouncy ease
            ease: 'back.out(1.2)'
        });

        gsap.from(formTitleRef.current, {
            duration: 0.5,
            y: -20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power1.out'
        });

        gsap.from(formDescriptionRef.current, {
            y: 20,
            opacity: 0,
            duration: 1,
        });
    }, []); 

    return (
        <main className='Simple-Form-Container'>
            <section className='Simple-Form-Left-Container'>
                <article className='Simple-Form-Title-Container'>
                    <h3 className='Simple-Form-Title' ref={formTitleRef}>{title}</h3>
                    <p className='Simple-Form-Description' ref={formDescriptionRef}>{description}</p>
                </article>
            </section>

            <form className='Simple-Form-Right-Container' ref={formRef}>
                {inputs.map((inputProps, index) => (
                    <Input {...inputProps} key={index} ref={(el) => inputRefs.current[index] = el} />
                ))}

                <article className='Simple-Form-Bottom-Container'>
                    <Button IconRight={HiOutlineArrowNarrowRight} variant='Form-Contained'>{btnTitle}</Button>
                </article>
            </form>
        </main>
    );
};

export default SimpleForm;