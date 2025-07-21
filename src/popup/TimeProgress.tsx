import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Progress, Space } from "antd";
import { useEffect, useRef, useState } from "react";

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  startTime?: number; // 開始時間戳記，用於計算經過時間
  lastUpdate?: number; // 最後更新時間戳記，用於計算經過時間
}

// 保存狀態到 Chrome Storage
const saveState = async (state: TimerState) => {
  try {
    await chrome.storage.local.set({
      pomodoroTimer: {
        ...state,
        lastUpdate: Date.now(),
      },
    });
  } catch (error) {
    console.error("保存狀態失敗:", error);
  }
};

// 從 Chrome Storage 載入狀態
const loadState = async (): Promise<TimerState | null> => {
  try {
    const result = await chrome.storage.local.get(["pomodoroTimer"]);
    return result.pomodoroTimer || null;
  } catch (error) {
    console.error("載入狀態失敗:", error);
    return null;
  }
};

const TimeProgress = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分鐘 = 1500秒
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime] = useState(25 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 格式化時間顯示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 計算進度百分比
  const getProgress = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  // 初始化：從 Chrome Storage 載入狀態
  useEffect(() => {
    const initializeTimer = async () => {
      const savedState = await loadState();

      if (savedState) {
        const {
          timeLeft: savedTimeLeft,
          isRunning: savedIsRunning,
          startTime,
          lastUpdate,
        } = savedState;

        if (savedIsRunning && startTime && lastUpdate) {
          // 計算從上次更新到現在經過的時間
          const elapsedSeconds = Math.floor((Date.now() - lastUpdate) / 1000);
          const updatedTimeLeft = Math.max(0, savedTimeLeft - elapsedSeconds);

          setTimeLeft(updatedTimeLeft);
          setIsRunning(updatedTimeLeft > 0); // 如果時間耗盡則停止
        } else {
          setTimeLeft(savedTimeLeft);
          setIsRunning(savedIsRunning);
        }
      }
    };

    initializeTimer();
  }, []);

  // 倒數計時邏輯
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime <= 0) {
            setIsRunning(false);
            // 保存完成狀態
            saveState({
              timeLeft: 0,
              isRunning: false,
            });
            console.log("番茄鐘結束！");
            return 0;
          }

          // 每秒保存狀態
          saveState({
            timeLeft: newTime,
            isRunning: true,
            startTime: Date.now() - (initialTime - newTime) * 1000,
          });

          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, initialTime]);
  return (
    <>
      <Progress
        type="circle"
        percent={getProgress()}
        size={150}
        strokeColor={timeLeft === 0 ? "#52c41a" : "#ff6b6b"}
        format={() => (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                fontFamily: "monospace",
                color: timeLeft === 0 ? "#52c41a" : "#ff6b6b",
              }}
            >
              {formatTime(timeLeft)}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "4px",
              }}
            >
              {timeLeft === 0 ? "完成！" : isRunning ? "進行中" : "暫停"}
            </div>
          </div>
        )}
      />
      <Space>
        <Button
          icon={<PlayCircleOutlined />}
          onClick={() => {
            setIsRunning(true);
            saveState({
              timeLeft: initialTime,
              isRunning: true,
              startTime: Date.now(),
            });
          }}
        >
          開始
        </Button>
        <Button
          icon={<PauseCircleOutlined />}
          onClick={() => {
            setIsRunning(false);
            saveState({
              timeLeft: timeLeft ?? 25 * 60,
              isRunning: false,
              startTime: Date.now() - (initialTime - timeLeft) * 1000,
            });
          }}
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
    </>
  );
};

export default TimeProgress;
