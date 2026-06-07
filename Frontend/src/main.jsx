
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import MainRouter from './Router/MainRouter'
import { ThemeProvider } from './context/ThemeContext'
import '../public/css/global.css'
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  </ThemeProvider>



)
