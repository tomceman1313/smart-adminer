import useBasicApiFunctions from "./useBasicApiFunctions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGetAll(apiClass, page, key, errorMessage) {
	const { getAll } = useBasicApiFunctions();
	return useQuery({
		queryKey: key,
		queryFn: async () => {
			const data = await getAll(apiClass, page);
			return data;
		},
		meta: {
			errorMessage: errorMessage,
		},
	});
}

export function useGet(apiClass, id, key, errorMessage, enabled = true) {
	const { get } = useBasicApiFunctions();

	return useQuery({
		queryKey: key,
		queryFn: async () => {
			const data = await get(apiClass, id);
			return data;
		},
		meta: {
			errorMessage: errorMessage,
		},
		enabled: enabled,
	});
}

export function useCreate(apiClass, positiveText, errorMessage, invalidateKey) {
	const { create } = useBasicApiFunctions();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => {
			return create(apiClass, data, positiveText);
		},
		onSuccess: () => {
			if (!invalidateKey) {
				return;
			}

			if (Array.isArray(invalidateKey[0])) {
				invalidateKey.forEach((key) =>
					queryClient.invalidateQueries({ queryKey: key })
				);
			} else {
				queryClient.invalidateQueries({ queryKey: invalidateKey });
			}
		},
		meta: {
			errorMessage: errorMessage,
		},
	});
}

export function useUpdate(apiClass, positiveText, errorMessage, invalidateKey) {
	const { edit } = useBasicApiFunctions();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => {
			return edit(apiClass, data, positiveText);
		},
		onSuccess: () => {
			if (!invalidateKey) {
				return;
			}

			if (Array.isArray(invalidateKey[0])) {
				invalidateKey.forEach((key) =>
					queryClient.invalidateQueries({ queryKey: key })
				);
			} else {
				queryClient.invalidateQueries({ queryKey: invalidateKey });
			}
		},
		meta: {
			errorMessage: errorMessage,
		},
	});
}

export function useDelete(apiClass, positiveText, errorMessage, invalidateKey) {
	const { remove } = useBasicApiFunctions();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => {
			return remove(apiClass, id, positiveText);
		},
		onSuccess: () => {
			if (!invalidateKey) {
				return;
			}

			if (Array.isArray(invalidateKey[0])) {
				invalidateKey.forEach((key) =>
					queryClient.invalidateQueries({ queryKey: key })
				);
			} else {
				queryClient.invalidateQueries({ queryKey: invalidateKey });
			}
		},
		meta: {
			errorMessage: errorMessage,
		},
	});
}
