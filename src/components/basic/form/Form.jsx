import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Form({
	children,
	onSubmit,
	validationSchema,
	formContext,
	className,
}) {
	const methods = useForm(
		validationSchema ? { resolver: zodResolver(validationSchema) } : {}
	);
	const formMethods = formContext ? formContext : methods;
	return (
		<FormProvider {...formMethods}>
			<form onSubmit={formMethods.handleSubmit(onSubmit)} className={className}>
				{children}
			</form>
		</FormProvider>
	);
}