import { useState } from "react";
import {
  downloadFile,
  findClass,
  isPrivate,
  validateInput,
} from "../../lib/utils";

export function Choice1() {
  const [ip, setIp] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const content = `IP: ${ip}\nClasse: ${findClass(ip)}\nPrivato: ${
    isPrivate(ip) ? "Sì" : "No"
  }`;

  return (
    <div className="flex flex-col gap-3">
      <h4>Scelta 1:</h4>

      <div className="flex flex-col gap-3 xl:w-1/4 w-full">
        <input
          type="text"
          placeholder="Indirizzo IP"
          value={ip}
          onChange={(e) => {
            setConfirm(false);
            setIp(e.target.value);
            setIsValid(validateInput(e.target.value));
          }}
          className="w-full"
        />

        <button onClick={() => setConfirm(true)}>Conferma</button>
        <button
          onClick={() => downloadFile(content, "choice1.txt")}
          disabled={!confirm || !isValid}
          className={confirm && isValid ? "" : "cursor-not-allowed !bg-secondary"}
        >
          Scarica
        </button>
      </div>

      {confirm && (
        <>
          {!ip || !isValid ? (
            <p>Dati non validi</p>
          ) : (
            <>
              <p>Classe: {findClass(ip)}</p>
              <p>Privato: {isPrivate(ip) ? "Sì" : "No"}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
