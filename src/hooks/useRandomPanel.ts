const randomWords = ['manga', 'anime', 'japan', 'tokyo', 'samurai', 'ninja', 'sushi', 'kawaii', 'sakura', 'cute', "shamiko", "jujutsu", "chainsaw", "touhou", "vagabond", "titan", "peak", "dark", "death", "night", "gojo"];

function getRandomWord() {
    return randomWords[Math.floor(Math.random() * randomWords.length)];
}

import { useQuery } from 'react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';

interface Panel {
    id: string;
    image_url: string;
}

interface ApiResponse {
    panels: Panel[];
}


export default function useRandomPanel() {
    const [randomPanel, setRandomPanel] = useState<Panel | null>(null);

    const fetchPanels = useCallback(async () => {
        const randomWord = getRandomWord();
        const response = await axios.get<ApiResponse>(`https://api.panelsdesu.com/v1/search?q=${randomWord}`);
        return response.data;
    }, []);

    const selectRandomPanel = useCallback((data: ApiResponse) => {
        if (data.panels.length === 0) {
            setRandomPanel(null);
        } else {
            const randomIndex = Math.floor(Math.random() * data.panels.length);
            setRandomPanel(data.panels[randomIndex]);
        }
    }, []);

    const { isLoading, isError, refetch } = useQuery<ApiResponse, Error>(
        'randomPanel',
        fetchPanels,
        {
            refetchOnWindowFocus: false,
            refetchInterval: 60000,
            onSuccess: selectRandomPanel,
            staleTime: 60000,
        }
    );

    const manualRefetch = useCallback(() => {
        refetch().then((result) => {
            if (result.data) {
                selectRandomPanel(result.data);
            }
        });
    }, [refetch, selectRandomPanel]);

    return {
        randomPanel,
        isLoading,
        isError,
        refetch: manualRefetch
    };
}
