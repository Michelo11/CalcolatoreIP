import { useState } from "react";
import Footer from "./components/Footer";
import { Choice1 } from "./components/choices/Choice1";
import { Choice2 } from "./components/choices/Choice2";
import { Choice3 } from "./components/choices/Choice3";
import { Choice4 } from "./components/choices/Choice4";

export default function App() {
  const [choice, setChoice] = useState<number>(-1);

  return (
    <main className="min-h-screen bg-background font-sans text-white p-3 flex flex-col gap-3">
      <h1>Calcolatore IP</h1>

      <Menu choice={choice} setChoice={setChoice} />

      <Footer />
    </main>
  );
}

function Menu({
  choice,
  setChoice,
}: {
  setChoice: (choice: number) => void;
  choice: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3>Menù di scelta:</h3>

      <ol className="list-decimal list-inside">
        <li>Dato un indirizzo IP dire la classe e se privato,</li>
        <li>
          Dati due indirizzi IP e Subnet Mask dire se appartengono alla stessa,
          rete,
        </li>
        <li>
          Dato un indirizzo IP e numero di sottoreti calcolare le informazioni,
        </li>
        <li>
          Dato indirizzo IP, numero di sottoreti e host per ogni sottorete dire
          se è possibile calcolare le informazioni.
        </li>
      </ol>

      <select
        className="xl:w-1/4 w-full"
        value={choice?.toString()}
        onChange={(e) => setChoice(parseInt(e.target.value))}
      >
        <option value="-1" disabled>
          Scegli un'opzione
        </option>
        <option value="1">Scelta 1</option>
        <option value="2">Scelta 2</option>
        <option value="3">Scelta 3</option>
        <option value="4">Scelta 4</option>
      </select>

      {choice !== -1 && (
        <>
          {choice === 1 && <Choice1 />}
          {choice === 2 && <Choice2 />}
          {choice === 3 && <Choice3 />}
          {choice === 4 && <Choice4 />}
        </>
      )}
    </div>
  );
}
