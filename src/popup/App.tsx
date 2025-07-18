import { Button, Card, Progress, Space, Typography } from "antd";
import { useEffect, useState } from "react"

const { Title } = Typography;

function App() {
  const [ currentTime, setCurrentTime ] = useState('')
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('zh-TW', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
    return () => clearInterval(interval)
  }, [])
 
  return (
    <Card 
    style={{ 
      background: '#000', 
      borderRadius: '8px',
      textAlign: 'center',
      padding: '12px'
    }}
  >
    <Title 
      level={2}
      style={{
        color: '#00ff00',
        fontFamily: 'Courier New, monospace',
        margin: 0,
        fontSize: '24px',
        letterSpacing: '2px'
      }}
    >
      {currentTime}
    </Title>
  </Card>
  )
}

export default App
