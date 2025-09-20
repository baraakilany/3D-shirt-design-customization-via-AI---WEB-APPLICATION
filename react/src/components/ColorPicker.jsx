import React from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store'

// ColorPicker component: allows users to pick a color for the shirt

const ColorPicker = () => {
  const snap = useSnapshot(state);



  return (
    <div className="absolute left-full ml-3">
      <SketchPicker
        color={snap.color} //color coming from our state
        disableAlpha //disable opacity slider

        //presetColors={['']} //preset colors for if you want to add your own colours ex: ['#000000', etc]

        onChange={(color) => state.color = color.hex} //update the global state with the new color
      />
    </div>
  )
}

export default ColorPicker