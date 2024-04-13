"use client";

import { useState, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { readContracts } from "@wagmi/core";
import { prescriptionContract } from "../../../config";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

export default function PatientPrescriptions() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addr, setAddr] = useState(false);
  const [noPresections, setNoPresections] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, [address]);

  useEffect(() => {
    setAddr(address);
  }, [address]);

  const fetchPrescriptions = async () => {
    try {
      const data = await readContracts({
        contracts: [
          {
            ...prescriptionContract,
            functionName: "getPrescriptionHistory",
            args: [address],
          },
        ],
      });
      console.log(data);
      setPrescriptions(data[0].result);
      if (data[0].result == 0) {
        setNoPresections(true);
      } else {
        setNoPresections(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleWallet = () => {
    open();
  };

  return (
    <div className="flex justify-center p-10 text-black">
      <div>
        <div className="mt-5">
          {!addr && (
            <button
              className="px-8 py-2 text-xl font-semibold bg-yellow-500"
              onClick={handleWallet}
            >
              Connect Wallet
            </button>
          )}
          {loader && <p>Loading prescriptions...</p>}
          {addr && noPresections && (
            <div className="pt-24 text-5xl font-semibold text-center">
              You do not have any Prescription
            </div>
          )}
          {addr && prescriptions?.length > 0 && (
            <div>
              <div className="py-4 pb-8 text-5xl font-semibold text-center">
                Your Prescriptions
              </div>
              <div className="flex flex-wrap justify-center">
                {prescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className="p-4 m-2 border border-yellow-500 rounded-lg shadow-lg"
                  >
                    <div className="mb-4 font-semibold">Prescription:</div>
                    <div>
                      {prescription.prescriptionData
                        .split(",")
                        .map((medicine, i) => (
                          <div key={i}>{medicine.trim()}</div>
                        ))}
                    </div>
                    <div className="mt-4">
                      <div>Written By: {prescription.hospitalAddress}</div>
                      {prescription.filled && (
                        <div>Filled By: {prescription.filledBy}</div>
                      )}
                      <div>
                        Status:{" "}
                        <span
                          className={`rounded-md px-2 ${
                            prescription.filled ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {prescription.filled ? "Filled" : "Not Filled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
