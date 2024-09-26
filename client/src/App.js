import React, { useEffect, useState } from 'react';
import FontUpload from './FontUpload';
import FontList from './FontList';
import FontGroup from './FontGroup';
import FontGroupList from './FontGroupList';

const App = () => {
    const [fonts, setFonts] = useState([]);
    const [fontGroups, setFontGroups] = useState([]);

    // Fetch fonts and font groups from the API
    useEffect(() => {
        fetchFonts();
        fetchFontGroups();
    }, []);

    const fetchFonts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/fonts?page=1&per_page=10`);
            const result = await response.json();
            setFonts(result);
        } catch (error) {
            console.error('Error fetching fonts:', error);
        }
    };

    const fetchFontGroups = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/fontgroups?page=1&per_page=5`);
            const result = await response.json();
            setFontGroups(result);
        } catch (error) {
            console.error('Error fetching font groups:', error);
        }
    };

    const addFont = (font) => {
        setFonts([...fonts, font]);
    };

    const addFontGroup = (group) => {
        setFontGroups([...fontGroups, group]);
    };

    return (
        <div>
            <h1>Font Group Creator</h1>
            <FontUpload addFont={addFont} />
            <FontList fonts={fonts} />
            <FontGroup fonts={fonts} addFontGroup={addFontGroup} />
            <FontGroupList fontGroups={fontGroups} />
        </div>
    );
};

export default App;
