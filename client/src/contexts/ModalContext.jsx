import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const openRegister = () => setIsRegisterOpen(true);
    const closeRegister = () => setIsRegisterOpen(false);

    return(
        <ModalContext.Provider value={{ 
                isLoginOpen, 
                isRegisterOpen, 
                openLogin, 
                closeLogin, 
                openRegister, 
                closeRegister 
            }
        }>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext);