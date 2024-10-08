import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalContainer from "./components/globelContainer";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <GlobalContainer>
            <App />
        </GlobalContainer>
    </React.StrictMode>
);
