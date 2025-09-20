import React from 'react'
import { useSnapshot } from 'valtio';

import state from '../store';
import { getContrastingColor } from '../config/config/helpers';

const CustomButton = ({type, title, customStyles, handleClick}) => 
{
    const snap = useSnapshot(state);

    //function that will return different styles based on the type of button we want to create
    const generateStyle = (type) => {
        if(type === 'filled') {
            return {
                backgroundColor: snap.color, //cant do this unless you import useSnapshot from valtio and import state from store
                color: getContrastingColor(snap.color), //function that will return either black or white based on the background color for better visibility
            }
        } else if (type === 'outline') {
            return {
                borderWidth: '1px',
                borderColor: snap.color,
                color: snap.color,
            };
        }
    }

  return (
    <button 
        className={'px-2 py-1.5 flex-1 rounded-md ${customStyles} '} //all of this is still the <button> element's className
        style={generateStyle(type)} //inline style that will be generated based on the type of button we want to create
        onClick={handleClick} //when button is clicked, it will call the handleClick function that is passed as a prop
    >
        {title}
    </button>
  )
}

export default CustomButton