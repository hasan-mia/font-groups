import { useEffect, useState } from "react";

export function useFontLoader(fontUrl, fontFamily) {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        if (!fontUrl || !fontFamily) return;

        const style = document.createElement('style');
        style.innerHTML = `
            @font-face {
                font-family: '${fontFamily}';
                src: url('${fontUrl}') format('truetype'); 
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);

        // Use the native font loading API
        document.fonts.load(`1em ${fontFamily}`).then(() => {
            setFontLoaded(true);
        }).catch(err => {
            console.error('Failed to load font:', err);
            setFontLoaded(false);
        });

        return () => {
            document.head.removeChild(style);
        };
    }, [fontUrl, fontFamily]);

    return fontLoaded;
}
