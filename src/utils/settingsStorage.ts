import type {
  CycleSettings,
  PomodoroSettings,
  TimeSettings,
  TimeType,
} from '@/types';

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
export const loadSettings = async (): Promise<CycleSettings[]> => {
  try {
    const result = await chrome.storage.sync.get(['pomodoroSettings']);
    return result.pomodoroSettings ?? [];
  } catch (error) {
    console.error('載入設定失敗:', error);
    return [];
  }
};

// 獲取預設設定
export const getDefaultSettings = (): CycleSettings[] => {
  return [
    {
      focusTime: { minutes: 25, seconds: 0 },
      breakTime: { minutes: 5, seconds: 0 },
    },
  ];
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
  if (!settings?.length) {
    const defaultSettings = getDefaultSettings();
    const [firstSetting] = defaultSettings;

    return {
      timeSettings:
        timeType === 'focus' ? firstSetting.focusTime : firstSetting.breakTime,
      cycleIndex: 0,
      totalCycles: 1,
    };
  }

  const cycle = settings[cycleIndex] || settings[0];
  return {
    timeSettings: timeType === 'focus' ? cycle.focusTime : cycle.breakTime,
    cycleIndex,
    totalCycles: settings.length,
  };
};
