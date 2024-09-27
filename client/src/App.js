import React, { useEffect, useState } from 'react';
import FontUpload from './components/FontUpload';
import FontList from './components/FontList';
import FontGroup from './components/FontGroup';
import FontGroupList from './components/FontGroupList';

const App = () => {
    const [fonts, setFonts] = useState([]);
    const [fontTotal, setFontTotal] = useState(0)
    const [fontCurrent, setFontCurrent] = useState(1)
    const [fontGroups, setFontGroups] = useState([]);
    const [fontGroupTotal, setFontGroupTotal] = useState(0)
    const [fontGroupCurrent, setFontGroupCurrent] = useState(1)

    const fetchFonts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/fonts?page=${fontCurrent}&per_page=10`);
            const result = await response.json();
            if(result){
                setFonts(result.data);
                setFontTotal(result.total)
                setFontCurrent(result.current_page)
            }
        } catch (error) {
            console.error('Error fetching fonts:', error);
        }
    };

    const fetchFontGroups = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/fontgroups?page=${fontGroupCurrent}&per_page=5`);
            const result = await response.json();
            if(result){
                setFontGroups(result.data);
                setFontGroupTotal(result.total)
                setFontGroupCurrent(result.currentPage)
            }
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

    useEffect(() => {
        if(fonts?.length <= 0){
            fetchFonts();
        }
    }, [fonts, fetchFonts]);

    useEffect(()=>{
        if(fontGroups.length <=0){
            fetchFontGroups();
        }
    },[fontGroups, fetchFontGroups])

    console.log(fontGroups)

    return (
        <div>
            <h1>Font Group Creator</h1>
            <FontUpload fonts={fonts} addFont={addFont} />
            { fonts && fonts.length> 0 && <FontList fonts={fonts || []} total={fontTotal}  currentPage={fontCurrent} setCurrentPage={setFontCurrent}/> }
            { fonts && fonts.length > 0 && <FontGroup fonts={fonts || []} total={fontGroupTotal} currentPage={fontGroupCurrent} setCurrentPage={setFontGroupCurrent} addFontGroup={addFontGroup} />} 
            { fontGroups&& fontGroups.length > 0 &&  <FontGroupList fontGroups={fontGroups || []} /> }
        </div>
    );
};

export default App;
