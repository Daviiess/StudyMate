import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const mount = document.getElementById('modal-root');
  return mount ? createPortal(children, mount) : null;
};

export default Portal;