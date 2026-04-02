
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'alert' | 'confirm';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'alert', 
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#241814] rounded-[2rem] shadow-2xl border border-[#3A2A23] overflow-hidden p-8"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                type === 'confirm' ? 'bg-blue-500/10 text-blue-500' : 'bg-[#E6B18A]/10 text-[#E6B18A]'
              }`}>
                {type === 'confirm' ? <HelpCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-[#F5EFEA]">{title}</h3>
                <p className="text-[#CBB8A9] leading-relaxed">{message}</p>
              </div>

              <div className="flex w-full gap-4 pt-4">
                {type === 'confirm' && (
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3.5 font-bold text-[#8C7A6B] hover:text-[#F5EFEA] transition-colors bg-[#1F1511] rounded-xl border border-[#3A2A23]"
                  >
                    {cancelText}
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (type === 'confirm' && onConfirm) {
                      onConfirm();
                    }
                    onClose();
                  }}
                  className={`flex-1 py-3.5 font-bold rounded-xl shadow-xl transition-all transform active:scale-95 ${
                    type === 'confirm' 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-[#E6B18A] text-[#1A120E] hover:bg-[#D39A70]'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
