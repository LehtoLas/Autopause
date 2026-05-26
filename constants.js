export const MOCK_USERS = {
  "123456": {
    name: "Matti Meikäläinen", hetu: "",
    vehicles: [
      { plate: "ABC-123", code: "M1",  name: "Henkilöauto",    make: "Toyota",     model: "Corolla",     year: "2019", color: "Valkoinen", status: "ON" },
      { plate: "XYZ-789", code: "N1",  name: "Pakettiauto",    make: "Volkswagen", model: "Transporter", year: "2021", color: "Harmaa",    status: "ON" },
    ],
  },
  "654321": {
    name: "Liisa Virtanen", hetu: "",
    vehicles: [
      { plate: "DEF-456", code: "M1", name: "Henkilöauto", make: "Volvo", model: "V60", year: "2022", color: "Sininen", status: "ON" },
    ],
  },
};

export const BANKS = [
  { id: "op",      name: "OP",            color: "#FF6600", bg: "#FFF3E0" },
  { id: "nordea",  name: "Nordea",        color: "#0000A0", bg: "#E8E8F5" },
  { id: "spankki", name: "S-Pankki",      color: "#00833E", bg: "#E0F5EA" },
  { id: "danske",  name: "Danske Bank",   color: "#003755", bg: "#E0EAF0" },
  { id: "handels", name: "Handelsbanken", color: "#174291", bg: "#E8ECF8" },
  { id: "saastop", name: "Säästöpankki",  color: "#C8002A", bg: "#F5E0E5" },
];

export const VEHICLES = [
  { code: "M1",  name: "Henkilöauto" },
  { code: "M2",  name: "Linja-auto (≤5t)" },
  { code: "M3",  name: "Linja-auto (>5t)" },
  { code: "N1",  name: "Pakettiauto (≤3.5t)" },
  { code: "N2",  name: "Kuorma-auto (3.5–12t)" },
  { code: "N3",  name: "Kuorma-auto (>12t)" },
  { code: "L1e", name: "Mopo" },
  { code: "L3e", name: "Moottoripyörä" },
  { code: "L5e", name: "Kolmipyörä" },
  { code: "O1",  name: "Perävaunu (≤0.75t)" },
  { code: "O2",  name: "Perävaunu (0.75–3.5t)" },
  { code: "T",   name: "Traktori" },
];
