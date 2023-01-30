import { useState, createContext } from "react";

const InteractionContext = createContext(null);

export const InteractionProvider = ({ children }) => {
	const [message, setMessage] = useState(null);
	const [alert, setAlert] = useState(null);
	return <InteractionContext.Provider value={{ message, setMessage, alert, setAlert }}>{children}</InteractionContext.Provider>;
};

export default InteractionContext;
