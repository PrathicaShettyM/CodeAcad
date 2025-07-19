import './App.css'

import { Route,Routes } from "react-router-dom";

import NotRequireAuth from './Auth/NotRequireAuth';
import RequireAuth from './Auth/RequireAuth';
import Aboutus from './pages/Aboutus';
import Contact from './pages/Contact';
import CourseDescription from './pages/Courses/CourseDescription';
import CourseList from './pages/Courses/CourseList';
import CreateCourse from './pages/Courses/CreateCourse';
import AddLecture from './pages/Dashboard/AddLectures';
import AdminDashboard from './pages/Dashboard/AdminDashBoard';
import DisplayLectures from './pages/Dashboard/DisplayLectures';
import Denied from './pages/Denied';
import Home from './pages/Home';
import Notfound from './pages/Notfound';
import ChangePassword from './pages/Password/ChangePassword';
import ForgotPassword from './pages/Password/ForgetPassword';
import ResetPassword from './pages/Password/ResetPassword';
import Checkout from './pages/Payment/Checkout';
import CheckoutFailure from './pages/Payment/CheckoutFailure';
import CheckoutSuccess from './pages/Payment/CheckoutSuccess';
import Signin from './pages/SignIn';
import Signup from './pages/Signup';
import EditProfile from './pages/User/EditProfile';
import Profile from './pages/User/Profile';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/courses' element={<CourseList />}/>
      <Route path='/contactus' element={<Contact/>} />
      <Route path='/aboutus' element={<Aboutus/> }/>
      <Route path='/denied' element={<Denied/>} />

      
      <Route path='/forgetpassword' element={<ForgotPassword/> }/>
      <Route path='/reset-password/:resetToken' element={<ResetPassword />} />

      <Route element={<NotRequireAuth />}>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
      </Route>
      

      <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
        <Route path='/courses/description' element={<CourseDescription />}/>
        <Route path='/checkout' element={<Checkout />}/>
        <Route path='/checkout/success' element={<CheckoutSuccess />}/>
        <Route path='/checkout/fail' element={<CheckoutFailure />}/>

        <Route path='/user/changepassword' element={<ChangePassword />} />

        <Route path='/user/profile' element={<Profile/>}/>
        <Route path='/user/editprofile' element={<EditProfile/>}/>
        <Route path='/course/displaylectures' element={<DisplayLectures />}/>


      </Route>

      <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          {/*admin dashboard pending*/}
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/course/addlecture' element={<AddLecture/>}/>
        <Route path='/course/create' element={<CreateCourse />}/>
      </Route>

      <Route path='*' element={<Notfound />}/>
    </Routes>
 
  )
}

export default App
