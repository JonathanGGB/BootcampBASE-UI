import { IconCoin } from "@tabler/icons-react";
import { Currency, DropdownOrderBy, Header, SearchInput } from "../components";
import { useEffect, useState } from "react";
import { Currency as ICurrency } from "../interfaces";
import { currenciesMock } from "../mocks";

export const Currencies = () => {
	const [currencies, setCurrencies] = useState<ICurrency[]>([]);
	const [currentOrderOption, setCurrentOrderOption] = useState("customerId");

	const orderOptions: { label: string; value: string }[] = [
		{ label: "Nombre", value: "name" },
		{ label: "Símbolo", value: "symbol" },
		{ label: "Valor", value: "value" },
	];

	useEffect(() => {
		setCurrencies(currenciesMock);
		setCurrencies((prevState) => orderCurrencies(prevState, currentOrderOption));
	}, []);

	const orderCurrencies = (
		currencies: ICurrency[],
		currentOrderOption: string,
	): ICurrency[] => {
		let key = currentOrderOption as keyof (typeof currencies)[0];

		const newCurrencies: ICurrency[] = currencies.sort((a: ICurrency, b: ICurrency) => {
			if (a[key] > b[key]) return 1;
			if (a[key] < b[key]) return -1;
			return 0;
		});
		return newCurrencies;
	};

	const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentOrderOption(e.target.value);
		setCurrencies(orderCurrencies(currencies, e.target.value));
	};

	const handleSearch = (searchWord: string) => {
		if (searchWord === "") {
			setCurrencies(currenciesMock);
		} else {
			
			let newCurrencies = currenciesMock.filter((currency) => {
				// Convert the search term and currency attributes to lowercase
				const searchTermLower = searchWord.toLowerCase();
				const currencyNameLower = currency.name.toLowerCase();
				const currencySymbolLower = currency.symbol.toLowerCase();
				const currencyValueString = currency.value.toString().toLowerCase();
			
				// Check if the search term is present in any of the currency attributes
				return (
				  currencyNameLower.includes(searchTermLower) ||
				  currencySymbolLower.includes(searchTermLower) ||
				  currencyValueString.includes(searchTermLower)
				);
			  });
			setCurrencies(newCurrencies);
		}
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
						propertie="divisa">
					</SearchInput>
				</div>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{currencies.length === 0 ? (
						<div className="my-4 overflow-auto divide-y divide-gray-100">

							<div className="flex flex-col items-center justify-center h-full">
								<p className="text-3xl font-bold text-center">
									¡Oh no! :(
								</p>

								<p className="mt-5 text-lg text-center">
									Algo no ha salido como esperabamos. Por favor,
									intentalo más tarde.
								</p>
							</div>
						</div>
					) : (
						<ul
							role="list"
							className="grid w-full gap-3 overflow-auto divide-y divide-gray-100 sm:grid-cols-2 xl:grid-cols-4 my-7"
						>
							{currencies.map((currency) => (
								<Currency currency={currency} key={currency.name} />
							))}
					 	</ul>
					)}
			</section>
		</>
	);
};
