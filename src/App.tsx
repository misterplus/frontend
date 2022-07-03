import { useState } from "react";
import "./App.css";

function App() {
  const [base64, setBase64] = useState<string>();
  const [scale, setScale] = useState<number>(1);
  const [baseX, setBaseX] = useState<number>(0);
  const [baseY, setBaseY] = useState<number>(0);
  function scaleToFit(canvas: any, img: any) {
    const c = canvas.getContext("2d");
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    c.drawImage(img, x, y, img.width * scale, img.height * scale);
    setScale(scale);
    setBaseX(x);
    setBaseY(y);
  };
  const onFileUploaded = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          if (reader.result != null) {
            setBase64(reader.result.toString().split("base64,")[1]);
            const canvas: any = document.getElementById("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (canvas != null) {
              const image = new Image();
              image.onload = function () {
                scaleToFit(canvas, this);
              }
              image.src = reader.result.toString();
            }
          }
        },
        false
      );
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      feed: {
        image: base64,
        threshold: Number(e.target[1].value),
        size: Number(e.target[2].value),
      },
    };
    const res = await fetch(
      "http://192.168.216.1:9393/FaceDetection/prediction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const json: any = await res.json();
    const result = json["result"];
    const canvas: any = document.getElementById("canvas");
    const c = canvas.getContext("2d");
    c.translate(baseX, baseY);
    for (let index = 0; index < result.size; index++) {
      const face = result.faces[index];
      const threshold: number = Math.floor(face[0] * 100) / 100;
      const x: number = face[1] * scale;
      const y: number = face[2] * scale;
      const width: number = face[3] * scale - x;
      const height: number = face[4] * scale - y;

      c.strokeStyle = "rgb(255, 255, 0)";
      c.lineWidth = "3";
      c.strokeRect(x, y, width, height);

      c.fillStyle = "rgb(255, 255, 0)";
      c.fillRect(x - 1, y - 8, 21, 8);

      c.fillStyle = "rgb(0, 0, 255)";
      c.font = "10px serif";
      c.textBaseline = "buttom";
      c.fillText(threshold, x, y);
    }
  };

  return (
    <div className="App">
      <form onSubmit={onFormSubmit}>
        <input type="file" onChange={onFileUploaded} />
        <label>Threshold</label>
        <input />
        <label>Size</label>
        <input />
        <input type="submit" value="检测" />
      </form>
      <canvas id="canvas" width="1280" height="720"></canvas>
    </div>
  );
}

export default App;
