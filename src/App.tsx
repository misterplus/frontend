import { useState } from "react";
import "./App.css";

function App() {
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
    </div>
  );
}

export default App;
