export type TimeType = 'focus' | 'break';

export type TimerState = {
  timeLeft: number;
  isRunning: boolean;
  startTime?: number;
  lastUpdate?: number;
  // 新增週期追蹤
  currentCycle: number; // 當前第幾組 (0-based)
  totalCycles: number; // 總共有幾組
  focusTimeType: TimeType;
};

export type TimeSettings = {
  minutes: number;
  seconds: number;
};

export type CycleSettings = {
  focusTime: TimeSettings;
  breakTime: TimeSettings;
};

export type PomodoroSettings = {
  settings: CycleSettings[];
};
