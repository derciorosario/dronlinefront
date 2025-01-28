import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/index';
import NotFound from './pages/404/index'
import Terms from './pages/terms-and-conditions';
import Privacy from './pages/privacy-policy';
import DoctorList from './components/Doctors/index';
import HowToCancelConsultation from './pages/how-to-cancel-my-consultation'
import Faq from './pages/faq'



function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/doctors" element={<DoctorList/>}/>
         <Route path="*" element={<NotFound />} />
         <Route path="/terms" element={ <Terms/>} />
         <Route path="/faq" element={ <Faq/>} />
         <Route path="/privacy" element={ <Privacy/>} />
         <Route path="/how-to-cancel-my-consultation" element={<HowToCancelConsultation/>}/>
      </Routes>
    </Router>
  );


}


export default App;
