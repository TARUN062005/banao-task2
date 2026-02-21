import { createContext, useContext, useState } from 'react';

const ScreenShareContext = createContext();

export const ScreenShareProvider = ({ children }) => {
    const [status, setStatus] = useState('idle');

    return (
        <ScreenShareContext.Provider value={{ status, setStatus }}>
            {children}
        </ScreenShareContext.Provider>
    );
};

export const useScreenShareStatus = () => useContext(ScreenShareContext);