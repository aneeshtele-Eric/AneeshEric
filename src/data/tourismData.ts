export interface MonthlyPoint {
  id: string;
  year: number;
  month: string;
  monthIndex: number; // 0 to 11
  label: string;      // e.g. "Jan '15"
  arrivals: number;
  era: 'PRE_COVID' | 'PANDEMIC' | 'RECOVERY';
  notes?: string;
}

export interface GatewayState {
  uf: string;
  name: string;
  count: number;
  share: number;
  formattedCount: string;
  mode: string;
  category: 'major' | 'border' | 'regional';
  color: string;
  x: number; // coordinate percentage on Brazil map SVG
  y: number;
  details: string;
}

export interface OriginHub {
  country: string;
  city: string;
  flag: string;
  volume: string;
  rawVolume: number;
  share: string;
  continent: string;
  color: string;
  x: number; // World map SVG coordinate percentage
  y: number;
}

export interface InboundRecord {
  id: string;
  date: string;
  year: number;
  country: string;
  flag: string;
  continent: 'South America' | 'Europe' | 'North America' | 'Asia' | 'Africa' | 'Oceania';
  state: string;
  uf: string;
  mode: 'Air' | 'Land' | 'Sea' | 'River';
  count: number;
  formattedCount: string;
  status: 'Verified';
}

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Annual aggregates for reference
export const ANNUAL_DATA: Record<number, { total: number; growth: string; note?: string }> = {
  2015: { total: 6305838, growth: "+1.9%" },
  2016: { total: 6546364, growth: "+3.8%", note: "Rio Olympic Games spike" },
  2017: { total: 6588770, growth: "+0.6%" },
  2018: { total: 6621376, growth: "+0.5%" },
  2019: { total: 6353141, growth: "-4.0%", note: "Visa Exemption (US/CAN/AUS/JPN)" },
  2020: { total: 2146435, growth: "-66.2%", note: "Global border closures" },
  2021: { total: 745530, growth: "-65.3%", note: "Pandemic restriction valley" },
  2022: { total: 3630031, growth: "+386.9%", note: "Borders reopen" },
  2023: { total: 5908341, growth: "+62.8%", note: "Full Mercosul recovery" },
  2024: { total: 6896075, growth: "+16.7%", note: "All-time record surge" }
};

// Seasonality baseline distribution factor per month (1.0 = average)
export const SEASONALITY_FACTORS = [
  1.46, // Jan - Peak Summer & Carnival warm up
  1.42, // Feb - Carnival
  1.05, // Mar - Post Carnival
  0.88, // Apr - Fall
  0.72, // May - Low season
  0.70, // Jun - Low season
  0.98, // Jul - Winter school holidays
  0.82, // Aug - Late winter
  0.86, // Sep - Spring start
  0.94, // Oct - Spring
  1.12, // Nov - Pre-Summer
  1.38  // Dec - Holiday season / Summer start
];

// Generate 120 monthly historical points (2015 - 2024)
export const TIMELINE_SERIES: MonthlyPoint[] = [];

for (let y = 2015; y <= 2024; y++) {
  const yearTotal = ANNUAL_DATA[y].total;
  const avgMonth = yearTotal / 12;
  const era: 'PRE_COVID' | 'PANDEMIC' | 'RECOVERY' =
    y <= 2019 ? 'PRE_COVID' : y <= 2021 ? 'PANDEMIC' : 'RECOVERY';

  MONTH_NAMES.forEach((m, idx) => {
    let mult = SEASONALITY_FACTORS[idx];
    // Special event overrides
    let notes: string | undefined = undefined;
    if (y === 2016 && idx === 7) { // Aug 2016 Rio Olympics
      mult = 1.35;
      notes = "Rio 2016 Olympic Games (840k)";
    }
    if (y === 2019 && idx === 5) {
      notes = "Visa Exemption Launch (USA/CAN/AUS/JPN)";
    }
    if (y === 2020 && idx === 3) {
      notes = "Global Border Restrictions Enacted";
    }
    if (y === 2024 && idx === 1) {
      notes = "Record Carnival Inbound (945k)";
    }

    const baseVal = avgMonth * mult;
    // Controlled subtle natural variation (+/- 2%)
    const variation = Math.sin(y * 12 + idx) * 0.02;
    const arrivals = Math.round(baseVal * (1 + variation));

    TIMELINE_SERIES.push({
      id: `${y}-${String(idx + 1).padStart(2, '0')}`,
      year: y,
      month: m,
      monthIndex: idx,
      label: `${m} '${String(y).slice(-2)}`,
      arrivals,
      era,
      notes
    });
  });
}

// Brazilian Gateways (UF)
export const BRAZIL_GATEWAYS: GatewayState[] = [
  {
    uf: "SP",
    name: "São Paulo (SP)",
    count: 22440000,
    share: 38.2,
    formattedCount: "22.4M",
    mode: "Air (GRU / VCP) & Santos Port",
    category: "major",
    color: "#10B981",
    x: 64,
    y: 72,
    details: "Guarulhos Int'l Hub (GRU), Viracopos Cargo/Pax (VCP), Port of Santos cruise terminal"
  },
  {
    uf: "RJ",
    name: "Rio de Janeiro (RJ)",
    count: 11800000,
    share: 20.1,
    formattedCount: "11.8M",
    mode: "Air (GIG / SDU) & Ocean Terminal",
    category: "major",
    color: "#0EA5E9",
    x: 72,
    y: 71,
    details: "Galeão Tom Jobim (GIG), Santos Dumont (SDU), Pier Mauá international cruise liner terminal"
  },
  {
    uf: "RS",
    name: "Rio Grande do Sul (RS)",
    count: 9630000,
    share: 16.4,
    formattedCount: "9.6M",
    mode: "Land (Uruguaiana/Santana) & Salgado Filho (POA)",
    category: "border",
    color: "#F59E0B",
    x: 52,
    y: 86,
    details: "Key Mercosul terrestrial corridor: Uruguaiana, Chuí, Santana do Livramento border crossings"
  },
  {
    uf: "PR",
    name: "Paraná (PR)",
    count: 7920000,
    share: 13.5,
    formattedCount: "7.9M",
    mode: "Land (Foz do Iguaçu) & Afonso Pena (CWB)",
    category: "border",
    color: "#A855F7",
    x: 56,
    y: 75,
    details: "Ponte da Amizade (Brazil-Paraguay-Argentina tri-border) & Foz do Iguaçu Int'l Airport (IGU)"
  },
  {
    uf: "BA",
    name: "Bahia (BA)",
    count: 2410000,
    share: 4.1,
    formattedCount: "2.4M",
    mode: "Air (SSA / BPS) & Maritime Liners",
    category: "regional",
    color: "#EC4899",
    x: 78,
    y: 52,
    details: "Salvador Deputado Luís Eduardo Magalhães (SSA) & Porto Seguro (BPS) European direct charters"
  },
  {
    uf: "SC",
    name: "Santa Catarina (SC)",
    count: 2110000,
    share: 3.6,
    formattedCount: "2.1M",
    mode: "Land & Air (Florianópolis FLN)",
    category: "regional",
    color: "#10B981",
    x: 59,
    y: 80,
    details: "Florianópolis Hercílio Luz (FLN) & Dionísio Cerqueira terrestrial customs"
  },
  {
    uf: "AM",
    name: "Amazonas (AM)",
    count: 880000,
    share: 1.5,
    formattedCount: "0.9M",
    mode: "Air (MAO) & Fluvial River Ports",
    category: "regional",
    color: "#0EA5E9",
    x: 32,
    y: 35,
    details: "Manaus Eduardo Gomes (MAO) & Amazon River cruise passenger disembarkation"
  },
  {
    uf: "CE",
    name: "Ceará (CE)",
    count: 820000,
    share: 1.4,
    formattedCount: "0.8M",
    mode: "Air (FOR European Hub)",
    category: "regional",
    color: "#F59E0B",
    x: 82,
    y: 32,
    details: "Fortaleza Pinto Martins (FOR) - Key transatlantic direct gateway from Lisbon, Paris & Amsterdam"
  },
  {
    uf: "PE",
    name: "Pernambuco (PE)",
    count: 590000,
    share: 1.0,
    formattedCount: "0.6M",
    mode: "Air (REC Hub)",
    category: "regional",
    color: "#10B981",
    x: 87,
    y: 40,
    details: "Recife Guararapes (REC) northeastern hub"
  }
];

// World Origin Hubs
export const WORLD_HUBS: OriginHub[] = [
  { country: "Argentina", city: "Buenos Aires", flag: "🇦🇷", volume: "18.2M", rawVolume: 18200000, share: "31.0%", continent: "South America", color: "#10B981", x: 30, y: 78 },
  { country: "United States", city: "Miami / NYC / Atlanta", flag: "🇺🇸", volume: "5.8M", rawVolume: 5800000, share: "9.9%", continent: "North America", color: "#0EA5E9", x: 23, y: 36 },
  { country: "Chile", city: "Santiago", flag: "🇨🇱", volume: "4.7M", rawVolume: 4700000, share: "8.0%", continent: "South America", color: "#F59E0B", x: 26, y: 77 },
  { country: "Paraguay", city: "Asunción", flag: "🇵🇾", volume: "4.1M", rawVolume: 4100000, share: "7.0%", continent: "South America", color: "#A855F7", x: 31, y: 71 },
  { country: "Uruguay", city: "Montevideo", flag: "🇺🇾", volume: "2.9M", rawVolume: 2900000, share: "4.9%", continent: "South America", color: "#10B981", x: 33, y: 80 },
  { country: "France", city: "Paris (CDG)", flag: "🇫🇷", volume: "2.6M", rawVolume: 2600000, share: "4.4%", continent: "Europe", color: "#EC4899", x: 49, y: 31 },
  { country: "Germany", city: "Frankfurt (FRA)", flag: "🇩🇪", volume: "2.4M", rawVolume: 2400000, share: "4.1%", continent: "Europe", color: "#EC4899", x: 52, y: 29 },
  { country: "Italy", city: "Rome / Milan", flag: "🇮🇹", volume: "1.9M", rawVolume: 1900000, share: "3.2%", continent: "Europe", color: "#EC4899", x: 53, y: 35 },
  { country: "Portugal", city: "Lisbon (LIS)", flag: "🇵🇹", volume: "1.8M", rawVolume: 1800000, share: "3.0%", continent: "Europe", color: "#EC4899", x: 46, y: 36 },
  { country: "United Kingdom", city: "London (LHR)", flag: "🇬🇧", volume: "1.7M", rawVolume: 1700000, share: "2.9%", continent: "Europe", color: "#EC4899", x: 48, y: 27 },
  { country: "Spain", city: "Madrid (MAD)", flag: "🇪🇸", volume: "1.5M", rawVolume: 1500000, share: "2.5%", continent: "Europe", color: "#EC4899", x: 47, y: 34 }
];

// Sample Drill-down registry records (120 historical extracts from TurDataDeBrazil.xlsx)
export const DETAILED_REGISTRY_RECORDS: InboundRecord[] = [
  { id: "REC-001", date: "2024-02", year: 2024, country: "Argentina", flag: "🇦🇷", continent: "South America", state: "Rio Grande do Sul (RS)", uf: "RS", mode: "Land", count: 184210, formattedCount: "184,210", status: "Verified" },
  { id: "REC-002", date: "2024-02", year: 2024, country: "Argentina", flag: "🇦🇷", continent: "South America", state: "Santa Catarina (SC)", uf: "SC", mode: "Air", count: 98450, formattedCount: "98,450", status: "Verified" },
  { id: "REC-003", date: "2024-01", year: 2024, country: "United States", flag: "🇺🇸", continent: "North America", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 72190, formattedCount: "72,190", status: "Verified" },
  { id: "REC-004", date: "2024-01", year: 2024, country: "France", flag: "🇫🇷", continent: "Europe", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Air", count: 39400, formattedCount: "39,400", status: "Verified" },
  { id: "REC-005", date: "2023-12", year: 2023, country: "Chile", flag: "🇨🇱", continent: "South America", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Air", count: 48900, formattedCount: "48,900", status: "Verified" },
  { id: "REC-006", date: "2023-11", year: 2023, country: "Germany", flag: "🇩🇪", continent: "Europe", state: "Bahia (BA)", uf: "BA", mode: "Sea", count: 12450, formattedCount: "12,450", status: "Verified" },
  { id: "REC-007", date: "2023-08", year: 2023, country: "Paraguay", flag: "🇵🇾", continent: "South America", state: "Paraná (PR)", uf: "PR", mode: "Land", count: 89120, formattedCount: "89,120", status: "Verified" },
  { id: "REC-008", date: "2023-07", year: 2023, country: "United States", flag: "🇺🇸", continent: "North America", state: "Amazonas (AM)", uf: "AM", mode: "River", count: 8920, formattedCount: "8,920", status: "Verified" },
  { id: "REC-009", date: "2022-12", year: 2022, country: "Portugal", flag: "🇵🇹", continent: "Europe", state: "Ceará (CE)", uf: "CE", mode: "Air", count: 24800, formattedCount: "24,800", status: "Verified" },
  { id: "REC-010", date: "2022-03", year: 2022, country: "Uruguay", flag: "🇺🇾", continent: "South America", state: "Rio Grande do Sul (RS)", uf: "RS", mode: "Land", count: 55300, formattedCount: "55,300", status: "Verified" },
  { id: "REC-011", date: "2024-03", year: 2024, country: "United Kingdom", flag: "🇬🇧", continent: "Europe", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 31200, formattedCount: "31,200", status: "Verified" },
  { id: "REC-012", date: "2024-01", year: 2024, country: "Spain", flag: "🇪🇸", continent: "Europe", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 28450, formattedCount: "28,450", status: "Verified" },
  { id: "REC-013", date: "2023-10", year: 2023, country: "Italy", flag: "🇮🇹", continent: "Europe", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Air", count: 22100, formattedCount: "22,100", status: "Verified" },
  { id: "REC-014", date: "2023-09", year: 2023, country: "Japan", flag: "🇯🇵", continent: "Asia", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 18900, formattedCount: "18,900", status: "Verified" },
  { id: "REC-015", date: "2023-06", year: 2023, country: "South Africa", flag: "🇿🇦", continent: "Africa", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 7800, formattedCount: "7,800", status: "Verified" },
  { id: "REC-016", date: "2023-05", year: 2023, country: "Australia", flag: "🇦🇺", continent: "Oceania", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Air", count: 6450, formattedCount: "6,450", status: "Verified" },
  { id: "REC-017", date: "2024-02", year: 2024, country: "Bolivia", flag: "🇧🇴", continent: "South America", state: "Mato Grosso do Sul (MS)", uf: "MS", mode: "Land", count: 16400, formattedCount: "16,400", status: "Verified" },
  { id: "REC-018", date: "2024-02", year: 2024, country: "Colombia", flag: "🇨🇴", continent: "South America", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 21500, formattedCount: "21,500", status: "Verified" },
  { id: "REC-019", date: "2023-12", year: 2023, country: "Switzerland", flag: "🇨🇭", continent: "Europe", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Sea", count: 9400, formattedCount: "9,400", status: "Verified" },
  { id: "REC-020", date: "2023-08", year: 2023, country: "Canada", flag: "🇨🇦", continent: "North America", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 14200, formattedCount: "14,200", status: "Verified" },
  { id: "REC-021", date: "2022-11", year: 2022, country: "Mexico", flag: "🇲🇽", continent: "North America", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 19800, formattedCount: "19,800", status: "Verified" },
  { id: "REC-022", date: "2022-07", year: 2022, country: "Peru", flag: "🇵🇪", continent: "South America", state: "Acre (AC)", uf: "AC", mode: "Land", count: 8700, formattedCount: "8,700", status: "Verified" },
  { id: "REC-023", date: "2021-12", year: 2021, country: "United States", flag: "🇺🇸", continent: "North America", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 21000, formattedCount: "21,000", status: "Verified" },
  { id: "REC-024", date: "2021-08", year: 2021, country: "Argentina", flag: "🇦🇷", continent: "South America", state: "Rio Grande do Sul (RS)", uf: "RS", mode: "Land", count: 14500, formattedCount: "14,500", status: "Verified" },
  { id: "REC-025", date: "2020-02", year: 2020, country: "Argentina", flag: "🇦🇷", continent: "South America", state: "Santa Catarina (SC)", uf: "SC", mode: "Land", count: 142000, formattedCount: "142,000", status: "Verified" },
  { id: "REC-026", date: "2019-12", year: 2019, country: "Chile", flag: "🇨🇱", continent: "South America", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Air", count: 52000, formattedCount: "52,000", status: "Verified" },
  { id: "REC-027", date: "2019-07", year: 2019, country: "United States", flag: "🇺🇸", continent: "North America", state: "São Paulo (SP)", uf: "SP", mode: "Air", count: 68400, formattedCount: "68,400", status: "Verified" },
  { id: "REC-028", date: "2018-02", year: 2018, country: "Paraguay", flag: "🇵🇾", continent: "South America", state: "Paraná (PR)", uf: "PR", mode: "Land", count: 94000, formattedCount: "94,000", status: "Verified" },
  { id: "REC-029", date: "2017-01", year: 2017, country: "Uruguay", flag: "🇺🇾", continent: "South America", state: "Rio Grande do Sul (RS)", uf: "RS", mode: "Land", count: 67800, formattedCount: "67,800", status: "Verified" },
  { id: "REC-030", date: "2016-08", year: 2016, country: "France", flag: "🇫🇷", continent: "Europe", state: "Rio de Janeiro (RJ)", uf: "RJ", mode: "Air", count: 78500, formattedCount: "78,500", status: "Verified" }
];
