import { TimerState, TimeType } from '@/types';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import {
  getCurrentTimeSettings,
  timeSettingsToSeconds,
  getTotalCycles,
} from '@/utils/settingsStorage';

const saveState = async (state: TimerState) => {
  try {
    await chrome.storage.local.set({
      pomodoroTimer: {
        ...state,
        lastUpdate: Date.now(),
      },
    });
  } catch (error) {
    console.error('保存狀態失敗:', error);
  }
};

const loadState = async (): Promise<TimerState | null> => {
  try {
    const result = await chrome.storage.local.get(['pomodoroTimer']);
    return result.pomodoroTimer || null;
  } catch (error) {
    console.error('載入狀態失敗:', error);
    return null;
  }
};

// 預設狀態
const getDefaultState = (): TimerState => ({
  timeLeft: 25 * 60,
  isRunning: false,
  currentCycle: 0,
  totalCycles: 1,
  focusTimeType: 'focus',
});

export const useTimeCounter = () => {
  // 統一的計時器狀態
  const [timerState, setTimerState] = useState<TimerState>(getDefaultState());
  const [initialTime, setInitialTime] = useState(25 * 60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 更新狀態的輔助函數
  const updateTimerState = (updates: Partial<TimerState>) => {
    setTimerState(prev => ({ ...prev, ...updates }));
  };

  // 初始化：載入設定和狀態
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        // 載入總週期數
        const cycles = await getTotalCycles();

        // 載入已保存的狀態
        const savedState = await loadState();

        if (savedState) {
          const {
            timeLeft: savedTimeLeft,
            isRunning: savedIsRunning,
            startTime,
            lastUpdate,
            currentCycle: savedCurrentCycle = 0,
            focusTimeType: savedTimeType = 'focus',
            totalCycles: savedTotalCycles = cycles,
          } = savedState;

          // 載入對應的時間設定
          const timeSettings = await getCurrentTimeSettings({
            cycleIndex: savedCurrentCycle,
            timeType: savedTimeType,
          });
          const initialSeconds = timeSettingsToSeconds(timeSettings);
          setInitialTime(initialSeconds);

          if (savedIsRunning && startTime && lastUpdate) {
            const elapsedSeconds = Math.floor((Date.now() - lastUpdate) / 1000);
            const updatedTimeLeft = Math.max(0, savedTimeLeft - elapsedSeconds);

            setTimerState({
              timeLeft: updatedTimeLeft,
              isRunning: updatedTimeLeft > 0,
              currentCycle: savedCurrentCycle,
              totalCycles: savedTotalCycles,
              focusTimeType: savedTimeType,
              startTime,
            });
            return;
          }
          setTimerState({
            timeLeft: savedTimeLeft,
            isRunning: savedIsRunning,
            currentCycle: savedCurrentCycle,
            totalCycles: savedTotalCycles,
            focusTimeType: savedTimeType,
            startTime,
          });
        } else {
          // 沒有保存狀態，使用預設設定
          const timeSettings = await getCurrentTimeSettings({
            cycleIndex: 0,
            timeType: 'focus',
          });
          const initialSeconds = timeSettingsToSeconds(timeSettings);

          setInitialTime(initialSeconds);
          setTimerState({
            timeLeft: initialSeconds,
            isRunning: false,
            currentCycle: 0,
            totalCycles: cycles,
            focusTimeType: 'focus',
          });
        }
      } catch (error) {
        console.error('初始化計時器失敗:', error);
        setTimerState(getDefaultState());
        setInitialTime(25 * 60);
      }
    };

    initializeTimer();
  }, []);

  // 倒數計時邏輯
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimerState(prevState => {
          const newTime = prevState.timeLeft - 1;

          if (newTime <= 0) {
            const completedState = {
              ...prevState,
              timeLeft: 0,
              isRunning: false,
            };

            // 保存完成狀態
            saveState(completedState);
            console.log(
              `${
                prevState.focusTimeType === 'focus' ? '專注時間' : '休息時間'
              }結束！`
            );

            return completedState;
          }

          // 每秒保存狀態
          const updatedState = {
            ...prevState,
            timeLeft: newTime,
            startTime: Date.now() - (initialTime - newTime) * 1000,
          };

          saveState(updatedState);
          return updatedState;
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
  }, [timerState.isRunning, timerState.timeLeft, initialTime]);

  // 切換到下一個階段（專注 -> 休息 -> 下一組專注）
  const nextPhase = async () => {
    try {
      let nextCycle = timerState.currentCycle;
      let nextTimeType: TimeType =
        timerState.focusTimeType === 'focus' ? 'break' : 'focus';

      // 如果從休息時間切換到專注時間，且不是最後一組，則進入下一組
      if (
        timerState.focusTimeType === 'break' &&
        timerState.currentCycle < timerState.totalCycles - 1
      ) {
        nextCycle = timerState.currentCycle + 1;
        nextTimeType = 'focus';
      }

      // 載入新階段的時間設定
      const timeSettings = await getCurrentTimeSettings({
        cycleIndex: nextCycle,
        timeType: nextTimeType,
      });
      const newInitialTime = timeSettingsToSeconds(timeSettings);

      setInitialTime(newInitialTime);

      const newState = {
        timeLeft: newInitialTime,
        isRunning: false,
        currentCycle: nextCycle,
        totalCycles: timerState.totalCycles,
        focusTimeType: nextTimeType,
      };

      setTimerState(newState);
      await saveState(newState);
    } catch (error) {
      console.error('切換階段失敗:', error);
    }
  };

  // 重置到第一組專注時間
  const resetToStart = async () => {
    try {
      const timeSettings = await getCurrentTimeSettings({
        cycleIndex: 0,
        timeType: 'focus',
      });
      const newInitialTime = timeSettingsToSeconds(timeSettings);

      setInitialTime(newInitialTime);

      const resetState = {
        timeLeft: newInitialTime,
        isRunning: false,
        currentCycle: 0,
        totalCycles: timerState.totalCycles,
        focusTimeType: 'focus' as TimeType,
      };

      setTimerState(resetState);
      await saveState(resetState);
    } catch (error) {
      console.error('重置計時器失敗:', error);
    }
  };

  const onStartTimer = () => {
    const startedState = {
      ...timerState,
      isRunning: true,
      startTime: Date.now(),
    };

    setTimerState(startedState);
    saveState(startedState);
  };

  const onPauseTimer = () => {
    const pausedState = {
      ...timerState,
      isRunning: false,
    };

    setTimerState(pausedState);
    saveState(pausedState);
  };

  return {
    // 解構狀態以便使用
    timeLeft: timerState.timeLeft,
    isRunning: timerState.isRunning,
    currentCycle: timerState.currentCycle,
    isFocusTime: timerState.focusTimeType === 'focus',
    totalCycles: timerState.totalCycles,
    initialTime,

    // 完整狀態對象（如果需要的話）
    timerState,

    // 控制函數
    onStartTimer,
    onPauseTimer,
    nextPhase,
    resetToStart,
    updateTimerState,
  };
};
