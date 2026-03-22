import React, { use, useState } from "react";

const Help = () => {
  const [text, setText] = useState("adadjsdadnajnj");

  return (
    <div>
      {text}
      <Counter />
    </div>
  );
};

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={increment}>Click to add +1 </button>
    </div>
  );
};

export default Help;

//  return (
//   <div>
//     <p>Counter:</p>
//     <button onClick={() => setCount3(count3 + 1)}
//   </div>
//  )
