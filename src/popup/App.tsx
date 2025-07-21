import { Card, Typography } from "antd";
import { useEffect, useState } from "react"
import TimeProgress from "./TimeProgress";

const { Title } = Typography;

const getNow = () => new Date().toLocaleTimeString('zh-TW', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
})

function App() {
  const [currentTime, setCurrentTime] = useState(getNow())
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getNow())
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
      <TimeProgress />
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
