import Image from 'next/image'
import React from 'react'
import { FaInfoCircle } from 'react-icons/fa'; 

const StoryTeller = () => {

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
       <Image
        src="/spooky-main-logo.png"
        alt="Company Logo"
        width={200}
        height={200}
        priority
      />
      <h1 className="text-3xl text-milk">Spooky Teller</h1>
        <div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <p className="me-2.5">Tu historia, tu elección:</p>
                <FaInfoCircle />
            </div>
            <div>
                <input type="text" style={{width: '100%', height: '36px', margin: '16px 0'}}/>
                <input type="text-area" style={{width: '100%', height: '350px', margin: '16px 0'}}/>

            </div>
        </div>
    </div>
  )
}

export default StoryTeller