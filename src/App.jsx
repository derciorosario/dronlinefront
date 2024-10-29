import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/index';
import NotFound from './pages/404';
import CreatePacient from './pages/patients/create'
import Login from './pages/login/index';
import Register from './pages/register';
import ProtectedRoute from './ProtectedRoute';
import Appointments from './pages/appointments/index'
import CreateAppointments from './pages/appointments/create'
import Doctors from './pages/doctors/index'
import CreateDoctors from './pages/doctors/create'
import ConsultationAvailability from './pages/consultation-availability/index'
import Scheduler from './pages/scheduler/index'
import Patients from './pages/patients/index'
import CreateClinicalDiary from './pages/clinical-diary/create'
import CreateMedicalPrescription from './pages/medical-prescription/create'
import CreateExams from './pages/exams/create'
import Profile from './pages/profile/index'
import Specialists from './pages/specialists/index'
import SpecialtyCategories from './pages/specialty-categories/index'
import CreateSpecialtyCategories from './pages/specialty-categories/create'
import Dependents from './pages/dependents/index'
import CreateDependents from './pages/dependents/create'
import PaymentManagement from './pages/payment-management/index'
import CreatePaymentManagement from './pages/payment-management/create'
import DoctorRequests from './pages/doctor_requests/index'
import CreateDoctorRequests from './pages/doctor_requests/create'
import Managers from './pages/managers/index'
import CreateManagers from './pages/managers/create'

function App() {

  return (
    <Router>

      <Routes>
         <Route path="/register"  element={<Register/>} />
         <Route path="/login"  element={<Login/>} />
         <Route path="/specialists" element={<Specialists/>} />
         <Route path="/" element={<ProtectedRoute redirectTo="/login"><Home/></ProtectedRoute>}/>
         <Route path="/appointments" element={<ProtectedRoute redirectTo="/login"><Appointments/></ProtectedRoute>}/>
         <Route path="/add-appointments" element={<ProtectedRoute redirectTo="/login"><CreateAppointments/></ProtectedRoute>}/>
         <Route path="/appointment/:id" element={<ProtectedRoute redirectTo="/login"><CreateAppointments/></ProtectedRoute>}/>

         <Route path="/doctors" element={<ProtectedRoute redirectTo="/login"><Doctors/></ProtectedRoute>}/>
        
         <Route path="/specialty-categories" element={<ProtectedRoute redirectTo="/login"><SpecialtyCategories/></ProtectedRoute>}/>
         <Route path="/add-specialty-category" element={<ProtectedRoute redirectTo="/login"><CreateSpecialtyCategories/></ProtectedRoute>}/>
         <Route path="/specialty-category/:id" element={<ProtectedRoute redirectTo="/login"><CreateSpecialtyCategories/></ProtectedRoute>}/>
         
         <Route path="/add-doctors" element={<ProtectedRoute redirectTo="/login"><CreateDoctors/></ProtectedRoute>}/>
         <Route path="/doctor/:id" element={<ProtectedRoute redirectTo="/login"><CreateDoctors/></ProtectedRoute>}/>

         <Route path="/managers" element={<ProtectedRoute redirectTo="/login"><Managers/></ProtectedRoute>}/>
         <Route path="/add-managers" element={<ProtectedRoute redirectTo="/login"><CreateManagers/></ProtectedRoute>}/>
         <Route path="/manager/:id" element={<ProtectedRoute redirectTo="/login"><CreateManagers/></ProtectedRoute>}/>

         <Route path="/add-patient"  element={<CreatePacient/>} />
         <Route path="/patients"  element={<Patients/>} />
         <Route path="/patient/:id"  element={<CreatePacient/>} />

         <Route path="/add-dependent"  element={<CreateDependents/>} />
         <Route path="/dependents"  element={<Dependents/>} />
         <Route path="/dependent/:id"  element={<CreateDependents/>} />

         <Route path="/payment-management" element={<PaymentManagement/>} />
         <Route path="/payment-management/:id" element={<CreatePaymentManagement/>} />

         <Route path="/membership-requests" element={<DoctorRequests/>} />
         <Route path="/membership-requests/:id" element={<CreateDoctorRequests/>} />
        
         <Route path="/appointment/:id/clinical-diary" element={<CreateClinicalDiary/>} />
         <Route path="/appointment/:id/clinical-diary/:id" element={<CreateClinicalDiary/>} />

         <Route path="/add-clinical-diary"  element={<CreateClinicalDiary/>} />
         <Route path="/clinical-diary/:id" element={<CreateClinicalDiary/>} />

         <Route path="/medical-prescription/:id" element={<CreateMedicalPrescription/>} />
         <Route path="/add-medical-prescription" element={<CreateMedicalPrescription/>} />

         <Route path="/exams/:id" element={<CreateExams/>} />
         <Route path="/add-exams" element={<CreateExams/>} />

         <Route path="/profile" element={<Profile/>} />  

         <Route path="/consultation-availability"  element={<ConsultationAvailability/>} />

         <Route path="/scheduler"  element={<Scheduler/>} />

         <Route path="*" element={<NotFound />} />

      </Routes>
      
    </Router>
  );


}


export default App;
