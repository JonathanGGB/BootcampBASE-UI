import { IconPlus } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

import { Header } from "../components/Header";
import { useGetCustomerById } from "../api";
import {CreditCard} from "../components";

export const Client = () => {
	const { id } = useParams();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { data: clientData, isLoading, isError } = useGetCustomerById(id);

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
					{/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
					{clientData ? clientData.information.name : "Nombre del cliente"}
				</h1>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 py-7 w-full">
					{/* Renderiza las cuentas del cliente utilizando el componente CreditCard si la carga ha terminado */}
					{isLoading ? (
						<p>Cargando...</p>
					) : isError ? (
						<p>Error al cargar los datos del cliente.</p>
					) : clientData.accounts.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full">
							<p className="text-3xl font-bold text-center">
								¡Oh no! :(
							</p>

							<p className="mt-5 text-lg text-center">
								Algo no ha salido como esperabamos. Por favor,
								intentalo más tarde.
							</p>
						</div>
					) : (clientData.accounts.map(account => (
							<CreditCard key={account.accountNumber} name={clientData.information.name} cardNumber= {account.accountNumber} balance={account.balance}/>
						))
					)}
				</ul>
			</section>

			<button className="fixed right-8 bottom-8 p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
				<div className="flex gap-2 items-center">
					<IconPlus className="w-4 h-4" />
					<span>Añadir cuenta</span>
				</div>
			</button>
		</>
	);
};