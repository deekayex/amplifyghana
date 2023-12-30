import React from 'react'
import "./Submissions.css"
import BasicForm from '../../components/form/Form'
import { Link } from 'react-router-dom'

function Submissions() {
  return (
    <section className='submissions-container' id='submissions'>
      <div className='space'/>
      <div>

      </div>
      <div className='forms-container'>
        Reach out to us
        <div className='form-container'><BasicForm/></div>
      </div>
      <Link to ='/login'>Sign In Link</Link>
      </section>
  )
}

export default Submissions