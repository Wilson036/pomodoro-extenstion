import { Progress } from "antd";

interface TimeProgressProps {
  timeLeft: number;
  isRunning: boolean;
  initialTime: number;
}

// 格式化時間顯示
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const TimeProgress = ({
  timeLeft,
  isRunning,
  initialTime,
}: TimeProgressProps) => {
  // 計算進度百分比
  const getProgress = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

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
    </>
  );
};

export default TimeProgress;
