import React from 'react'
import Header from './component/Header'
import RegistrationForm from './DoctorPhase/RegistrationForm'
import LocationSetup from './DoctorPhase/LocationSetup'
import BasicDetails from './DoctorPhase/BasicDetails'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SetWeeklySchedule from './DoctorPhase/SetWeeklySchedule'
import LoginForm from './DoctorPhase/LoginForm'
import Dashboard from './DoctorPhase/Dashboard'
import AfterRegistration from './DoctorPhase/AfterRegistration'
import LoginPage from './AdminPhase/LoginPage'
import AdminDashboard from './AdminPhase/AdminDashboard'
import DoctorVerification from './AdminPhase/DoctorVerification'
import TotalDoctor from './AdminPhase/TotalDoctor'
import TotalPatients from './AdminPhase/TotalPatients'
import PatientLogin from './Patient/PatientLogin'
import PatientSignup from './Patient/PatientSignup'
import PatientDashboard from './Patient/PatientDashboard'
import PatientDoctorList from './Patient/PatientDoctorList'
import PatientDoctorSlots from './Patient/PatientDoctorSlots'
import Password from './ForgetPassword/DoctorPassword'
import MainPage from './MainPage'
import DoctorPassword from './ForgetPassword/DoctorPassword'
import PatientPassword from './ForgetPassword/PatientPassword'
import AdminPassword from './ForgetPassword/AdminPassword'
import MedicineSignup from './Medicine/MedicineSignup'
import MedicineLogin from './Medicine/MedicineLogin'
import MedicineDashboard from './Medicine/MedicineDashboard'
import Settings from '../src/DoctorPhase/Settings'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      // Doctor Phase
      <Route path='/Registration' element={<RegistrationForm/>}/>
      <Route path='/BasicDetails/:token' element={<BasicDetails/>}/>
      <Route path='/LocationSetup' element={<LocationSetup/>}/>
      <Route path='/SetSchedule' element={<SetWeeklySchedule/>}/>
      <Route path='/login' element={<LoginForm/>}></Route>
      <Route path='/Dashboard' element={<Dashboard/>}></Route>
      <Route path='/AfterRegistration' element={<AfterRegistration/>}/>
      <Route path='/Doctor/Settings' element={<Settings/>}/>

      // Admin phase
      <Route path='/Admin/LoginPage' element={<LoginPage/>}/>
      <Route path='/Admin/Dashboard' element={<AdminDashboard/>}/>
      <Route path='/Admin/DoctorVerification' element={<DoctorVerification/>}/>
      <Route path='/Admin/TotalDoctor' element={<TotalDoctor/>}/>
      <Route path='/Admin/TotalPatient' element={<TotalPatients/>}/>

      // Patient Phase
      <Route path='/Patient/Login' element={<PatientLogin/>}/>
      <Route path='/Patient/Signup' element={<PatientSignup/>}/>
      {/* <Route path='/Patient/Medicine' element={<PatientMedicine/>}/> */}
      {/* <Route path='/Patient/Laboratory' element={<PatientLaboratory/>}/> */}
      <Route path='/Patient/Dashboard' element={<PatientDashboard/>}/>
      <Route path='/Patient/DoctorList' element={<PatientDoctorList/>}/>
      <Route path='/Patient/DoctorSlot/:id' element={<PatientDoctorSlots/>}/>
        {/* ---------------Forget Password ---------------*/}
    <Route path='/forgot-password-doctor' element={<DoctorPassword/>}/>
    <Route path='/forgot-password-patient' element={<PatientPassword/>}/>
    <Route path='/forgot-password-admin' element={<AdminPassword/>}/>

    {/* ---------------- Medicine --------------------- */}
    <Route path='/Medicine/Signup' element={<MedicineSignup/>}/>
    <Route path='/Medicine/Login' element={<MedicineLogin/>}/>
    <Route path='/Medicine/Dashboard' element={<MedicineDashboard/>}/>
      </Routes>

  
    </BrowserRouter>
  )
}



export default App

// Logo
// https://files.catbox.moe/mijo7f.png
