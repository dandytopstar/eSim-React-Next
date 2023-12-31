"use client";
import sendEmail from "@/actions/Contact/sendEmail";
// import { sendMessage } from "@/actions/Contact/sendEmail";
import { OrangeButton } from "@/components/elements/common/OrangeButton";
import { Spinner } from "@/components/elements/common/Spinner";
import { TextInput } from "@/components/elements/common/TextInput";
import { GetInfoFromCookie } from "@/utils/GetInfoFromCookie";
import { validEmail, validName } from "@/utils/validation";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Section4 = () => {
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [iccid, setIccid] = useState("");
  const [message, setMessage] = useState("");
  const [nameValidation, setNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [is_Loading, setLoading] = useState(false);

  useEffect(() => {
    const user_info = GetInfoFromCookie(getCookie("user_info"));
    if (user_info === undefined) {
      return;
    }
    setName(user_info.customer_details.full_name);
    setEmail(user_info.customer_details.customer_id);
    setPhone(user_info.customer_details.phone_number);
  }, []);

  const sendMessageHandler = async () => {
    setLoading(true);
    setNameValidation(validName(full_name).response);
    setEmailValidation(validEmail(email).response);
    if (validName(full_name).error || validEmail(email).error) {
      setLoading(false);
      return;
    }
    const res = await sendEmail(
      email,
      full_name,
      phone_number,
      model,
      iccid,
      message
    );
    if (
      res === true
    ) {
      toast.success("Message sent successfully!");
      setModel("");
      setIccid("");
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <section className="relative mi-medium:px-[300px] 2xl:px-[100px] px-6 md:py-[135px] py-[40px] text-dark-solid text-center bg-light-solid">
      <h1 className="font-montserrat2xl md:text-[48px] text-[32px] md:mb-[60px] mb-[25px] xl:px-[300px]">
        Please Complete The Form Below Should You Wish To Get Hold Of Us:
      </h1>
      {is_Loading ? <Spinner /> : ""}
      <div className="bg-white lg:rounded-[32px] rounded-[10px] grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-[15px] lg:px-20 lg:py-20 px-5 py-5">
        <TextInput
          type="text"
          header="Full Name*"
          placeholder="Helex Mofidex"
          value={full_name}
          setValue={setName}
          validation={nameValidation}
        />
        <TextInput
          type="text"
          header="Your Email*"
          placeholder="info@example.com"
          value={email}
          setValue={setEmail}
          validation={emailValidation}
        />
        <TextInput
          type="text"
          header="Phone Number"
          placeholder="+123 4456 7889 88"
          value={phone_number}
          setValue={setPhone}
        />
        <TextInput
          type="text"
          header="Device Model"
          placeholder="iPhone 14"
          value={model}
          setValue={setModel}
        />
        <TextInput
          type="text"
          header="eSim ICCID"
          placeholder="44XXXXXXXXXXXXXXXXXX"
          value={iccid}
          setValue={setIccid}
        />
        <div className="flex flex-col gap-3 text-left font-montserrat md:col-span-2">
          <p className="text-[20px] font-semibold">Message*</p>
          <textarea
            placeholder="Type here..."
            className="bg-[#EBF6FF] px-6 py-4 rounded-xl text-[18px] outline-none min-h-[140px] "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <OrangeButton text="Send Message" onCLick={sendMessageHandler} />
        </div>
      </div>
    </section>
  );
};
