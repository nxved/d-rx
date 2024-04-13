"use client";
import { useState, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  readContracts,
  writeContracts,
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { prescriptionContract } from "../../../../../config";

export default function PharmacyPrescriptions() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [patientAddress, setPatientAddress] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loader1, setLoader1] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, [pharmacyAddress]);

  useEffect(() => {
    setPharmacyAddress(address);
  }, [address]);

  const fetchPrescriptions = async () => {
    try {
      setLoader1(true);
      const data = await readContracts({
        contracts: [
          {
            ...prescriptionContract,
            functionName: "getPrescriptionHistory",
            args: [patientAddress],
          },
        ],
      });
      setPrescriptions(data[0].result);
      setLoader1(false);
    } catch (error) {
      toast.error(error.message);
      setLoader1(false);
    }
  };

  const handleWallet = () => {
    open();
  };

  const handleGetPrescriptions = () => {
    if (!patientAddress) {
      toast.error("Please enter a patient address.");
      return;
    }
    fetchPrescriptions();
  };

  const handleStatusChange = async (prescriptionIndex) => {
    const data = await readContracts({
      contracts: [
        {
          ...prescriptionContract,
          functionName: "isPharmacyRegistered",
          args: [address],
        },
      ],
    });
    if (!data[0].result) {
      toast.error("You are not Registered!");
      return;
    }
    try {
      setLoader(true);
      const { request } = await prepareWriteContract({
        address: prescriptionContract.address,
        abi: prescriptionContract.abi,
        functionName: "markPrescriptionFilled",
        args: [patientAddress, prescriptionIndex],
      });
      await writeContract(request)
        .then(async (obj) => {
          await waitForTransaction(obj).then(async (data) => {
            if (data.status === "success") {
              toast.success("Prescription status changed successfully");
              fetchPrescriptions();
            } else {
              toast.error("Error changing prescription status");
            }
          });
        })
        .catch((e) => {
          toast.error("Error changing prescription status");
          console.log(e);
        });
      setLoader(false);
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center p-10 text-black">
      <div>
        <div className="mt-5">
          {!pharmacyAddress && (
            <button
              className="px-8 py-2 text-xl font-semibold bg-yellow-500"
              onClick={handleWallet}
            >
              Connect Wallet
            </button>
          )}
          {pharmacyAddress && (
            <div>
              <div className="mb-4">
                <label htmlFor="patientAddress" className="mr-2 font-semibold">
                  Patient Address:
                </label>
                <input
                  type="text"
                  id="patientAddress"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="p-1 border rounded-md"
                />
                <button
                  className="px-4 py-1 ml-2 font-semibold text-white bg-yellow-500 rounded-md"
                  onClick={handleGetPrescriptions}
                >
                  Get Prescriptions
                </button>
              </div>
              {loader1 && <p>Loading prescriptions...</p>}
              {prescriptions?.length == 0 && !loader1 && (
                <div className="py-8 font-bold text-center">
                  No prescriptions available.
                </div>
              )}
              {prescriptions?.length > 0 && (
                <div>
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
                        <div>
                          {prescription.filled
                            ? "Status : "
                            : "Change Status : "}
                          <button
                            className={`rounded-md px-2 ${
                              prescription.filled
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            disabled={prescription.filled}
                            onClick={() => handleStatusChange(index)}
                          >
                            {prescription.filled ? "Filled" : "Not Filled"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
