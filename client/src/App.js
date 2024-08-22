import logo from './logo.svg';
import './App.css';
import {Events} from './Events.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Events events={ [1,2,3] } />
    </div>
  );
}

export default App;
