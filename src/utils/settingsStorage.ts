import type { PomodoroSettings } from "@/types";

// 保存設定到 Chrome Storage
export const saveSettings = async (pomodoroSettings: PomodoroSettings): Promise<void> => {
  try {
    await chrome.storage.sync.set({
      pomodoroSettings,
    });
    console.log('設定已保存成功');
  } catch (error) {
    console.error("保存設定失敗:", error);
    throw error;
  }
};

// 從 Chrome Storage 載入設定
export const loadSettings = async (): Promise<PomodoroSettings|null > => {
  try {
    const result = await chrome.storage.sync.get(["pomodoroSettings"]);
    return result.pomodoroSettings ;
  } catch (error) {
    console.error("載入設定失敗:", error);
    return null;
  }
};

// 獲取預設設定
export const getDefaultSettings = (): PomodoroSettings => {
  return {
    timeSettings: [
      {
        focusTime: { minutes: 25, seconds: 0 },
        breakTime: { minutes: 5, seconds: 0 }
      }
    ]
  };
}; 