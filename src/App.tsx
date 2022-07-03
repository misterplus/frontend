import { getValue } from "@testing-library/user-event/dist/utils";
import { useState,useRef, useEffect } from "react";
import "./App.css";

function App() {
  let list1 = {
    "result": {
      "faces": [
        [
          0.9999759197235107, 850.659912109375, 108.3956298828125,
          888.791259765625, 156.11343383789062
        ],
        [
          0.999924898147583, 342.0315856933594, 155.73406982421875,
          383.3677673339844, 207.27200317382812
        ],
        [
          0.9998961687088013, 476.92156982421875, 137.25442504882812,
          517.1512451171875, 183.77391052246094
        ]
      ],
      "size": 3
    }
  }
  const canvasRef = useRef(null)
  const [img, setImg] = useState<string>();
  const [base64, setBase64] = useState<string>();
  const onFileUploaded = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          if (reader.result != null) {
            setImg(reader.result.toString());
            setBase64(reader.result.toString().split("base64,")[1]);
            const canvas : any = document.getElementById("canvas");
            canvas.height=canvas.height;
            const url = "http://192.168.216.1:9393/FaceDetection/prediction";
            if (canvas != null){
              const image = new Image();
              image.src = reader.result.toString();
              image.onload = function(){
                const c = canvas.getContext('2d');
                c.drawImage(this,0,0);
                c.strokeStyle = 'rgb(255, 255, 0)';
                let i = Number(list1.result.size);
                let index = 0;
                // let crate = (document.getElementById("c_rate") as HTMLInputElement).value;
                // let csize = (document.getElementById("c_size") as HTMLInputElement).value;
                // console.log(crate);
                // console.log(csize);
                const promise = fetch(url).then(function(response){
                  if(response.status == 200){
                    return response.json;
                  }else{
                    console.log("fail1");
                    return{};
                  }
                })
                promise = promise.then(function(data){
                  console.log(data);
                })
                for(index=0;index<i;index=index+1){
                 let rate : any = Number(list1.result.faces[index][0]);
                 let x1 :any = Number(list1.result.faces[index][1]);
                 let y1 :any = Number(list1.result.faces[index][2]);
                 let x2 :any = Number(list1.result.faces[index][3]);
                 let y2 :any = Number(list1.result.faces[index][4]);
                 c.beginPath();
                 c.moveTo(x1,y1);
                 c.lineTo(x2,y1);
                 c.lineTo(x2,y2);
                 c.lineTo(x1,y2);
                 c.lineTo(x1,y1);
                 c.stroke();
                 c.fillStyle = 'rgb(255, 255, 0)';
                 c.beginPath();
                 c.moveTo(x1,y1);
                 c.lineTo(x1,y1-8);
                 c.lineTo(x1+20,y1-8);
                 c.lineTo(x1+20,y1);
                 c.fill()
                 c.fillStyle = 'rgb(0, 0, 255)';
                 c.font = "10px serif";
                 c.textBaseline = "buttom";
                 c.fillText(rate, x1, y1);
               }
              }
            }
          }
        },
        false
      );
      reader.readAsDataURL(file);
    }
  };

  const onClick = () => {
    console.log(img);
    console.log(base64);
  }

  

  return (
    <div className="App">
      <input type="file" onChange={onFileUploaded} />
      <button onClick={onClick}>show base64</button>
      <label>Rate</label>
      <input id="c_rate" value=""></input>
      <label>Size</label>
      <input id="c_size" value=""></input>
      <canvas id="canvas" width="1920" height="1920"></canvas>

    </div>

  );
}

export default App;
