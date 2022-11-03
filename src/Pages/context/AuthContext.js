import { useState, createContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);
	return <AuthContext.Provider value={{ userInfo, setUserInfo }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
