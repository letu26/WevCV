import { BrowserRouter, Route, Routes } from 'react-router'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
