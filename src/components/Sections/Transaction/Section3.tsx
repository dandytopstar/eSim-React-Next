"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import QRCode from "react-qr-code";
import { usePathname, useRouter } from "next/navigation";
import {toast} from 'react-toastify'

import { Card } from "@/components/elements/Transaction/Card";
import { Button } from "@/components/elements/Transaction/Button";
import { Roaming } from "@/components/elements/Transaction/Roaming";
import { Reload } from "@/components/elements/Transaction/Reload";
import { ContactUs } from "@/components/elements/Transaction/ContactUs";
import { Spinner } from "@/components/elements/common/Spinner";
import buyEsimById from "@/actions/Packages/buyEsimById";

import { GetInfoFromCookie } from "@/utils/GetInfoFromCookie";
import { transaction } from "@/types/transaction.type";

export const Section3 = () => {
  const pathName = usePathname();

  const [transactionData, setData] = useState<transaction>();
  const [selected_type, setType] = useState(false);
  const [is_Loading, setLoading] = useState(false);
  const router = useRouter();
  const selected_package = GetInfoFromCookie(getCookie("selected_package"));

  useEffect(() => {
    (async () => {
      setLoading(true);
      const package_type_id = pathName.split("/")[2];
      const user_info = GetInfoFromCookie(getCookie("user_info"));
      const buy = getCookie('bought');
      if(package_type_id !== buy){
        toast.error("You can't buy this esim");
        router.push('/')
        return;
      }
      const data = await buyEsimById(
        user_info.customer_details.customer_id,
        Number(package_type_id),
        user_info.customer_details.full_name,
        user_info.customer_details.phone_number
      );
      if (data === false) return;
      setData(data);
      setLoading(false);
    })();
  }, [pathName]);

  const handleClickType = (name: string) => {
    switch (name) {
      case "qr_code":
        setType(false);
        break;
      case "manual":
        setType(true);
        break;
    }
  };

  return (
    <section className="mi-medium:px-[300px] 2xl:px-[100px] px-6 py-[40px] bg-white text-dark-solid text-center flex flex-col gap-10">
      {is_Loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1">
          <div className="flex flex-col gap-[60px]">
            <div className="flex flex-row gap-4 mx-auto">
              <Image
                src="/assets/Transaction Page/Icons/Check mark.svg"
                width={64}
                height={64}
                alt="Check Mark"
              />
              <div className="lg:text-[24px] text-[20px] grid grid-rows-2 font-montserratbold text-left">
                <p>Order #{transactionData?.order_number}</p>
                <p>Thanks Helex Mofidex</p>
              </div>
            </div>
            <hr className="border-[#DDDDDD]" />
            <div className="flex flex-row gap-8 mx-auto">
              <Button
                title="QR code"
                color="#FFECBE"
                selectedColor="#F2B21B"
                selected={!selected_type}
                onClick={() => handleClickType("qr_code")}
              />
              <Button
                title="Manual"
                color="#FFECBE"
                selectedColor="#F2B21B"
                selected={selected_type}
                onClick={() => handleClickType("manual")}
              />
            </div>
            {selected_type ? (
              <p className="text-[25px]">{transactionData?.qr_code}</p>
            ) : (
              <QRCode
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "300px",
                  width: "300px",
                  margin: "auto",
                }}
                value={transactionData?.qr_code ? transactionData?.qr_code : ""}
                viewBox={`0 0 256 256`}
              />
            )}
            <Card
              country={selected_package?.country_code}
              title={transactionData?.country_name}
              size={selected_package?.data_GB}
              price={Number(selected_package?.price)}
              subtotal={Number(selected_package?.price)}
              discount={1.0}
            />
            {/* Integrate With API */}
            <Roaming
              iccid={transactionData?.iccid}
              country={transactionData?.country_name}
            />
            <Reload />
            <ContactUs />
            <hr className="border-[#DDDDDD] max-lg:hidden" />
            <p className="font-montserrat text-[18px] text-left max-lg:hidden">
              Purchase options cancellation policy
            </p>
          </div>
          {/* <div className="max-lg:order-first">
            
          </div> */}
        </div>
      )}
    </section>
  );
};
