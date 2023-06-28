"use client"

import { useEffect, useState } from "react";
//components
import { SelectTab } from "@/components/elements/Packages/SelectTab";
import { Search } from "@/components/elements/Packages/Search";
import { OrangeButton } from "@/components/elements/common/OrangeButton";
import { Modal } from "@/components/elements/Modal";
import { Spinner } from "@/components/elements/common/Spinner";
import { toast } from 'react-toastify';
import { CountryCard } from "@/components/elements/Homepage/CountryCard";
import { Details } from "@/components/elements/Homepage/Details";
//actions
import getCountriesByRegion from "@/actions/Packages/getCountriesByRegion";
import getDetailsByCountry from "@/actions/Home/getDetailsByCountry";
//type
import { details } from "@/types/details.type";
import { packages } from "@/types/packages.type";

export const Section3 = () => {

    const [is_modal, showModal] = useState(false);
    const [selectedRegion, setRegion] = useState('South America');
    const [countries, setCountries] = useState<Array<packages>>();
    const [is_Loading, setLoading] = useState(false);
    const [selected_cardIndex, setIndex] = useState(1);
    const [selected_country, setCountry] = useState("")
    const [details, setDetails] = useState<Array<details>>();

    useEffect(() => {
        (async () => {
            setLoading(true)
            setCountry('');
            setDetails([])
            
            const data = await getCountriesByRegion(selectedRegion);
            if (data === false) {
                toast.error("Invalid Region", {
                    position: toast.POSITION.TOP_RIGHT
                });
                setLoading(false);
                return;
            }
            setCountries(data);
            setLoading(false);
        })()
    }, [selectedRegion]);

    const LoadDetail = async (country_name: string, index: number) => {
        if (country_name === selected_country) {
            setCountry("");
            setDetails([]);
            return;
        }
        setCountry(country_name)
        setLoading(true);

        const data = await getDetailsByCountry(country_name);
        if (data === false) {
            toast.error("Connection Failed", {
                position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false);
            return;
        }
        setDetails(data);
        setIndex(index)
        setLoading(false);
    }

    return (
        <section className="relative mi-medium:px-[300px] 2xl:px-[100px] px-6 py-[135px] bg-[#F9F7F7] text-dark-solid text-center flex flex-col gap-10">
            {is_Loading ? <Spinner /> : ''}

            <SelectTab setRegion={setRegion} selectedRegion={selectedRegion} />
            <div className="flex flex-row gap-5">
                <select className="bg-[#FFF8E6] outline-none border-[1px] border-[#F2B21B] rounded-lg h-[50px] px-[15px] font-montserrat font-semibold md:hidden grow" defaultValue={selectedRegion} onChange={(e) => setRegion(e.target.value)}>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Asia">Asia</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Africa">Africa</option>
                </select>
                <Search />
            </div>

            <div className="w-full my-16 !grid xl:!grid-cols-5 !grid-cols-2 grid-container">
                {countries?.length !== 0 ? countries?.map((item, index) => {
                    return (
                        <CountryCard key={index}
                            selected_country={selected_country}
                            country_code={item.country_code}
                            country={item.country_name}
                            id={index}
                            onLoad={LoadDetail}
                        />)
                }) : ''}
                <div className={`max-xl:hidden grid-item grid-A${Math.floor(selected_cardIndex / 5) + 1}`}>
                    <Details data={details} showModal={showModal} />
                </div>
                <div className={`xl:hidden grid-item grid-A${Math.floor(selected_cardIndex / 2) + 1}`}>
                    <Details data={details} showModal={showModal} />
                </div>
            </div>
            <OrangeButton text="Show More Countries" />
            {is_modal ? <Modal showModal={showModal} /> : ''}
        </section>
    );
};
