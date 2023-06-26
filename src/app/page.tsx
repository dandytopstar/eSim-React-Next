'use client'
import { Inter } from "next/font/google";
import { Section2 } from "@/components/Sections/Section2";
import { Section3 } from "@/components/Sections/Homepage/Section3";
import { DownloadESIM } from "@/components/Sections/DownloadESIM";
import { homepage } from "@/utils/page-description";
import { Section1 } from "@/components/Sections/Section1";
import { Header } from "@/components/Header/Light";
import { Categories } from "@/components/Sections/Categories";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  
  const loaddata = async () =>{
    console.log('loading start...')
    let res = await fetch("https://test.esimplified.io/customer/esimpalace/api/countries_list", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          'Authorization': "Token ae9819d13e176fd276a958e1e3230b3080a73a2c",
      },
      body: JSON.stringify({

      }),
  })
    let data = await res.json();
    console.log(data);
  }
  return (
    <main className="relative">
      <div className="absolute z-[-10] w-full h-[800px] bg-cover bg-center bg-homepage-background ">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#081B27]"></div>
      </div>
      <Header />
      <Section1 heading={homepage.SectionHeader0} description={homepage.SectionDescription0}/>
      <Section2 heading={homepage.SectionHeader1} description={homepage.SectionDescription1}/>
      <Categories />
      <Section3 />
      <DownloadESIM />
      <button onClick={async()=>await loaddata()} className="bg-black">Load</button>
    </main>
  );
}
