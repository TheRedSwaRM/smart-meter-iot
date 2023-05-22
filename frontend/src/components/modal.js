import React from 'react';
import '../styles/modal.css';

const Modal = ({children}) => {
  return(
    <div className = 'modal display-block'>
      <section className="modal-main">
        {children}
      </section>
    </div>
  );
}

export default Modal;
