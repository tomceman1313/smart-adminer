import { useContext } from "react";
import InteractionContext from "../context/InteractionContext";

const useInteraction = () => {
	return useContext(InteractionContext);
};

export default useInteraction;
