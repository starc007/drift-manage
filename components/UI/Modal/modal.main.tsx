import React, { FC, useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import clsx from "clsx";

type Props = {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  modalClassName?: string;
  disableClickOutside?: boolean;
};

const Modal: FC<Props> = ({
  isOpen,
  close,
  children,
  title,
  showCloseButton = false,
  modalClassName,
  disableClickOutside = false,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          static
          className="relative z-50 focus:outline-none"
          onClose={disableClickOutside ? () => {} : close}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={clsx(
                "rounded-xl overflow-hidden p-2 backdrop-blur-2xl duration-300 ease-out relative max-w-lg w-full bg-background/70 border border-primary/10",
                modalClassName
              )}
            >
              <div className="rounded-lg px-5 py-4 relative">
                {showCloseButton && (
                  <div className="absolute right-3 top-3 z-10">
                    <button
                      onClick={close}
                      className="border border-primary/10 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/5 transition-colors"
                    >
                      <RxCross2 size={18} />
                    </button>
                  </div>
                )}
                {title && (
                  <DialogTitle as="h3" className="text-xl font-medium">
                    {title}
                  </DialogTitle>
                )}
                <div
                  className={clsx(
                    "max-h-[80vh] overflow-y-auto transition-all duration-300 hide-scrollbar",
                    showContent ? "overflow-y-auto" : "overflow-hidden"
                  )}
                >
                  <div className="overflow-hidden">{children}</div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;
