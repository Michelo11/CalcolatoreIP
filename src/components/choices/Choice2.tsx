import { useState } from "react";
import { validateInput, validateSubnetMask } from "../../lib/utils";

export function Choice2() {
  const [ip1, setIp1] = useState("");
  const [ip2, setIp2] = useState("");
  const [subnetMask1, setSubnetMask1] = useState("");
  const [subnetMask2, setSubnetMask2] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = () => {
    setIsValid(
      validateInput(ip1) &&
        validateInput(ip2) &&
        validateSubnetMask(subnetMask1) &&
        validateSubnetMask(subnetMask2)
    );

    const ip1Number = ip1.split(".").map(parseInt);
    const ip2Number = ip2.split(".").map(parseInt);
    const subnetMaskNumber1 = subnetMask1.split(".").map(parseInt);
    const subnetMaskNumber2 = subnetMask2.split(".").map(parseInt);

    const ip1Network = ip1Number.map(
      (value, index) => value & subnetMaskNumber1[index]
    );
    const ip2Network = ip2Number.map(
      (value, index) => value & subnetMaskNumber2[index]
    );

    setResult(ip1Network.join(".") === ip2Network.join("."));
  };

  return (
    <div className="flex flex-col gap-3">
      <h4>Scelta 2:</h4>

      <div className="flex flex-col gap-3 xl:w-1/4 w-full">
        <input
          type="text"
          placeholder="Indirizzo IP 1"
          value={ip1}
          onChange={(e) => {
            setResult(null);
            setIp1(e.target.value);
          }}
          className="w-full"
        />

        <input
          type="text"
          placeholder="Indirizzo IP 2"
          value={ip2}
          onChange={(e) => {
            setResult(null);
            setIp2(e.target.value);
          }}
          className="w-full"
        />

        <input
          type="text"
          placeholder="Subnet Mask 1"
          value={subnetMask1}
          onChange={(e) => {
            setResult(null);
            setSubnetMask1(e.target.value);
          }}
          className="w-full"
        />

        <input
          type="text"
          placeholder="Subnet Mask 2"
          value={subnetMask2}
          onChange={(e) => {
            setResult(null);
            setSubnetMask2(e.target.value);
          }}
          className="w-full"
        />

        <button onClick={() => handleSubmit()}>Conferma</button>

        {result != null && (
          <>
            {!ip1 || !ip2 || !subnetMask1 || !subnetMask2 ? (
              <p>Dati mancanti</p>
            ) : !isValid ? (
              <p>Indirizzi IP o Subnet Mask non validi</p>
            ) : (
              <p>
                {result
                  ? "I 2 IP appartengono alla stessa rete"
                  : "I 2 IP non appartengono alla stessa rete"}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
