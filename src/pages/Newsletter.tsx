import React from 'react'
import subscribe from '../assets/essentials/subscribe.png'

const Newsletter:React.FC = () => {
  return (
    <> 
    <div className='newsletter'>
    <h1>Stay Up to Date</h1>
    <p>Subscribe to our newsletter to receive our weekly feed.</p>
    <img src={subscribe} alt="" />
    <div className='newletter_input'><input type="text"  placeholder='Enter you email...'/> <button>Subscribe</button></div> 
    </div>
    </>
  )
}

export default Newsletter