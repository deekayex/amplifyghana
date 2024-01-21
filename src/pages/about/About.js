import React from 'react'
import './About.css'
import BoxContainer from '../../components/BoxText'
import Socials from '../../components/socials/Socials'


const About = () => {
  return (
    <section className='about_us_page' id='about'>
        
        <div className='about_top'>
            <div className='top_header'>
                about amplify ghana
            </div>
            <div className='top_box'>
                AMPLIFY GHANA IS AN ONLINE CREATIVE’S 
                PROMOTION AND PUBLIC RELATIONS AGENCY 
                FOUNDED IN 2020. OUR PRIMARY MISSION IS 
                TO ELEVATE CREATIVES THROUGHOUT AFRICA, 
                WITH A SPECIAL FOCUS ON GHANA, AS THAT 
                IS WHERE WE ARE HEADQUARTERED.
            </div>
        </div>
        <div className='about_body'>
            <div className='body_header'>
                services we offer
            </div>
            <div className='body_box'>
                <BoxContainer/>
                </div>

                <div className='about_socials'>
                    <div className='about-socials-header'>Our socials</div>                       
                        <div className='about-us-socials'>
                            <div className='about-socials'>
                                <div className='about-social-icon'>
                                <a href="https://www.instagram.com/_amplifygh?utm_source=qr" target="_blank" rel="noreferrer">                        
                                <img
                                    src={process.env.PUBLIC_URL + '/alt_instagram_logo.png'}
                                    alt="Instagram logo"
                                    className="about-instagram-logo"
                                />
                                </a>
                            </div>
                            
                            <div className='about-social-icon'>
                                <a href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1" target="_blank" rel="noreferrer">
                                <img src={process.env.PUBLIC_URL + '/tiktok_logo.png'} alt="Tiktok logo" className="about-tiktok-logo" />
                                </a>
                            </div>
                            <div className='about-social-icon'>
                                <a href="https://x.com/amplifygh?s=21" target="_blank" rel="noreferrer">
                                <img src={process.env.PUBLIC_URL + '/x_logo.png'} alt="X logo" className="about-x-logo" />
                                </a>
                            </div>
                            <div className='about-email-icon'>
                                <a href="mailto:amplifygh@gmail.com?" target="_blank" rel="noreferrer">
                                <img src={process.env.PUBLIC_URL + '/email_icon.png'} alt="Email icon" className="about-email-icon" />
                                </a>
                            </div>
                            </div>

                        </div>
                    </div>
                </div>

        </section>
  )
}

export default About