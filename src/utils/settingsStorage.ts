import type { PomodoroSettings, TimeSettings, TimeType } from '@/types';

// 保存設定到 Chrome Storage
export const saveSettings = async (
  pomodoroSettings: PomodoroSettings
): Promise<void> => {
  try {
    await chrome.storage.sync.set({
      pomodoroSettings,
    });
    console.log('設定已保存成功');
  } catch (error) {
    console.error('保存設定失敗:', error);
    throw error;
  }
};

// 從 Chrome Storage 載入設定
export const loadSettings = async (): Promise<PomodoroSettings | null> => {
  try {
    const result = await chrome.storage.sync.get(['pomodoroSettings']);
    return result.pomodoroSettings;
  } catch (error) {
    console.error('載入設定失敗:', error);
    return null;
  }
};

// 獲取預設設定
export const getDefaultSettings = (): PomodoroSettings => {
  return {
    timeSettings: [
      {
        focusTime: { minutes: 25, seconds: 0 },
        breakTime: { minutes: 5, seconds: 0 },
      },
    ],
  };
};

// 轉換函數 - 將時間設定轉為秒數
export const timeSettingsToSeconds = (timeSettings: TimeSettings): number => {
  return timeSettings.minutes * 60 + timeSettings.seconds;
};

// 獲取當前應該使用的時間設定
export const getCurrentTimeSettings = async (options: {
  cycleIndex?: number;
  timeType: TimeType;
}) => {
  const { cycleIndex = 0, timeType } = options;
  const settings = await loadSettings();
  const { timeSettings = [] } = settings || {};

  if (timeSettings.length === 0) {
    const defaultSettings = getDefaultSettings();
    return timeType === 'focus'
      ? defaultSettings.timeSettings[0].focusTime
      : defaultSettings.timeSettings[0].breakTime;
  }

  const cycle = timeSettings[cycleIndex] || timeSettings[0];
  return timeType === 'focus' ? cycle.focusTime : cycle.breakTime;
};

export const getTotalCycles = async (): Promise<number> => {
  const settings = await loadSettings();
  return settings?.timeSettings?.length || 1;
};
