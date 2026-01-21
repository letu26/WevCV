import { BrowserRouter, Route, Routes } from 'react-router'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import UserLayout from './layout/user/UserLayout'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import Contact from './pages/Contact'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/about' element={<About />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
