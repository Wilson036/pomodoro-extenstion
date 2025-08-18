// 番茄鐘 Service Worker

// 1. 擴展圖標點擊處理
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// 2. 安裝/更新時的初始化
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    console.log('番茄鐘擴展已安裝');
    // 設置預設設定
    chrome.storage.sync.set({
      pomodoroSettings: {
        timeSettings: [
          {
            focusTime: { minutes: 25, seconds: 0 },
            breakTime: { minutes: 5, seconds: 0 },
          },
        ],
      },
    });
  }
});

// 3. 定時器結束通知
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIMER_FINISHED') {
    const { phase, cycle } = message.data;

    // 創建通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon.png',
      title: '番茄鐘提醒',
      message:
        phase === 'focus'
          ? `🍅 專注時間結束！第 ${cycle + 1} 組完成，該休息了～`
          : `☕ 休息時間結束！準備開始下一輪專注～`,
    });

    // 播放提示音（如果需要）
    // chrome.tts.speak(message.message);

    sendResponse({ success: true });
  }

  if (message.type === 'GET_TIMER_STATE') {
    // 從 storage 獲取計時器狀態
    chrome.storage.local.get(['pomodoroTimer'], result => {
      sendResponse({ timerState: result.pomodoroTimer });
    });
    return true; // 保持訊息通道開啟
  }
});

// 4. 徽章顯示（顯示剩餘時間）
const updateBadge = (timeLeft, isRunning) => {
  if (!isRunning || timeLeft <= 0) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  const minutes = Math.floor(timeLeft / 60);
  const badgeText = minutes > 99 ? '99+' : minutes.toString();

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: '#FF6B6B' });
};

// 只在計時器運行時保持活躍
let keepAliveInterval = null;

const startKeepAlive = () => {
  if (!keepAliveInterval) {
    keepAliveInterval = setInterval(() => {
      chrome.runtime.getPlatformInfo(() => {});
    }, 25000);
  }
};

const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
};

// 監聽計時器狀態變化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.pomodoroTimer) {
    const timerState = changes.pomodoroTimer.newValue;

    if (timerState?.isRunning) {
      startKeepAlive(); // 計時器運行時保持活躍
    } else {
      stopKeepAlive(); // 計時器停止時允許休眠
    }
  }
});

// 7. 快捷鍵處理
chrome.commands.onCommand.addListener(command => {
  switch (command) {
    case 'toggle-timer':
      // 發送訊息給 popup 切換計時器
      chrome.runtime.sendMessage({ type: 'TOGGLE_TIMER' });
      break;
    case 'reset-timer':
      chrome.runtime.sendMessage({ type: 'RESET_TIMER' });
      break;
  }
});

console.log('番茄鐘 Service Worker 已啟動');
