import React from 'react'
import Logo from '../assets/Logo.png'
const Header = () => {
  return (
    <div className='bg-white h-max pt-2'>
      <div className='flex text-center items-center '>
        <img className='ml-5 ' height={60} width={60} src={Logo} alt="logo"/>
        <span className=' font-bold text-2xl'> <span className='ml-3 text-[#058b7c]'>MED</span> SEWA</span>
      </div>
      <div></div>
    </div>
  )
}

export default Header