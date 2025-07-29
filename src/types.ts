export type TimerState = {
  timeLeft: number;
  isRunning: boolean;
  startTime?: number;
  lastUpdate?: number;
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
  timeSettings: CycleSettings[];
};
