import React from 'react';

export default function Header() {
    return (
        <div style={headContainer}>
            <h1 style={{
                fontWeight: 700,
                fontStyle: "bold"
            }}>
               $ Satta Group
            </h1>
            <span>
            Aankhei khol le bsdk IPL horha start. 
            </span>
            Aaja mere tatte chaat
        </div>
    );
}

const headContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "20vh",
    textAlign:"center",
    flexDirection: "column"
};