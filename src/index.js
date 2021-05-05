import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function ModeButton(props) {
  return(
    <li>
      <div className="radio">
        <label>
          <input type="radio" value={props.mode}
            onChange={props.handleRadioChanged}
            checked={props.mode === props.selectedMode}  
          />
          {props.mode}
        </label>
      </div>
    </li>
  );
}

function ModesList(props) {
  const modes = props.availableModes;
  const listModes = modes.map((mode) =>
    <ModeButton
      key={mode}
      mode={mode}
      handleRadioChanged={props.handleRadioChanged}
      selectedMode={props.selectedMode}
    />
  );
  return (
    <ul>
      {listModes}
    </ul>
  );
}

function UserInput(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <ModesList
        availableModes={props.availableModes}
        selectedMode={props.selectedMode}
        handleRadioChanged={props.handleRadioChanged}
      />
      <label>
        Metáfora:
        <textarea value={props.metaphorToCheck} onChange={props.handleFormChange} />        
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

function ServerOutput() {
  return null
}

function MetaphorChecker() {
  const [metaphorToCheck, setMetaphorToCheck] = useState('Escriba la metáfora a comprobar');
  const [selectedMode, setMode] = useState(0)
  const availableModes = [
    'mode1',
    'mode2',
    'mode3',
  ]

  function handleFormChange(event) {
    setMetaphorToCheck(event.target.value);
  }
  
  function handleSubmit(event) {
    if (selectedMode) {
      fetch('http://127.0.0.1:5000/api/v1/check?mode=' + 
        selectedMode +
        'text=' + metaphorToCheck  
      )
        .then(res => res.json())
        .then((data) => {
          setMetaphorToCheck(data.isMetaphor);
        })
        .catch(console.log)
    }
    else {
      alert('No se ha elegido un modo');
    }
    event.preventDefault();
  }

  function handleRadioChanged(event) {
    setMode(event.target.value);
  }

  return (
    <div>
      <UserInput
        handleSubmit={handleSubmit}
        handleFormChange={handleFormChange}
        metaphorToCheck={metaphorToCheck}
        selectedMode={selectedMode}
        availableModes={availableModes}
        handleRadioChanged={handleRadioChanged}
      />
      <ServerOutput/>
    </div>
  );
}

ReactDOM.render(
  <MetaphorChecker />,
  document.getElementById('root')
);