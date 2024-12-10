import { useState } from "react";
import {
  calculateCidr,
  calculateNetIds,
  convertToBinOctets,
  convertToDecOctets,
  findClass,
  getIpBase,
  validateInput,
  calculateClassBits,
  calculateSubnetMask,
  downloadFile,
} from "../../lib/utils";
import { Ip } from "../../types";

export function Choice3() {
  const [ip, setIp] = useState("");
  const [numSubnets, setNumSubnets] = useState("");
  const [result, setResult] = useState<Ip[] | null>(null);
  const [dec, setDec] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [content, setContent] = useState<string | null>(null);

  const handleSubmit = () => {
    const ipClass = findClass(ip);

    if (ipClass === "Sconosciuta") return setResult([]);

    const numHosts = calculateClassBits(ipClass);
    const bitSubnets = Math.ceil(Math.log2(parseInt(numSubnets, 10)));

    if (numHosts - bitSubnets < 2) return setResult([]);

    const netIds = calculateNetIds(parseInt(numSubnets, 10));
    const result = [];

    for (const id of netIds) {
      const netId = id.padEnd(numHosts, "0");
      const firstHost = id.padEnd(numHosts - 1, "0") + "1";
      const lastHost = id.padEnd(numHosts - 2, "1") + "01";
      const gateway = id.padEnd(numHosts - 1, "1") + "0";
      const broadcast = id.padEnd(numHosts, "1");
      const subnetMask = calculateSubnetMask(
        calculateCidr(
          findClass(ip),
          Math.ceil(Math.log2(parseInt(numSubnets, 10)))
        )
      );

      result.push({
        netId,
        firstHost,
        lastHost,
        gateway,
        broadcast,
        subnetMask,
      });
    }

    setResult(result);
    setContent(
      result &&
        `IP: ${ip}\nNumero di sottoreti: ${numSubnets}\nSubnet Mask binario: ${convertToDecOctets(
          result[0].subnetMask
        ).join(".")}\nSubnet Mask decimale: ${convertToBinOctets(
          convertToDecOctets(result[0].subnetMask).join(".")
        ).join(".")}\nNotazione CIDR: /${calculateCidr(
          findClass(ip),
          Math.ceil(Math.log2(parseInt(numSubnets, 10)))
        ).toString()}\nRisultati in decimale:\n${result
          ?.map(
            (subIp, index) =>
              `Sottorete ${index + 1}:\nNet ID: ${getIpBase(
                ip
              )}.${convertToDecOctets(subIp.netId).join(
                "."
              )}\nPrimo Host: ${getIpBase(ip)}.${convertToDecOctets(
                subIp.firstHost
              ).join(".")}\nUltimo Host: ${getIpBase(ip)}.${convertToDecOctets(
                subIp.lastHost
              ).join(".")}\nGateway: ${getIpBase(ip)}.${convertToDecOctets(
                subIp.gateway
              ).join(".")}\nBroadcast: ${getIpBase(ip)}.${convertToDecOctets(
                subIp.broadcast
              ).join(".")}`
          )
          .join("\n")}\nRisultati in binario:\n${result
          ?.map(
            (subIp, index) =>
              `Sottorete ${index + 1}:\nNet ID: ${convertToBinOctets(
                getIpBase(ip) + "." + convertToDecOctets(subIp.netId).join(".")
              ).join(".")}\nPrimo Host: ${convertToBinOctets(
                getIpBase(ip) +
                  "." +
                  convertToDecOctets(subIp.firstHost).join(".")
              ).join(".")}\nUltimo Host: ${convertToBinOctets(
                getIpBase(ip) +
                  "." +
                  convertToDecOctets(subIp.lastHost).join(".")
              ).join(".")}\nGateway: ${convertToBinOctets(
                getIpBase(ip) +
                  "." +
                  convertToDecOctets(subIp.gateway).join(".")
              ).join(".")}\nBroadcast: ${convertToBinOctets(
                getIpBase(ip) +
                  "." +
                  convertToDecOctets(subIp.broadcast).join(".")
              ).join(".")}`
          )
          .join("\n")}`
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <h4>Scelta 3:</h4>

      <div className="flex flex-col gap-3 xl:w-1/4 w-full">
        <input
          type="text"
          placeholder="Indirizzo IP"
          value={ip}
          onChange={(e) => {
            setResult(null);
            setIp(e.target.value);
            setIsValid(validateInput(e.target.value));
          }}
          className="w-full"
        />

        <input
          type="number"
          placeholder="Numero di sottoreti"
          min="0"
          value={numSubnets}
          onChange={(e) => {
            setResult(null);
            setNumSubnets(e.target.value);
          }}
          className="w-full"
        />

        <button onClick={() => handleSubmit()}>Conferma</button>
        <button
          onClick={() => downloadFile(content!, "choice3.txt")}
          disabled={!result || !isValid || !content}
          className={
            result && isValid && content
              ? ""
              : "cursor-not-allowed !bg-secondary"
          }
        >
          Scarica
        </button>
      </div>

      {result != null && (
        <>
          {!ip || !numSubnets || result.length === 0 || !isValid ? (
            <p>Dati non validi</p>
          ) : (
            <div className="flex gap-3 flex-col">
              <div className="md:flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <p>Decimale:</p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={dec}
                      onChange={(e) => setDec(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="md:flex gap-3">
                  <p>
                    Notazione CIDR: /
                    {calculateCidr(
                      findClass(ip),
                      Math.ceil(Math.log2(parseInt(numSubnets, 10)))
                    ).toString()}
                  </p>

                  {dec ? (
                    <p>
                      Subnet Mask:{" "}
                      {convertToDecOctets(result[0].subnetMask).join(".")}
                    </p>
                  ) : (
                    <p>
                      Subnet Mask:{" "}
                      {convertToBinOctets(
                        convertToDecOctets(result[0].subnetMask).join(".")
                      ).join(".")}
                    </p>
                  )}
                </div>
              </div>

              <table
                className="max-w-[100vw] w-full overflow-auto table"
                style={{
                  display: "block",
                }}
              >
                <thead>
                  <tr className="bg-secondary text-white">
                    <th>#</th>
                    <th>Net ID</th>
                    <th>Primo Host</th>
                    <th>Ultimo Host</th>
                    <th>Gateway</th>
                    <th>Broadcast</th>
                  </tr>
                </thead>
                <tbody>
                  {dec ? (
                    <>
                      {result.map((subIp, index) => (
                        <tr key={subIp.netId}>
                          <td>{index + 1}</td>
                          <td>
                            {getIpBase(ip) +
                              "." +
                              convertToDecOctets(subIp.netId).join(".")}
                          </td>
                          <td>
                            {getIpBase(ip) +
                              "." +
                              convertToDecOctets(subIp.firstHost).join(".")}
                          </td>
                          <td>
                            {getIpBase(ip) +
                              "." +
                              convertToDecOctets(subIp.lastHost).join(".")}
                          </td>
                          <td>
                            {getIpBase(ip) +
                              "." +
                              convertToDecOctets(subIp.gateway).join(".")}
                          </td>
                          <td>
                            {getIpBase(ip) +
                              "." +
                              convertToDecOctets(subIp.broadcast).join(".")}
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {result.map((subIp, index) => (
                        <tr key={subIp.netId}>
                          <td>{index + 1}</td>
                          <td>
                            {convertToBinOctets(
                              getIpBase(ip) +
                                "." +
                                convertToDecOctets(subIp.netId).join(".")
                            ).join(".")}
                          </td>
                          <td>
                            {convertToBinOctets(
                              getIpBase(ip) +
                                "." +
                                convertToDecOctets(subIp.firstHost).join(".")
                            ).join(".")}
                          </td>
                          <td>
                            {convertToBinOctets(
                              getIpBase(ip) +
                                "." +
                                convertToDecOctets(subIp.lastHost).join(".")
                            ).join(".")}
                          </td>
                          <td>
                            {convertToBinOctets(
                              getIpBase(ip) +
                                "." +
                                convertToDecOctets(subIp.gateway).join(".")
                            ).join(".")}
                          </td>
                          <td>
                            {convertToBinOctets(
                              getIpBase(ip) +
                                "." +
                                convertToDecOctets(subIp.broadcast).join(".")
                            ).join(".")}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
