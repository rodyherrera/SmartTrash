import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { gsap, ScrollTrigger } from 'gsap/all';
import Input from '@components/general/Input';
import Button from '@components/general/Button';
import './SimpleForm.css';

gsap.registerPlugin(ScrollTrigger);

const SimpleForm = ({ isLoading, title, description, inputs, btnTitle, submitHandler }) => {
    const formRef = useRef(null);
    const inputRefs = useRef([]);
    const formTitleRef = useRef(null);
    const formDescriptionRef = useRef(null);

    const [formValues, setFormValues] = useState(
        inputs.map((input) => ({
            [input.name]: input?.value || ''
        })).reduce((acc, cur) => ({ ...acc, ...cur }), {})
    );

    const formSubmitHandler = (e) => {
        e.preventDefault();
        submitHandler(formValues);
    };

    useEffect(() => {
        gsap.from(formRef.current, { 
            duration: 1, 
            opacity: 0, 
            ease: 'power2.out',
            scrollTrigger: {
                trigger: formRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    
        gsap.from(inputRefs.current, { 
            duration: 0.8, 
            // Slide in from the left
            x: -50,
            opacity: 0, 
            // Delay between each input animation
            stagger: 0.15, 
            // A slightly bouncy ease
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: formRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.from(formTitleRef.current, {
            duration: 0.5,
            y: -20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power1.out',
            scrollTrigger: {
                trigger: formTitleRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.from(formDescriptionRef.current, {
            y: 20,
            opacity: 0,
            duration: 1,
        });

        return () => {
            setFormValues({});
        };
    }, []); 

    return (
        <main className='Simple-Form-Container'>
            <section className='Simple-Form-Left-Container'>
                <article className='Simple-Form-Title-Container'>
                    <h3 className='Simple-Form-Title' ref={formTitleRef}>{title}</h3>
                    <p className='Simple-Form-Description' ref={formDescriptionRef}>{description}</p>
                </article>
            </section>

            <form className='Simple-Form-Right-Container' ref={formRef} onSubmit={formSubmitHandler}>
                {inputs.map((inputProps, index) => (
                    <Input 
                        {...inputProps} 
                        onChange={(e) => {
                            const { value } = e.target;
                            setFormValues({ ...formValues, [inputProps.name]: value });
                        }}
                        value={formValues[inputProps.name]}
                        key={index} 
                        ref={(el) => inputRefs.current[index] = el} />
                ))}

                <article className='Simple-Form-Bottom-Container'>
                    <Button 
                        IconRight={HiOutlineArrowNarrowRight} 
                        isLoading={isLoading}
                        variant='Form-Contained'
                    >{btnTitle}</Button>
                </article>
            </form>
        </main>
    );
};

export default SimpleForm;