import { isPermitted } from "../../modules/BasicFunctions";

export default function Permission({ permission, clickHandler }) {
	return <td>{isPermitted(permission, clickHandler)}</td>;
}
