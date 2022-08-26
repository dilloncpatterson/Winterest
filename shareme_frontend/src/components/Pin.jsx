import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';    //this will provide unique id's for individual posts
import { MdDownloadForOffline } from 'react-icons/md';   
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';
import { client, urlFor } from '../client';

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const { postedBy, image, _id, destination } = pin;
  // created a function in the utils/fetchUser.js therefore following line is commented out now 
  // const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear  
  const user = fetchUser();   //replaced by this line, which now calls the function fetchUser

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();//should auto reload once delete button is pressed
      });
  };

  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.googleId);

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.googleId,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
//While cursor over picture, this hover-over function that will give an option to download, save, or delete if it is your own profile
  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
          {image && (        //this is a user post individual post, images set to horizontal or vertical, this the masonry pattern
        <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" /> )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"  
            style={{ height: '100%' }}        //some issures will tailwind so height is set to 100%
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a        
                  href={`${image?.asset?.url}?dl=`}        //this will allow the user to download THIS specific image
                  download
                  onClick={(e) => {
                    e.stopPropagation();        //when you click something it triggers all the other effects, in the case we just want to download image
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved?.length !== 0 ? (        //length not equal to zero meaning user has already save this post
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                  {pin?.save?.length}  Saved   
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"        //save button on image, styling
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.slice(8).length > 0 ? (        //show url only if it exists
                <a                //anchor tag pointing to a specific destination
                  href={destination}        //This is the link to whichever website the user has put inside the image they post
                  target="_blank"           //to open it in a new page
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {' '}
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...   
                </a>
              ) : undefined}
              {
           postedBy?._id === user?.googleId && (
           <button
             type="button"
             onClick={(e) => {
               e.stopPropagation();
               deletePin(_id);
             }}
             className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
           >
             <AiTwotoneDelete />
           </button>
           )
        }
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"//This is the link to the person who made the post (link to user-profile)
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;