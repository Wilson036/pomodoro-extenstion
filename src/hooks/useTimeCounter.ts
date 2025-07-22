import { useEffect, useState } from "react";
import { useRef } from "react";
import { TimerState } from "../../dist/src/types";

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

export const useTimeCounter = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime] = useState(25 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const onStartTimer = () => {
    setIsRunning(true);
    saveState({
      timeLeft: initialTime,
      isRunning: true,
      startTime: Date.now(),
    });
  };

  const onPauseTimer = () => {
    setIsRunning(false);
    saveState({
      timeLeft: timeLeft ?? 25 * 60,
      isRunning: false,
      startTime: Date.now() - (initialTime - timeLeft) * 1000,
    });
  };

  return { timeLeft, isRunning, initialTime, onStartTimer, onPauseTimer };
};
