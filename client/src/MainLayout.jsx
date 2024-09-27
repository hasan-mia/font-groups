import React from 'react';
import FontUpload from './components/FontUpload';
import FontList from './components/FontList';
import FontGroup from './components/FontGroup';
import FontGroupList from './components/FontGroupList';

const MainApp = () => {
    return (
        <div className='py-2 px-2 lg:px-6'>
            <FontUpload/>
            <FontList />
            <FontGroup/>
            <FontGroupList/>
        </div>
    );
};

export default MainApp;
