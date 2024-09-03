const randomWords = ['manga', 'anime', 'japan', 'tokyo', 'samurai', 'ninja', 'sushi', 'kawaii', 'sakura', 'cute', "shamiko", "jujutsu", "chainsaw", "touhou", "vagabond", "titan", "peak", "dark"];

function getRandomWord() {
    return randomWords[Math.floor(Math.random() * randomWords.length)];
}

import { useQuery } from 'react-query';
import axios from 'axios';

interface Panel {
    id: string;
    image_url: string;
}

interface ApiResponse {
    panels: Panel[];
}

interface TransformedResponse extends ApiResponse {
    randomPanel: Panel | null;
}
export default function useRandomPanel() {
    const fetchPanels = async () => {
        const randomWord = getRandomWord();
        const response = await axios.get<ApiResponse>(`https://api.panelsdesu.com/v1/search?q=${randomWord}`);
        return response.data;
    };

    return useQuery<ApiResponse, Error, TransformedResponse>('randomPanel', fetchPanels, {
        refetchOnWindowFocus: false,
        refetchInterval: 60000, // 2 minutes in milliseconds
        select: (data: ApiResponse): TransformedResponse => {
            if (data.panels.length === 0) {
                return { ...data, randomPanel: null };
            }
            const randomIndex = Math.floor(Math.random() * data.panels.length);
            return { ...data, randomPanel: data.panels[randomIndex] };
        },
    });
}