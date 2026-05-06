export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "sup" | "kayak" | "city-bike" | "mtb";
  categoryLabel: string;
  description: string;
  shortDescription: string;
  pricePerHour: number;
  pricePerDay: number;
  image: string;
  gallery: string[];
  features: string[];
  available: boolean;
  stock?: number;
};

export const CATEGORIES = [
  { id: "sup", label: "SUP Board", icon: "🏄", description: "Istraži vodu na SUP dasci", image: "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?w=800&q=80" },
  { id: "kayak", label: "Kajak", icon: "🛶", description: "Veslaj kroz prirodu", image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80" },
  { id: "city-bike", label: "City Bike", icon: "🚲", description: "Razgledaj grad na dva točka", image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80" },
  { id: "mtb", label: "MTB Bike", icon: "🚵", description: "Osvoji planinske staze", image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80" },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "sup-board-explorer",
    name: "SUP Board Explorer",
    category: "sup",
    categoryLabel: "SUP Board",
    description: "Stabilan i izdržljiv SUP board idealan za početnike i iskusne veslače. Dolazi sa veslom, pumpom i sigurnosnim kaišem. Savršen za mirne vode, jezera i lagane reke.",
    shortDescription: "Stabilan SUP board za sve nivoe iskustva",
    pricePerHour: 800,
    pricePerDay: 3000,
    image: "https://images.unsplash.com/photo-1526188717906-ab4a2f949f48?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526188717906-ab4a2f949f48?w=800&q=80",
      "https://images.unsplash.com/photo-1599242299498-6e8db4799126?w=800&q=80",
    ],
    features: ["Uključeno veslo", "Pumpa", "Sigurnosni kaiš", "Vodootporna torba"],
    available: true,
  },
  {
    id: "2",
    slug: "sup-board-pro",
    name: "SUP Board Pro",
    category: "sup",
    categoryLabel: "SUP Board",
    description: "Profesionalni SUP board za zahtevnije veslače. Lakši i brži od Explorer modela, idealan za duže ture i treninge.",
    shortDescription: "Profesionalni SUP board za napredne",
    pricePerHour: 1000,
    pricePerDay: 4000,
    image: "https://images.unsplash.com/photo-1599242299498-6e8db4799126?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599242299498-6e8db4799126?w=800&q=80",
    ],
    features: ["Carbon veslo", "Brza pumpa", "Sigurnosni kaiš", "Premium torba"],
    available: true,
  },
  {
    id: "3",
    slug: "kajak-adventure",
    name: "Kajak Adventure",
    category: "kayak",
    categoryLabel: "Kajak",
    description: "Nafuvi kajak za dvoje sa svom potrebnom opremom. Stabilan, lak za transport i idealan za istraživanje reka i jezera.",
    shortDescription: "Nafuvi kajak za dvoje — stabilni avantura",
    pricePerHour: 1200,
    pricePerDay: 4500,
    image: "https://images.unsplash.com/photo-1604715892639-f491adb0ef44?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604715892639-f491adb0ef44?w=800&q=80",
    ],
    features: ["Za 2 osobe", "2 vesla", "Sigurnosni prsluci", "Vodootporna torba"],
    available: true,
  },
  {
    id: "4",
    slug: "kajak-solo",
    name: "Kajak Solo",
    category: "kayak",
    categoryLabel: "Kajak",
    description: "Kompaktan nafuvi kajak za jednu osobu. Lagan, brz i jednostavan za upravljanje.",
    shortDescription: "Lagan solo kajak za brzo veslanje",
    pricePerHour: 900,
    pricePerDay: 3500,
    image: "https://images.unsplash.com/photo-1604715892639-f491adb0ef44?w=800&q=80",
    gallery: [],
    features: ["Za 1 osobu", "Veslo", "Sigurnosni prsluk", "Pumpa"],
    available: true,
  },
  {
    id: "5",
    slug: "city-bike-classic",
    name: "City Bike Classic",
    category: "city-bike",
    categoryLabel: "City Bike",
    description: "Klasičan gradski bicikl sa korpom, savršen za razgledanje grada i kratke ture. Udoban i lak za vožnju.",
    shortDescription: "Udoban gradski bicikl sa korpom",
    pricePerHour: 400,
    pricePerDay: 1500,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    ],
    features: ["Korpa", "Svetlo", "Brava", "Kaciga"],
    available: true,
  },
  {
    id: "6",
    slug: "city-bike-electric",
    name: "City Bike Electric",
    category: "city-bike",
    categoryLabel: "City Bike",
    description: "Električni gradski bicikl sa baterijom do 60km dometa. Idealan za duže ture i uzbrda.",
    shortDescription: "Električni bicikl — do 60km dometa",
    pricePerHour: 700,
    pricePerDay: 2500,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    gallery: [],
    features: ["Električni motor", "60km domet", "Svetlo", "Brava", "Kaciga"],
    available: true,
  },
  {
    id: "7",
    slug: "mtb-trail-master",
    name: "MTB Trail Master",
    category: "mtb",
    categoryLabel: "MTB Bike",
    description: "Full suspension MTB bicikl za zahtevne planinske staze. 29\" točkovi, hidraulične kočnice i 12 brzina.",
    shortDescription: "Full suspension MTB za planinske staze",
    pricePerHour: 1000,
    pricePerDay: 4000,
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80",
    ],
    features: ["Full suspension", "29\" točkovi", "Hidraulične kočnice", "Kaciga"],
    available: true,
  },
  {
    id: "8",
    slug: "mtb-hardtail",
    name: "MTB Hardtail",
    category: "mtb",
    categoryLabel: "MTB Bike",
    description: "Hardtail MTB za lakše staze i šumske puteve. Lak i efikasan, idealan za početnike.",
    shortDescription: "Hardtail MTB za lakše terene",
    pricePerHour: 700,
    pricePerDay: 2800,
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80",
    gallery: [],
    features: ["Hardtail", "27.5\" točkovi", "Disk kočnice", "Kaciga"],
    available: false,
  },
];
