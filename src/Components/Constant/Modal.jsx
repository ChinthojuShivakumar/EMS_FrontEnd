import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, setIsOpen, onClose, children, style, enableMouseEvents = false }) => {


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'scroll';
        }

        return () => {
            document.body.style.overflowY = 'scroll';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onMouseEnter={enableMouseEvents ? () => setIsOpen(true) : null}
            onMouseLeave={enableMouseEvents ? () => setIsOpen(false) : null}
        >
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10" style={style}>
                <button
                    className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;