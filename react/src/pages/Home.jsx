import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'

import state from '../store';

import { CustomButton } from '../components';

import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from 'C:/Users/baraa/Desktop/threejs/react/src/config/config/motion.js';     

// Home page component: shows intro screen with animated header and CTA
const Home = () => {
  // subscribe to global state using valtio snapshot
  const snap = useSnapshot(state);

  return (
    // AnimatePresence enables enter/exit animations for conditional children
    <AnimatePresence>
        {/* Render intro content only when `snap.intro` is true */}
        {snap.intro && (
            // main section slides in from the left
            <motion.section className="home" {...slideAnimation('left')}>
                {/* header with logo that slides down */}
                <motion.header {...slideAnimation("down")}>
                    <img
                        src='/public/threejs.png'
                        alt="logo"
                        className="w-8 h-8 object-contain"
                    />    
                </motion.header>

                {/* container for the headline and content with container animation */}
                <motion.div className="home-content" {...headContainerAnimation}>

                    {/* animated headline text block */}
                    <motion.div {...headTextAnimation}>

                        <h1 className="head-text">
                            Motion<br className="x1:block hidden" />.
                        </h1>

                    </motion.div>

                    {/* content area with descriptive text and CTA button */}
                    <motion.div {...headContentAnimation} className="flex flex-col gap-5">

                        <p className="max-w-md font-normal text-black-600 text-base">
                            Create your unique and exclusive shirt with
                            our brand-new 3D customization tool. <strong>Unleash
                            your imagination</strong> and define your own style.
                        </p>

                        {/* button that switches app from intro to customization view */}
                        <CustomButton
                            type="filled"
                            title="Customize It"
                            handleClick={() => state.intro = false} //callback function that will update the state to go to the customization page
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm" //width fit to content, padding x-axis 4, y-axis 2.5, bold font, small text size
                        />

                    </motion.div>

                </motion.div>

            </motion.section>
        )}
    </AnimatePresence>
  )
}

export default Home