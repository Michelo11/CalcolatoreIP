import { useState } from "react";
import { Ip } from "../../types";
import {
  calculateCidr,
  calculateClassBits,
  calculateMaxSubnets,
  calculateNetIdsVariable,
  calculateSubnetMask,
  calculateVariableBits,
  convertToBinOctets,
  convertToDecOctets,
  downloadFile,
  findClass,
  getIpBase,
  validateInput,
} from "../../lib/utils";

export function Choice4() {
  const [ip, setIp] = useState("");
  const [numSubnets, setNumSubnets] = useState(0);
  const [numHosts, setNumHosts] = useState<number[]>([]);
  const [result, setResult] = useState<Ip[] | null>(null);
  const [dec, setDec] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  const handleNumSubnetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value || "0", 10) || 0;

    if (calculateMaxSubnets(findClass(ip)) < value) {
      setError("Dati non validi");
      return;
    }

    setNumSubnets(value);
    setNumHosts(Array(value).fill(0));
    setResult(null);
  };

  const handleNumHostsChange = (index: number, value: number) => {
    const newNumHosts = [...numHosts];
    newNumHosts[index] = value;
    setNumHosts(newNumHosts);
    setResult(null);
  };

  const handleSubmit = () => {
    if (!isValid) return setResult([]);

    const ipClass = findClass(ip);
    let netIds;

    try {
      netIds = calculateNetIdsVariable(calculateClassBits(ipClass), numHosts);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      setResult([]);
      return;
    }

    if (!ipClass) return setResult([]);

    const numHost = calculateClassBits(ipClass);

    const result = [];

    for (const index in netIds) {
      const id = netIds[index];
      const netId = id.padEnd(numHost, "0");
      const firstHost = id.padEnd(numHost - 1, "0") + "1";
      const lastHost = id.padEnd(numHost - 2, "1") + "01";
      const gateway = id.padEnd(numHost - 1, "1") + "0";
      const broadcast = id.padEnd(numHost, "1");
      const subnetMask = calculateSubnetMask(
        calculateCidr(
          ipClass,
          calculateClassBits(findClass(ip)) -
          calculateVariableBits(numHosts)[index]
        )
      );

      result.push({
        netId,
        firstHost,
        lastHost,
        gateway,
        broadcast,
        bits: numHost,
        subnetMask,
      });
    }

    setResult(result);
    setContent(
      result &&
      `IP: ${ip}\nNumero di sottoreti: ${numSubnets}\nRisultati in decimale:\n${result
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
            ).join(".")}\nSubnet Mask: ${convertToDecOctets(
              subIp.subnetMask
            ).join(".")}\nNotazione CIDR: /${calculateCidr(
              findClass(ip),
              calculateClassBits(findClass(ip)) -
              calculateVariableBits(numHosts)[index]
            ).toString()}`
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
              ).join(".")}\nSubnet Mask: ${convertToBinOctets(
                convertToDecOctets(subIp.subnetMask).join(".")
              ).join(".")}\nNotazione CIDR: /${calculateCidr(
                findClass(ip),
                calculateClassBits(findClass(ip)) -
                calculateVariableBits(numHosts)[index]
              ).toString()}`
          )
          .join("\n")}`
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <h4>Scelta 4:</h4>

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
          value={numSubnets.toString()}
          onChange={handleNumSubnetsChange}
          className="w-full"
        />

        <div className="flex flex-col gap-3">
          {numSubnets > 0 && <p>Numero host: </p>}
          {Array.from({ length: numSubnets }).map((_, index) => (
            <input
              key={index}
              type="number"
              placeholder={`Numero di host per ${index + 1} sottorete`}
              min="0"
              value={numHosts[index].toString()}
              onChange={(e) =>
                handleNumHostsChange(index, parseInt(e.target.value || "0", 10))
              }
              className="w-full"
            />
          ))}
        </div>

        <button onClick={() => handleSubmit()}>Conferma</button>
        <button
          onClick={() => downloadFile(content!, "choice4.txt")}
          disabled={!result || !isValid || !content || !!error}
          className={
            result && isValid && content && !error
              ? ""
              : "cursor-not-allowed !bg-secondary"
          }
        >
          Scarica
        </button>
      </div>

      {result != null && (
        <>
          {!ip ||
            numSubnets === 0 ||
            numHosts.some((num) => num === 0) ||
            result.length === 0 ||
            !isValid ? (
            <p>{error ? error : "Dati non validi"}</p>
          ) : (
            <>
              <div className="flex gap-3 flex-col">
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
                      <th>Subnet Mask</th>
                      <th>Notazione CIDR:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dec ? (
                      <>
                        {result.map((subIp, index) => (
                          <tr key={subIp.netId + "-" + index}>
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
                            <td>
                              {convertToDecOctets(subIp.subnetMask).join(".")}
                            </td>
                            <td>
                              /
                              {calculateCidr(
                                findClass(ip),
                                calculateClassBits(findClass(ip)) -
                                calculateVariableBits(numHosts)[index]
                              ).toString()}
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {result.map((subIp, index) => (
                          <tr key={subIp.netId + "-" + index}>
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
                            <td>
                              {convertToBinOctets(
                                convertToDecOctets(subIp.subnetMask).join(".")
                              ).join(".")}
                            </td>
                            <td>
                              /
                              {calculateCidr(
                                findClass(ip),
                                calculateClassBits(findClass(ip)) -
                                calculateVariableBits(numHosts)[index]
                              ).toString()}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
