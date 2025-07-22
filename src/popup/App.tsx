import { Button, Card, Space, Typography } from "antd";
import { useEffect, useState } from "react"
import TimeProgress from "./TimeProgress";
import { PauseCircleOutlined, PlayCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useTimeCounter } from "@/hooks/useTimeCounter";

const { Title } = Typography;

const getNow = () => new Date().toLocaleTimeString('zh-TW', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
})

function App() {
  const [currentTime, setCurrentTime] = useState(getNow())
  const { timeLeft, isRunning, initialTime, onStartTimer, onPauseTimer } = useTimeCounter()
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
      <TimeProgress timeLeft={timeLeft} isRunning={isRunning} initialTime={initialTime} />
      <Space>
        <Button
          icon={<PlayCircleOutlined />}
          onClick={onStartTimer}
        >
          開始
        </Button>
        <Button
          icon={<PauseCircleOutlined />}
          onClick={onPauseTimer}
        >
          暫停
        </Button>
        <Button
          icon={<SettingOutlined />}
          onClick={() => {
            chrome.runtime.sendMessage({
              type: "open-options",
            });
          }}
        />
      </Space>
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


