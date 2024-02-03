import React from 'react'
import './About.css'
import BoxContainer from '../../components/BoxText'
import ScrollToTopOnMount from '../../components/ScrollToTop'
import { Helmet } from 'react-helmet'


const About = () => {
  return (
    <section className='about_us_page' id='about'>
         <Helmet>
        <title>About Us | Amplify Ghana</title>
        <meta name="description" content= "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered." />
        <meta property="og:image" content={'/sharelogo.jpg'}/>
      </Helmet>
        <ScrollToTopOnMount/>        
        <div className='about_top'>
            
            <div className='top_header'>
                <h1>about amplify ghana</h1>
                
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
                <h1>services we offer</h1>
            </div>
            <div className='body_box'>
                <BoxContainer/>
                </div>

                <div className='about_socials'>
                    <div className='about-socials-header'>
                        <h1>Our socials</h1></div>                       
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