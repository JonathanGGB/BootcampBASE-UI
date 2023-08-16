import { ChangeEvent, useEffect, useState } from "react";
import { IconCoin } from "@tabler/icons-react";

import { Currency, DropdownOrderBy, Header, SearchInput } from "../components";
import { useGetCurrencies } from "../api";
import { Currency as ICurrency } from "../interfaces";
import {FetchingData} from "../components/FetchingData.tsx";
export const Currencies = () => {
	const [currentOrderOption, setCurrentOrderOption] = useState("");

	const orderOptions = [
		{ label: "Nombre", value: "name" },
		{ label: "Simbolo", value: "symbol" },
		{ label: "Valor de cambio", value: "value" },
	];

	const orderCurrencies = (
		currencies: ICurrency[],
		currentOrderOption: string,
	): ICurrency[] => {
		const key = currentOrderOption as keyof ICurrency;
		const copyCurrencies = [...currencies];

		const orderedCurrencies = copyCurrencies.sort((a, b) => {
			if (a[key] > b[key]) return 1;
			if (a[key] < b[key]) return -1;
			return 0;
		});

		return orderedCurrencies;
	};

	const [search] = useState("");
	const [currencies, setCurrencies] = useState<ICurrency[]>([]);
	const { isError, isLoading, mutate} = useGetCurrencies();

	useEffect(() => {
		getCurrenciesInfo();
	}, [search]);

	const handleDropdown = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrentOrderOption(e.target.value);
		setCurrencies(orderCurrencies(currencies, e.target.value));
	};

	const handleSearch = (searchWord: string) => {
		if (searchWord === "") {
			//Reset currencies array only when search bar is empty
			getCurrenciesInfo();
		} else {
			const newCurrencies = currencies.filter((currency) => {
				return ( currency.name.toLowerCase().includes(searchWord.toLowerCase()) ||  currency.symbol.toLowerCase().includes(searchWord.toLowerCase()) ||  currency.value.toString().toLowerCase().includes(searchWord.toLowerCase()) );
			});
			setCurrencies(newCurrencies);
		}
	};

	const getCurrenciesInfo = () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		mutate(search, {
			onSuccess: (data) => setCurrencies(data),
		});
	};

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Divisas
				</h1>
				<div className="flex w-full gap-2 sm:w-96">
					<DropdownOrderBy
						onChange={handleDropdown}
						options={orderOptions}
						value={currentOrderOption}
					/>
					<SearchInput
						Icon={IconCoin}
						onSearch={(e) => handleSearch(e.target.value)}
						propertie="divisa"
					/>
				</div>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<FetchingData isLoading={isLoading} isError={isError}>
						{ currencies.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full">
								<p className="text-3xl font-bold text-center">
									¡Oh no! :(
								</p>

								<p className="mt-5 text-lg text-center">
									Algo no ha salido como esperabamos. Por favor,
									intentalo más tarde.
								</p>
							</div>
						) : (
							<ul
								role="list"
								className="grid w-full gap-3 overflow-auto divide-y divide-gray-100 sm:grid-cols-2 xl:grid-cols-4 my-7"
							>
								{currencies.map((currency) => (
									<Currency
										currency={currency}
										key={currency.symbol}
									/>
								))}
							</ul>
					)}
				</FetchingData>
			</section>
		</>
	);
};
