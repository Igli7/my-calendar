import { createPortal } from 'react-dom';

import styles from './Modal.module.scss';

interface IModal {
  children: any;
  closeModal: () => void;
}

const Modal = ({ children, closeModal }: IModal) => {
  return createPortal(
    <div className={styles.modal}>
      <div className={styles.modalClose} onClick={closeModal}></div>
      <div className={styles.modalInner}>{children}</div>
    </div>,
    document.getElementById('__next')!,
  );
};

export default Modal;
