import React, { useState, useEffect } from 'react';
import { createPreciseInterval } from '@/utils';
import './style.css';

type LightColor = 'red' | 'yellow' | 'green';

interface TrafficLightProps {
  redDuration?: number;    // 红灯持续时间（毫秒）
  yellowDuration?: number; // 黄灯持续时间（毫秒）
  greenDuration?: number;  // 绿灯持续时间（毫秒）
}

const TrafficLight: React.FC<TrafficLightProps> = ({
  redDuration = 5000,    // 默认5秒
  yellowDuration = 2000, // 默认2秒
  greenDuration = 5000   // 默认5秒
}) => {
  const [currentLight, setCurrentLight] = useState<LightColor>('red');
  const [timeLeft, setTimeLeft] = useState<number>(redDuration);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // 获取当前灯的持续时间
  const getCurrentDuration = (color: LightColor): number => {
    switch(color) {
      case 'red': return redDuration;
      case 'yellow': return yellowDuration;
      case 'green': return greenDuration;
    }
  };
  
  // 获取下一个灯的颜色
  const getNextLight = (current: LightColor): LightColor => {
    switch(current) {
      case 'red': return 'green';
      case 'green': return 'yellow';
      case 'yellow': return 'red';
    }
  };
  
  useEffect(() => {
    // 创建倒计时控制器
    const countdownController = createPreciseInterval(() => {
      if (isPaused) return;
      
      setTimeLeft(prev => {
        // 时间到了，切换到下一个灯
        if (prev <= 1000) {
          const nextLight = getNextLight(currentLight);
          setCurrentLight(nextLight);
          return getCurrentDuration(nextLight);
        }
        // 否则继续倒计时
        return prev - 1000;
      });
    }, 1000);
    
    // 启动定时器
    countdownController.start();
    
    // 组件卸载时清理定时器
    return () => {
      countdownController.stop();
    };
  }, [currentLight, isPaused, redDuration, yellowDuration, greenDuration]);
  
  // 格式化时间显示
  const formatTime = (ms: number): string => {
    return (ms / 1000).toFixed(0);
  };
  
  // 暂停/继续切换
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <div className="traffic-light-container">
      <div className="traffic-light">
        <div className={`light red ${currentLight === 'red' ? 'active' : ''}`}></div>
        <div className={`light yellow ${currentLight === 'yellow' ? 'active' : ''}`}></div>
        <div className={`light green ${currentLight === 'green' ? 'active' : ''}`}></div>
      </div>
      
      <div className="traffic-light-controls">
        <div className="timer">
          {formatTime(timeLeft)}秒
        </div>
        <button className="control-button" onClick={togglePause}>
          {isPaused ? '继续' : '暂停'}
        </button>
      </div>
    </div>
  );
};

export default TrafficLight;
