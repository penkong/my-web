/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom';
import Icons from './Icons';



// import GoogleAuth from './GoogleAuth';

const Header = () => {
  return (

    <nav class="navbar navbar-light bg-faded">
      <a class="navbar-brand" href="#"><Icons/></a> 
    </nav>

    // <div>
    //   <div>
    //     
    //   </div>
    //   <div>
    //     <Link to="/">About</Link>
    //     <Link to="/">My Path</Link>
    //     <Link to="/">Blog</Link>
    //   </div>
    // </div>
  )
}

export default Header;