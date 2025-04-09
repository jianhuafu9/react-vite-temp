/**
 * 精确计时工具函数
 * 解决浏览器setTimeout和setInterval计时不准确的问题
 */

/**
 * 创建一个精确的倒计时器
 * @param duration 倒计时总时长（毫秒）
 * @param onTick 每次计时更新的回调函数，参数为剩余时间（毫秒）
 * @param onComplete 倒计时结束时的回调函数
 * @param tickInterval 更新间隔（毫秒），默认为1000ms
 * @returns 包含start、pause、resume和stop方法的控制器对象
 */
export const createPreciseCountdown = (
  duration: number,
  onTick: (remainingTime: number) => void,
  onComplete?: () => void,
  tickInterval: number = 1000
) => {
  let startTime: number = 0;
  let remaining: number = duration;
  let timerId: number | null = null;
  let pauseTime: number | null = null;
  
  // 使用requestAnimationFrame实现更精确的计时
  const tick = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    
    const elapsed = timestamp - startTime;
    const newRemaining = Math.max(0, remaining - elapsed);
    
    // 只在时间变化足够大时才触发回调，减少不必要的更新
    if (Math.floor(remaining / tickInterval) !== Math.floor(newRemaining / tickInterval)) {
      onTick(newRemaining);
    }
    
    remaining = newRemaining;
    
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    
    timerId = requestAnimationFrame(tick);
  };
  
  return {
    /**
     * 开始倒计时
     */
    start: () => {
      if (timerId !== null) return;
      startTime = 0;
      remaining = duration;
      timerId = requestAnimationFrame(tick);
    },
    
    /**
     * 暂停倒计时
     */
    pause: () => {
      if (timerId === null) return;
      cancelAnimationFrame(timerId);
      timerId = null;
      pauseTime = performance.now();
    },
    
    /**
     * 恢复倒计时
     */
    resume: () => {
      if (timerId !== null || pauseTime === null) return;
      startTime = 0;
      timerId = requestAnimationFrame(tick);
      pauseTime = null;
    },
    
    /**
     * 停止倒计时
     */
    stop: () => {
      if (timerId === null) return;
      cancelAnimationFrame(timerId);
      timerId = null;
      remaining = duration;
      pauseTime = null;
    },
    
    /**
     * 获取当前剩余时间
     */
    getRemainingTime: () => remaining
  };
};

/**
 * 创建一个精确的定时器（类似setInterval，但更精确）
 * @param callback 定时执行的回调函数
 * @param interval 时间间隔（毫秒）
 * @returns 包含start和stop方法的控制器对象
 */
export const createPreciseInterval = (
  callback: () => void,
  interval: number
) => {
  let expectedTime: number = 0;
  let timerId: number | null = null;
  
  const tick = () => {
    const now = performance.now();
    const drift = now - expectedTime;
    
    callback();
    
    // 计算下一次执行的时间点，考虑漂移进行修正
    expectedTime += interval;
    
    // 如果漂移太大，重置期望时间
    if (drift > interval) {
      expectedTime = now + interval;
    }
    
    // 计算下一次需要等待的时间
    const nextTick = Math.max(0, interval - drift);
    timerId = window.setTimeout(tick, nextTick);
  };
  
  return {
    /**
     * 开始定时器
     */
    start: () => {
      if (timerId !== null) return;
      expectedTime = performance.now() + interval;
      timerId = window.setTimeout(tick, interval);
    },
    
    /**
     * 停止定时器
     */
    stop: () => {
      if (timerId === null) return;
      clearTimeout(timerId);
      timerId = null;
    }
  };
};

/**
 * 格式化时间为 HH:MM:SS 格式
 * @param milliseconds 毫秒数
 * @returns 格式化后的时间字符串
 */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const format = (num: number) => num.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  }
  
  return `${format(minutes)}:${format(seconds)}`;
};

/**
 * 使用示例：
 * 
 * // 创建一个10秒的倒计时
 * const countdown = createPreciseCountdown(
 *   10000, // 10秒
 *   (remainingTime) => {
 *     // 更新UI显示
 *     console.log(`剩余时间: ${formatTime(remainingTime)}`);
 *   },
 *   () => {
 *     console.log('倒计时结束！');
 *   }
 * );
 * 
 * // 开始倒计时
 * countdown.start();
 * 
 * // 暂停倒计时
 * // countdown.pause();
 * 
 * // 恢复倒计时
 * // countdown.resume();
 * 
 * // 停止倒计时
 * // countdown.stop();
 */