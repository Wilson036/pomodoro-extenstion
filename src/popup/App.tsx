import {  Card, Typography } from "antd";
import { useEffect, useState } from "react"

const { Title } = Typography;

function App() {
  const [currentTime, setCurrentTime] = useState('')
  const [group, setGroup] = useState(1)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    }, 1000);
    return () => clearInterval(interval)

  }, [])

  useEffect(() => {
    chrome.storage.sync.get(['group'], (result) => {
      console.log(result)
      setGroup(result.group || 1)
    })
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
      {group && <Title level={4} style={{ color: '#00ff00' }}>組數：{group}</Title>}
    </Card>
  )
}

export default App
