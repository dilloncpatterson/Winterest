//This particular layout will give an offset view with pictures that are staggered....
//masonry grid
import React from 'react'
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {       //size diferences for different screen sizes, use your personal preference.
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({ pins }) => {//import pins 
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}>
      {pins?.map((pin) => <Pin key={pin._id} pin={pin} className='w-max' />)}
    </Masonry>
  )
}

export default MasonryLayout