export function calculateNetIds(numSubnets: number) {
  // Calcolo il numero di bit necessari per rappresentare tutte le sotto reti
  const numBits = Math.ceil(Math.log2(numSubnets));

  const netIds = [];

  // Creazione del netId per ogni sotto rete
  for (let i = 0; i < numSubnets; i++) {
    const netId = i.toString(2).padStart(numBits, "0");
    netIds.push(netId);
  }

  return netIds;
}

export function calculateVariableBits(subnets: number[]) {
  // Ordino le sotto reti in ordine decrescente e aggiungo 3 bit per il netId, broadcast e gateway
  return subnets
    .sort((a, b) => b - a)
    .map((bits) => bits + 3)
    .map((hosts) => Math.ceil(Math.log2(hosts)));
}

export function calculateNetIdsVariable(totalBits: number, subnets: number[]) {
  // Calcolo il numero di bit necessari per rappresentare tutte le sotto reti
  const hosts = calculateVariableBits(subnets);

  // Controllo che i bit per le sotto reti non siano troppi per la maschera di sottorete
  for (let i = 0; i < hosts.length; i++) {
    if (hosts[i] > totalBits) {
      throw new Error("Dati non validi");
    }

    if (totalBits - hosts[i] <= 0) {
      throw new Error("Dati non validi");
    }
  }

  const netIds = [];

  // Creazione del netId per ogni sotto rete
  let netId = "0".repeat(totalBits - hosts[0]);

  netIds.push(netId);

  // Creazione del netId per le altre sotto reti
  for (let i = 1; i < subnets.length; i++) {
    const length = netId.length;

    netId = (parseInt(netId, 2) + 1).toString(2);
    netId = netId.padStart(length, "0");
    netId = netId.padEnd(totalBits - hosts[i], "0");

    if (netId.length > length) {
      throw new Error("Dati non validi");
    }

    netIds.push(netId);
  }

  return netIds;
}

export function convertToBinOctets(dec: string) {
  const binOctets = [];

  // Conversione di ogni ottetto in binario
  for (const octet of dec.split(".")) {
    binOctets.push(parseInt(octet).toString(2).padStart(8, "0"));
  }

  return binOctets;
}

export function convertToDecOctets(bin: string) {
  const octets = [];

  // Conversione di ogni ottetto in decimale
  for (let i = 0; i < bin.length; i += 8) {
    const octet = bin.slice(i, i + 8);
    octets.push(parseInt(octet, 2));
  }

  return octets;
}

export function findClass(ip: string) {
  // Controllo il primo ottetto per determinare la classe dell'indirizzo IP
  const ipArray = ip.split(".");
  const firstOctet = parseInt(ipArray[0]);

  // Determino la classe dell'indirizzo IP in base agli intervalli di valori del primo ottetto
  if (firstOctet >= 1 && firstOctet <= 127) {
    return "A";
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    return "B";
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    return "C";
  } else {
    return "Sconosciuta";
  }
}

export function getIpBase(ip: string) {
  // Determino la classe dell'indirizzo IP
  const ipClass = findClass(ip);

  // Restituisco l'indirizzo IP base in base alla classe
  switch (ipClass) {
    case "A":
      return ip.split(".").slice(0, 1).join(".");
    case "B":
      return ip.split(".").slice(0, 2).join(".");
    case "C":
      return ip.split(".").slice(0, 3).join(".");
    default:
      return null;
  }
}

export function isPrivate(ip: string) {
  // Controllo se l'indirizzo IP è privato in base agli intervalli di valori del primo e secondo ottetto
  const ipArray = ip.split(".");
  const firstOctet = parseInt(ipArray[0]);
  const secondOctet = parseInt(ipArray[1]);

  // Determino se l'indirizzo IP è privato in base agli intervalli di valori del primo e secondo ottetto
  if (firstOctet === 10) {
    return true;
  } else if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) {
    return true;
  } else if (firstOctet === 192 && secondOctet === 168) {
    return true;
  } else {
    return false;
  }
}

export function calculateCidr(ipClass: string, numBits: number) {
  // Calcolo il CIDR in base alla classe dell'indirizzo IP e al numero di bit
  switch (ipClass) {
    case "A":
      return 8 + numBits;
    case "B":
      return 16 + numBits;
    case "C":
      return 24 + numBits;
    default:
      return -1;
  }
}

export function calculateMaxSubnets(ipClass: string) {
  // Calcolo il numero massimo di sotto reti in base alla classe dell'indirizzo IP
  switch (ipClass) {
    case "A":
      return 4194304;
    case "B":
      return 16384;
    case "C":
      return 128;
    default:
      return -1;
  }
}

export function calculateClassBits(ipClass: string) {
  // Calcolo il numero di bit per la classe dell'indirizzo IP
  switch (ipClass) {
    case "A":
      return 24;
    case "B":
      return 16;
    case "C":
      return 8;
  }

  throw new Error("Indirizzo IP non valido");
}

export function calculateSubnetMask(cidr: number) {
  // Calcolo la maschera di sottorete in base al CIDR
  const mask = "1".repeat(cidr).padEnd(32, "0");
  return mask;
}

export function downloadFile(content: string, name: string) {
  // Creo un file e lo scarico
  const link = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });

  link.href = URL.createObjectURL(file);
  link.download = name;
  link.click();

  URL.revokeObjectURL(link.href);
}

export function validateInput(ip: string) {
  // Controllo che l'indirizzo IP sia valido
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

export function validateSubnetMask(ip: string) {
  // Controllo che la maschera di sottorete sia valida
  const regex =
    /^(128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)$/;
  return regex.test(ip);
}
