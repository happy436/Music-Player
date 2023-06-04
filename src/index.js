import React from "react"
/* import "./index.css" */
import App from "./App"
import { Router } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from "react-redux"
import { createRoot } from "react-dom/client"
/* import { createStore } from "./store/createStore" */
/* import history from "./utils/history" */

const root = createRoot(document.getElementById("root"))
/* const store = createStore() */

root.render(
    <React.StrictMode>
        {/* <Provider store={store}> */}
            {/* <Router history={history}> */}
                <App />
            {/* </Router> */}
        {/* </Provider> */}
    </React.StrictMode>
)
