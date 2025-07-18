import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      components: {
        Card: {
          paddingLG: 16,
          paddingMD: 12,
          paddingSM: 8,
          paddingXS: 4,
        },
      },
    }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
