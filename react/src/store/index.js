import { proxy } from "valtio";

const state = proxy({
    intro: true, //are we currently on the home page or are we not
    color: '#EFBD48',
    isLogoTexture: true, //are we currently displaying the logo on our shirt
    isFullTexture: false,
    logoDecal: '/public/threejs.png',
    fullDecal: '/public/threejs.png'
});

export default state;