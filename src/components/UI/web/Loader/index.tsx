import React from 'react';
import './loader.css'

const Loader = ({backgroundColor='foreground'}:{backgroundColor?:string}) => {
  return (
    <div className={`h-screen  flex justify-center items-center bg-${backgroundColor}`}>
      <span className="loader"></span>
    </div>
  )
}

export default Loader
