import React from 'react'
import './About.css'
import BoxContainer from '../../components/BoxText'


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
                        {/* <Socials/> */}
                    </div>
                </div>
            </div>
        </section>
  )
}

export default About