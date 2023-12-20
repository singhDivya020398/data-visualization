import './App.css';

import ReportView from './component/ReportView';
function App() {
  return (
  
    <div className="App">
        
      <header className="App-header">
        
        <ReportView dimension="Flavanoids"/>
        <ReportView dimension="Gamma"/>
      </header>
    </div>
  );
}

export default App;
