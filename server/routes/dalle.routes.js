import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
//import { Configuration, OpenAIApi } from 'openai'; // OLD WAY

dotenv.config();

const router = express.Router();

//const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY }); // OLD WAY
//const openai = new OpenAIApi(config); // OLD WAY

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // NEW WAY

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from DALL-E ROUTES' });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await openai.images.generate({
            model: 'gpt-image-1',
            prompt,
            size: '1024x1024'
        });
        
    const image = response.data?.[0]?.b64_json || response.data?.[0]?.url;
    if (!image) throw new Error('No image returned');
    res.status(200).json({ photo: image });

    } catch (error) {
        console.error('Error details:', error.status || '', error.message || error);
        res.status(error.status || 500).json({ message: error.message || 'Something went wrong' });
    }
});
export default router;