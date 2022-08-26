import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
 
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';



const Feed = () => {
  const [loading, setloading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams(); //call it as a hook (for Sanity DB)

  useEffect(() => {
    setloading(true);
    

    //this will do the logic of searching all the pins and posts for a specific category

    if (categoryId) {                                  //if searching for a specific category, then want to proceed with that
      const query = searchQuery(categoryId);          //queray to DB for categoryId
                                                     //searchQuery created in utils folder, data.js file

      client.fetch(query)
      .then((data) => {
        setPins(data);
        setloading(false);                            //want to stop the loading here
      })
    } else{                                            //search all categories all together
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setloading(false);
      })
    }
  }, [categoryId])
  

  if(loading) return <Spinner message="We are adding new ideas to your feed!"  />

  return (
    <div>
      {pins && <MasonryLayout  pins={pins} />}
      </div>
  )
}

export default Feed