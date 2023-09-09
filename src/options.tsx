import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

const Options = () => {
  return <h1>Nothing here.</h1>;
};

export default Options;

ReactDOM.render(
  <StrictMode>
    <Options />,
  </StrictMode>,
  document.getElementById('app')
);
