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
import AppointmentFeedback from './pages/feedback/appointment-feedback.jsx'
import AppFeedback from './pages/feedback/app-feedback.jsx'
import Invoice from './pages/invoice/index.jsx'
import Faq from './pages/faq/index.jsx'
import CreateFaq from './pages/faq/create.jsx'
import Logs from './pages/logs/index.jsx'
import UserActivities from './pages/user-activities/index.jsx'
import Refunds from './pages/refunds/index.jsx'
import CreateRefunds from './pages/refunds/create.jsx'
import ZoomMeeting from './pages/meetings/zoom/index.jsx';
import CancellationTaxes from './pages/cancellation-taxes/index.jsx'
import CreateCancellationTaxes from './pages/cancellation-taxes/create.jsx'
import AppSettings from './pages/app-settings/create.jsx'
import WaitingList from './pages/waiting-list/index.jsx'
import CreateWaitingList from './pages/waiting-list/create.jsx'
import WaitingListStats from './pages/waiting-list/stats.jsx'

import MedicalCertificates from './pages/medical-certificates/index.jsx'
import CreateMedicalCertificates from './pages/medical-certificates/create.jsx'

import LandingPageHome from './landingpage/pages/home/index.jsx'
import Privacy from './landingpage/pages/privacy-policy';
import DoctorList from './landingpage/components/Doctors/index';
import HowToCancelConsultation from './landingpage/pages/how-to-cancel-my-consultation'
import LandingPageFaq from './landingpage/pages/faq'
import Terms from './landingpage/pages/terms-and-conditions';
import AppointmentCancelationTerms from './landingpage/pages/appointment-cancelation-terms';
import VerifyCode from './landingpage/pages/verify-doc-qrcode/index.jsx'
import TestReactPdf from './components/Print/renderpdf-test.jsx'

function App() {

  //const {pathname} = useLocation()

  return (

    <Router>
      <Routes>
         <Route path="/testpdf" element={<TestReactPdf/>} />
         <Route path="/terms" element={ <Terms/>} />
         <Route path="/faq" element={ <LandingPageFaq/>} />
         <Route path="/privacy" element={ <Privacy/>} />
         <Route path="/how-to-cancel-my-consultation" element={<HowToCancelConsultation/>}/>
         <Route path="/doctors-list" element={<DoctorList/>}/>
         <Route path="/dashboard" element={<ProtectedRoute redirectTo="/login"><Home/></ProtectedRoute>}/>
         <Route path="/appointment-cancelation-terms" element={ <AppointmentCancelationTerms/>} />
         <Route path="/qrcode/:id" element={ <VerifyCode/>} />
         <Route path="/register"  element={<Register/>} />
         <Route path="/login"  element={<Login/>} />
         <Route path="/specialists" element={<Specialists/>} />
         <Route path="/" element={<LandingPageHome/>}/>
         <Route path="/appointments" element={<ProtectedRoute redirectTo="/login"><Appointments/></ProtectedRoute>}/>
         <Route path="/add-appointments" element={<ProtectedRoute redirectTo="/login"><CreateAppointments/></ProtectedRoute>}/>
         <Route path="/appointment/:id" element={<ProtectedRoute redirectTo="/login"><CreateAppointments/></ProtectedRoute>}/>

         <Route path="/doctors" element={<ProtectedRoute redirectTo="/login"><Doctors/></ProtectedRoute>}/>
        
         <Route path="/specialty-categories" element={<ProtectedRoute redirectTo="/login"><SpecialtyCategories/></ProtectedRoute>}/>
         <Route path="/add-specialty-category" element={<ProtectedRoute redirectTo="/login"><CreateSpecialtyCategories/></ProtectedRoute>}/>
         <Route path="/specialty-category/:id" element={<ProtectedRoute redirectTo="/login"><CreateSpecialtyCategories/></ProtectedRoute>}/>

         <Route path="/app-settings" element={<ProtectedRoute redirectTo="/login"><AppSettings/></ProtectedRoute>}/>
        
         <Route path="/cancellation-taxes" element={<ProtectedRoute redirectTo="/login"><CancellationTaxes/></ProtectedRoute>}/>
         <Route path="/cancellation-taxes/:id" element={<ProtectedRoute redirectTo="/login"><CreateCancellationTaxes/></ProtectedRoute>}/>
         
         <Route path="/waiting-list" element={<ProtectedRoute redirectTo="/login"><WaitingList/></ProtectedRoute>}/>
         <Route path="/waiting-list/:id" element={<ProtectedRoute redirectTo="/login"><CreateWaitingList/></ProtectedRoute>}/>
         <Route path="/waiting-list-stats" element={<ProtectedRoute redirectTo="/login"><WaitingListStats/></ProtectedRoute>}/>
         

         <Route path="/add-doctors" element={<ProtectedRoute redirectTo="/login"><CreateDoctors/></ProtectedRoute>}/>
         <Route path="/doctor/:id" element={<ProtectedRoute redirectTo="/login"><CreateDoctors/></ProtectedRoute>}/>

         <Route path="/managers" element={<ProtectedRoute redirectTo="/login"><Managers/></ProtectedRoute>}/>
         <Route path="/add-managers" element={<ProtectedRoute redirectTo="/login"><CreateManagers/></ProtectedRoute>}/>
         <Route path="/manager/:id" element={<ProtectedRoute redirectTo="/login"><CreateManagers/></ProtectedRoute>}/>

         <Route path="/add-patient"  element={<CreatePacient/>} />
         <Route path="/patients"  element={<Patients/>} />
         <Route path="/patient/:id"  element={<CreatePacient/>} />

         <Route path="/appointment-feedback"  element={<AppointmentFeedback/>} />
         <Route path="/app-feedback"  element={<AppFeedback/>} />

         <Route path="/add-dependent"  element={<CreateDependents/>} />
         <Route path="/dependents"  element={<Dependents/>} />
         <Route path="/dependent/:id"  element={<CreateDependents/>} />

         <Route path="/faqs"  element={<Faq/>} />
         <Route path="/faq/:id"  element={<CreateFaq/>} />
         <Route path="/add-faq"  element={<CreateFaq/>} />

         <Route path="/invoice/:id"  element={<Invoice/>} />

         <Route path="/payment-management" element={<PaymentManagement/>} />
         <Route path="/payment-management/:id" element={<CreatePaymentManagement/>} />

         <Route path="/refunds" element={<Refunds/>} />
         <Route path="/refund/:id" element={<CreateRefunds/>} />

         <Route path="/membership-requests" element={<DoctorRequests/>} />
         <Route path="/membership-requests/:id" element={<CreateDoctorRequests/>} />
        
         <Route path="/appointment/:id/clinical-diary" element={<CreateClinicalDiary/>} />
         <Route path="/appointment/:id/clinical-diary/:id" element={<CreateClinicalDiary/>} />

         <Route path="/add-clinical-diary"  element={<CreateClinicalDiary/>} />
         <Route path="/clinical-diary/:id" element={<CreateClinicalDiary/>} />

         <Route path="/medical-prescription/:id" element={<CreateMedicalPrescription/>} />
         <Route path="/add-medical-prescription" element={<CreateMedicalPrescription/>} />

         <Route path="/medical-certificate/:id" element={<CreateMedicalCertificates/>} />
         <Route path="/medical-certificates" element={<MedicalCertificates/>} />

         <Route path="/exam/:id" element={<CreateExams/>} />
         <Route path="/add-exams" element={<CreateExams/>} />
         

         <Route path="/profile" element={<Profile/>} />  

         <Route path="/consultation-availability"  element={<ConsultationAvailability/>} />
         <Route path="/consultation-availability/:id"  element={<ConsultationAvailability/>} />

         

         <Route path="/scheduler"  element={<Scheduler/>} />
         <Route path="/scheduler/:id"  element={<Scheduler/>} />

         <Route path="/logs"  element={<Logs/>} />
         <Route path="/user-activities"  element={<UserActivities/>} />
         <Route path="/meeting/zoom/appointment/:id"  element={<ProtectedRoute redirectTo="/login"><ZoomMeeting/></ProtectedRoute>} />
         <Route path="*" element={<NotFound />} />

      </Routes>
      
    </Router>
  );


}


export default App;
