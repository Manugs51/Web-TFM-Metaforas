import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBCardText, MDBSpinner, MDBBtn } from 'mdb-react-ui-kit';

function ModeButton(props) {
  return(
    <li>
      <form className="form-check">
        <input type="radio" value={props.mode}
          className="form-check-input"
          name="flexRadioDefault"
          onChange={props.handleRadioChanged}
          checked={props.mode === props.selectedMode}
          disabled={props.mode==='babel_hypernyms'}
        />
        <label className="form-check-label">
           {
              props.mode === 'babel_senses' ?
              'Relación entre sentidos de BabelNet' :
                props.mode === 'babel_categories' ?
                'Relación entre categorías de BabelNet' :
                  props.mode === 'babel_hypernyms' ?
                  'Relación de hiperonimia de BabelNet' :
                  'Otro (en desarrollo)'
            }
        </label>
      </form>
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
    <MDBCard>
      <MDBCardBody>
        <MDBCardTitle>
          Modo de análisis
        </MDBCardTitle>
        <ul>
          {listModes}
        </ul>
      </MDBCardBody>
    </MDBCard>
  );
}

function IntroduceText(props) {
  return (
      <form onSubmit={props.handleSubmit}>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>
              Texto a analizar
            </MDBCardTitle>
            <br/>
            <MDBInput type="textarea" rows="2" label="Texto" icon="pencil-alt" textarea onChange={props.handleFormChange}/>
            <br/> 
            <MDBBtn outline color='dark' type="submit" disabled={props.metaphorToCheck.replace(/\s/g,"") === ""}>
              Enviar
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </form>
  );
}

function OptionalUserKey(props){
  return(
    <MDBCard height="100%">
      <MDBCardBody>
        <MDBCardTitle>
          Clave propia
        </MDBCardTitle>
        <br/>
        <MDBInput label='Clave' type='password' disabled onChange={props.handleKeyChange}/>
        <br/>
      </MDBCardBody>
    </MDBCard>
  );
}

function ShowMetaphor(props) {
  return (
    <MDBCard>
      <MDBCardBody>
        <MDBCardTitle>
          Resultado
        </MDBCardTitle>
        <br/>
        <MDBCardText>
          {props.analizedMetaphor}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

function MetaphorChecker() {
  document.title = "Metaforas";
  const [metaphorToCheck, setMetaphorToCheck] = useState('');
  const [userKey, setUserKey] = useState('');
  const [selectedMode, setMode] = useState(0)
  const [analizedMetaphor, setAnalizedMetaphor] = useState('')
  const availableModes = [
    'babel_senses',
    'babel_categories',
    'babel_hypernyms',
  ]

  function handleFormChange(event) {
    setMetaphorToCheck(event.target.value);
  }
  
  function handleSubmit(event) {
    if (selectedMode) {
      setAnalizedMetaphor(waitingResponse())
      fetch('https://reconocedor-metaforas.azurewebsites.net/api/v1/check?mode=' + 
        selectedMode +
        '&text=' + metaphorToCheck  
      )
        .then(res => res.json())
        .then((data) => {
          setAnalizedMetaphor(data.reason);
        })
        .catch(console.log);
    }
    else {
      alert('No se ha elegido un modo');
    }
    event.preventDefault();
  }

  function handleRadioChanged(event) {
    setMode(event.target.value);
  }

  function handleKeyChange(event) {
    setUserKey(event.target.value);
  }

  function waitingResponse(){
    return(
      <MDBSpinner role='status'>
        <span className='visually-hidden'>Loading...</span>
      </MDBSpinner>
    );
  }

  return (
    <MDBContainer>
      <br/>
      <MDBRow>
        <MDBCol md="7">
          <ModesList
            selectedMode={selectedMode}
            availableModes={availableModes}
            handleRadioChanged={handleRadioChanged}
          />
        </MDBCol>
        <MDBCol md="5">
          <OptionalUserKey 
            handleKeyChange={handleKeyChange}
            userKey={userKey}
          />
        </MDBCol>
      </MDBRow>
      <br/>
      <MDBRow>
        <MDBCol>
          <IntroduceText
            handleSubmit={handleSubmit}
            handleFormChange={handleFormChange}
            metaphorToCheck={metaphorToCheck}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol >
          <ShowMetaphor
            analizedMetaphor={analizedMetaphor}
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

ReactDOM.render(
  <MetaphorChecker />,
  document.getElementById('root')
);