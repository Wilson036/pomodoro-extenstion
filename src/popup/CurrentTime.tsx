import { useEffect, useState } from "react";
import { Typography } from "antd";

const { Title } = Typography;

const getNow = () =>
  new Date().toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(getNow());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getNow());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Title
      level={2}
      style={{
        color: "#00ff00",
        fontFamily: "Courier New, monospace",
        margin: 0,
        fontSize: "24px",
        letterSpacing: "2px",
      }}
    >
      {currentTime}
    </Title>
  );
};

export default CurrentTime;
