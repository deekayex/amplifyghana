import React from 'react'
import './Messages.css'

const Messages = () => {
  return (
    <div>
      <div className='spacer' />
      <div className='messages'>Messages
        <div className='inox-header'>
          <div className='inbox-menu'>
            <div>All</div>
            <div>New</div>
            <div>Read</div>
          </div>
        </div>

        <div className='inbox-message'>
          <div>Message</div>
          <div>Name</div>
          <div>Email</div>
          <div>Phone number</div>
          <div>Date and Time</div>
        </div>
       </div>
     </div>
  )
}

export default Messages