import React, { createContext } from 'react'

export const CSRFContext = createContext(null)
export const User = createContext(null)

function LoadContexts({children, contextValues}) {
    return (
    <CSRFContext.Provider value={contextValues.csrf_token}>
        <User.Provider value={contextValues.user}>
                {children}
        </User.Provider>
    </CSRFContext.Provider>
    )
}

export default LoadContexts