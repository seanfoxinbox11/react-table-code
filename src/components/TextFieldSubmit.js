import { useState } from 'react';
import './TextFieldSubmit.css';

function TextFieldSubmit(props) {

  const [text, setText] = useState("");

  const onChange = (event) => {
    setText(event.target.value);
  }

  const onSubmit = (event) => {
    event.preventDefault();

    props.submitCallback(text);
  }

  return (
    <div>      
      <form onSubmit={onSubmit}>
        <input 
          className="text-input" 
          type="text" 
          value={text} 
          onChange={onChange}								
			  />	
        <input type="Submit"  />
      </form>      
    </div>
  );
}
export default TextFieldSubmit;