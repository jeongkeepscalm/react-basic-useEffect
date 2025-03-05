import { forwardRef, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ children, open, onClose}, ref) {
  const dialog = useRef();

  useEffect(() => {
    // 아래는 컴포넌트가 렌더링될 때마다 실행되어야 하므로 두 번째 인자로 빈 배열을 전달하지 않는다.
    // 즉, 의존성 추가 필요
    open ? dialog.current.showModal() : dialog.current.close();
  }, [open])

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      { open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
});

export default Modal;
