import TrafficLight from "@/components/TrafficLight";

const About = () => {
  return (
    <div>
      <div className="app-about">
        <div className="title">关于我们</div>
      </div>

      <div className="traffic-light-demo">
        <h2 style={{ textAlign: "center", marginTop: "40px", marginBottom: "20px" }}>
          精确定时器实现的红绿灯演示
        </h2>
        <TrafficLight
          redDuration={5000}
          yellowDuration={2000}
          greenDuration={5000}
        />
        <p style={{ textAlign: "center", margin: "20px 0", color: "#666" }}>
          使用createPreciseInterval实现的精确倒计时红绿灯
        </p>
      </div>

      {/* <div style={{ marginTop: "40px", textAlign: "center" }}>
        <img
          src="./assets/logo.png"
          alt=""
          style={{ maxWidth: "200px" }}
        />
      </div> */}
    </div>
  );
};

export default About;
