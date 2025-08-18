import { Button, Card, Space } from 'antd';
import TimeProgress from './TimeProgress';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useTimeCounter } from '@/hooks/useTimeCounter';
import CurrentTime from './CurrentTime';
import { useState } from 'react';
import Settings from './Settings';

function App() {
  const [isSettings, setIsSettings] = useState(false);
  const {
    timeLeft,
    isRunning,
    initialTime,
    currentCycle,
    isFocusTime,
    totalCycles,
    onStartTimer,
    onPauseTimer,
    resetToStart,
  } = useTimeCounter();

  const onToggleSettings = () => {
    setIsSettings(!isSettings);
  };

  if (isSettings) {
    return <Settings onToggleSettings={onToggleSettings} />;
  }
  return (
    <Card
      style={{
        background: '#fff',
        borderRadius: '8px',
        textAlign: 'center',
        padding: '12px',
      }}
    >
      <TimeProgress
        timeLeft={timeLeft}
        isRunning={isRunning}
        initialTime={initialTime}
        currentCycle={currentCycle}
        isFocusTime={isFocusTime}
        totalCycles={totalCycles}
      />
      <Space>
        {!isRunning ? (
          <>
            <Button icon={<PlayCircleOutlined />} onClick={onStartTimer}>
              開始
            </Button>
            <Button icon={<SettingOutlined />} onClick={onToggleSettings} />
          </>
        ) : (
          <>
            <Button icon={<UndoOutlined />} onClick={resetToStart}>
              重置
            </Button>
            <Button icon={<PauseCircleOutlined />} onClick={onPauseTimer}>
              暫停
            </Button>
          </>
        )}
      </Space>
      <CurrentTime />
    </Card>
  );
}

export default App;
