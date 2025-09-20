import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'

// app configuration and global state
import config from '../config/config/config'
import state from '../store'

// utilities and constants used by the customizer
import { download } from '../assets/index'
import { downloadCanvasToImage, reader } from '../config/config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/config/constants'
import { fadeAnimation, slideAnimation } from '../config/config/motion'

// UI components used in the customizer view
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components'

// Customizer component: shows the editor UI when not on the intro screen
const Customizer = () => {
  // snapshot of valtio state to determine current app view to check if we are on the homepage or the customization page
  const snap = useSnapshot(state); 

  const [file, setFile] = useState(''); //state to hold the uploaded file
  const [prompt, setPrompt] = useState(''); //state to hold the AI prompt
  const [generatingImg, setGeneratingImg] = useState(false); //state to indicate if an AI image is being generated
  const [activeEditorTab, setActiveEditorTab] = useState(''); //state to track the currently active editor tab
  const [activeFilterTab, setActiveFilterTab] = useState({ //state to track the active filter tabs for logo and full texture
    logoShirt: true,
    stylishShirt: false,
  });


  //showtab content depending on the active tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case 'filepicker':
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile} //allows us to read the uploaded file
        /> 
      case 'aipicker':
        return <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          setGeneratingImg={setGeneratingImg}
          handleSubmit={handleSubmit} //function to handle submitting the AI prompt
        />
      default:
        return null;
    }
  }

  //function to handle submitting the AI prompt
  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      //call our backend to generate an AI image!
      setGeneratingImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${response.status}`);
      }
  const data = await response.json(); //once we have the request/response cycle done, get the data from the response
  if (!data?.photo) throw new Error('No image returned from AI');
  const result = data.photo.startsWith('http') ? data.photo : `data:image/png;base64,${data.photo}`;
  handleDecals(type, result); //apply the decal based on the type and the base64/image URL

    } catch (error) {
      alert(error?.message || String(error))
    } finally {
      setGeneratingImg(false);
      // keep the editor open on error so user can retry
      setActiveEditorTab(prev => prev && generatingImg ? prev : "");
    }
  }


  //function to handle toggling filter tabs and updating global state
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result; //update the global state(store) with the new decal

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab) //activate the corresponding filter tab if not already active
    }
  }

// keep track of are we showing the logo or full texture or both or none at all
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }
    //after setting the state, update the active filter tab state to reflect the change

    setActiveFilterTab((prevState) => {
      return {
        ...prevState, //spreads the previous state to keep other tabs unchanged then update the tab name to be equaled to previous state to that same tab name
        [tabName]: !prevState[tabName], // take the tab name then set it to not prev state tab name meaaning toggle it on and off
      }
      })
    }


  //handle reading the uploaded file and applying it as a decal
  const readFile = (type) => {
    reader(file) //reader function that gets the data from the uploaded file
      .then((result) => { //once the file is read successfully
        handleDecals(type, result); //apply the decal based on the type and result
        setActiveEditorTab(""); //close the active editor tab
      })
  }

  return (
    <AnimatePresence>
      {/* Render editor only when intro is false */}
      {!snap.intro && (
        <>
          {/* main animated container that slides in from left */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 right-0 z-10"
            {...slideAnimation('left')}
          >
            {/* editor tabs column */}
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>

            {/* floating "Go Back" button that returns to intro */}
            <motion.div 
              className="absolute z-20 top-5 right-5" {...fadeAnimation}
            >
              <CustomButton
                type="filled"
                title="Go Back"
                handleClick={() => (state.intro = true)}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>

            {/* filter tabs that slide up into view */}
            <motion.div className="filtertabs-container" {...slideAnimation('up')}>
              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab={true}
                  isActiveTab={activeFilterTab[tab.name]} //determine if the tab is active based on state
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Customizer