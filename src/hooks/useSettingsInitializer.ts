import { useEffect, useState } from 'react';
import { CycleSettings } from '@/types';
import { getDefaultSettings, loadSettings } from '@/utils/settingsStorage';

interface UseSettingsInitializerReturn {
  settings: CycleSettings[];
  isLoading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

export const useSettingsInitializer = (): UseSettingsInitializerReturn => {
  const [settings, setSettings] = useState<CycleSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAndInitializeSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const settings = await loadSettings();
      // 初始化設定（如果沒有設定檔會創建預設設定）
      const initializedSettings = getDefaultSettings();
      setSettings(settings || initializedSettings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '初始化設定失敗';
      setError(errorMessage);
      console.error('設定初始化錯誤:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 重新載入設定
      const currentSettings = await loadSettings();
      setSettings(currentSettings);

      console.log('設定重新載入完成:', currentSettings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '重新載入設定失敗';
      setError(errorMessage);
      console.error('重新載入設定錯誤:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化時載入設定
  useEffect(() => {
    loadAndInitializeSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refreshSettings,
  };
};
