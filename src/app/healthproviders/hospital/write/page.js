"use client";
import { useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import {
  writeContract,
  prepareWriteContract,
  waitForTransaction,
  readContracts,
} from "@wagmi/core";
import { prescriptionContract } from "../../../../../config";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

export default function HospitalPrescription() {
  const router = useRouter();
  const { address } = useAccount();
  const [prescriptionData, setPrescriptionData] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmitPrescription = async () => {
    if (!address) {
      toast.error("Connect Your Wallet");
      return;
    }

    if (!prescriptionData || !patientAddress) {
      toast.error("Please enter prescription data and patient address");
      return;
    }

    const data = await readContracts({
      contracts: [
        {
          ...prescriptionContract,
          functionName: "isHospitalRegistered",
          args: [address],
        },
      ],
    });
    if (!data[0].result) {
      toast.error("You are not Registered!");
      return;
    }

    setLoader(true);

    try {
      console.log("1");
      const { request } = await prepareWriteContract({
        address: prescriptionContract.address,
        abi: prescriptionContract.abi,
        functionName: "writePrescription",
        args: [patientAddress, prescriptionData],
      });
      console.log("2");

      await writeContract(request)
        .then(async (obj) => {
          await waitForTransaction(obj).then(async (data) => {
            console.log("3");

            if (data.status === "success") {
              console.log("4");
              toast.success("Prescription submitted successfully");
              setLoader(false);
            } else {
              console.log("5");
              console.log(data);
              toast.error("Error submitting prescription");
              setLoader(false);
            }
          });
        })
        .catch((e) => {
          console.log("6");
          console.log(e);
          toast.error("Error submitting prescription");
          setLoader(false);
          console.error(e);
        });
    } catch (error) {
      console.log("7");

      console.log(error);
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center p-10 text-black">
      <div>
        <div className="text-5xl font-semibold text-black">
          Write Prescription
        </div>
        <div className="mt-5">
          <input
            type="text"
            className="w-full h-12 p-4 border border-gray-300 rounded-md"
            placeholder="Enter patient address..."
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-md"
            placeholder="Enter prescription data..."
            value={prescriptionData}
            onChange={(e) => setPrescriptionData(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-5">
          <button
            className="px-8 py-2 text-xl font-semibold bg-yellow-500"
            onClick={handleSubmitPrescription}
            disabled={loader}
          >
            {loader ? "Submitting..." : "Submit Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
}
