import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const Options = () => {
  return <div className="display-1">Nothing here.</div>;
};

ReactDOM.render(
  <StrictMode>
    <Options />,
  </StrictMode>,
  document.getElementById('app')
);
