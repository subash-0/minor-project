import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import { Toaster } from 'react-hot-toast';

import "./App.css"
import { HomePage, LoginPage, SignupPage } from "./pages"
import Protected from "./utils/protect/Protected"



const App = () => {
  return (
   <>
    <Toaster
    position="top-right"
    reverseOrder={false}
    />
   <Router>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route element={<Protected/>}>
          <Route path="/" element={<HomePage/>}/>
        </Route>
      </Routes>
   </Router>

   </>
  )
}

export default App