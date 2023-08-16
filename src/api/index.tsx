import { useMutation, useQuery } from "@tanstack/react-query";
import {Client, ClientDTO, Currency} from "../interfaces";

import { httpClient } from "../http";

export const useGetCustomerById = (customerId: string) => {
	return useQuery({
		queryKey: ["Customer", customerId],
		queryFn: async () => {
			const { data } = await httpClient.get<ClientDTO>(`/customers/${customerId}`);
			return data;
		},
	});
};

export const useGetCustomers = () => {
	return useMutation({
		mutationKey: ["Customers"],
		mutationFn: async (name: string) => {
			const { data } = await httpClient.get<Client[]>("/customers", {
				params: {
					name,
				},
			});

			return data;
		},
	});
};

export const useCreateCustomer = () => {
	return useMutation({
		mutationKey: ["Customers"],
		mutationFn: async (customer: Omit<Client, "customerId">) => {
			const { data } = await httpClient.post<ClientDTO>("/customers", {
				...customer,
			});

			return data;
		},
	});
};

export const useGetCurrencies = () => {
	return useMutation({
		mutationKey: ["Currencies"],
		mutationFn: async (search: string) => {
			const { data } = await httpClient.get<Currency[]>("/currencies", {
				params: {
					search,
				},
			});
			return data;
		},
	});
};