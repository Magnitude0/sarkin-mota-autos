import { mutation } from "./_generated/server";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

type SeedCar = {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuel: string;
  bodyType: string;
  engine: string;
  transmission: string;
  color: string;
  status: "available" | "sold" | "reserved";
  badge: "" | "new" | "hot";
  description: string;
  images: string[];
};

const SAMPLE_CARS: SeedCar[] = [
  {
    title: "Mercedes-Benz G-Wagon AMG 2021",
    make: "Mercedes-Benz",
    model: "G-Wagon AMG",
    year: 2021,
    price: 185000000,
    mileage: "32,000 km",
    fuel: "Petrol",
    bodyType: "Luxury",
    engine: "4.0L V8 Biturbo",
    transmission: "Automatic",
    color: "Obsidian Black",
    status: "available" as const,
    badge: "hot" as const,
    description:
      "The machine that starts every conversation. This G-Wagon AMG landed straight from a US dealer auction with a clean title, zero mileage tampering and the full 150-point inspection passed. Command the room from Abuja to Lagos — this is the definitive statement of arrival.",
    images: [
      img("photo-1520031441872-265e4ff70366"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Lexus RX 350 2020",
    make: "Lexus",
    model: "RX 350",
    year: 2020,
    price: 42500000,
    mileage: "48,000 km",
    fuel: "Petrol",
    bodyType: "SUV",
    engine: "3.5L V6",
    transmission: "Automatic",
    color: "Pearl White",
    status: "available" as const,
    badge: "new" as const,
    description:
      "Silky smooth, bulletproof and unapologetically premium. The RX 350 is the family machine of choice for the man who wants comfort, reliability and resale value in one package. Carfax report available on request.",
    images: [
      img("photo-1549399542-7e3f8b79c341"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Toyota Land Cruiser 2019",
    make: "Toyota",
    model: "Land Cruiser",
    year: 2019,
    price: 98000000,
    mileage: "61,000 km",
    fuel: "Diesel",
    bodyType: "SUV",
    engine: "4.5L V8 Turbo Diesel",
    transmission: "Automatic",
    color: "Attitude Black",
    status: "available" as const,
    badge: "",
    description:
      "The King of the road, literally. A Nigerian favourite for a reason — unstoppable on any terrain, impossible to kill, and worth every kobo. This one comes fully serviced, Carfax verified and ready for the bush or the boardroom.",
    images: [
      img("photo-1606016159991-dfe4f2746ad5"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Range Rover Sport 2022",
    make: "Land Rover",
    model: "Range Rover Sport",
    year: 2022,
    price: 120000000,
    mileage: "24,000 km",
    fuel: "Petrol",
    bodyType: "SUV",
    engine: "3.0L I6 MHEV",
    transmission: "Automatic",
    color: "Santorini Black",
    status: "reserved" as const,
    badge: "hot" as const,
    description:
      "British luxury meets serious muscle. This Range Rover Sport is currently reserved, but machines like this don't wait — join the waitlist and be first in line for the next one to land.",
    images: [
      img("photo-1542362567-b07e54358753"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Porsche 911 Carrera 2020",
    make: "Porsche",
    model: "911 Carrera",
    year: 2020,
    price: 155000000,
    mileage: "18,000 km",
    fuel: "Petrol",
    bodyType: "Luxury",
    engine: "3.0L Twin-Turbo Flat-6",
    transmission: "PDK Automatic",
    color: "GT Silver",
    status: "available" as const,
    badge: "new" as const,
    description:
      "The benchmark. 0-100 in 4 seconds, German engineering at its absolute finest. If you want a machine that turns heads before it even starts, this is the one. Clean US title, Carfax verified.",
    images: [
      img("photo-1503376780353-7e6692767b70"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "BMW X5 xDrive40i 2021",
    make: "BMW",
    model: "X5 xDrive40i",
    year: 2021,
    price: 68500000,
    mileage: "39,000 km",
    fuel: "Petrol",
    bodyType: "SUV",
    engine: "3.0L TwinPower Turbo I6",
    transmission: "Automatic",
    color: "Carbon Black",
    status: "sold" as const,
    badge: "",
    description:
      "Gone to a happy owner! The X5 is one of our fastest movers — German handling, SUV space, executive presence. Similar spec arriving soon — chat My Bratha to be notified first.",
    images: [
      img("photo-1580273916550-e323be2ae537"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Tesla Model Y 2022",
    make: "Tesla",
    model: "Model Y",
    year: 2022,
    price: 88000000,
    mileage: "21,000 km",
    fuel: "Electric",
    bodyType: "Electric",
    engine: "Dual Motor AWD",
    transmission: "Single Speed",
    color: "Midnight Silver",
    status: "available" as const,
    badge: "new" as const,
    description:
      "The future has landed in Abuja. Zero fuel cost, autopilot, over-the-air updates — the Model Y is the smartest machine on our floor. Battery health report available. Charge it at home, fly past the fuel queues.",
    images: [
      img("photo-1560958089-b8a1929cea89"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Ford F-150 Raptor 2020",
    make: "Ford",
    model: "F-150 Raptor",
    year: 2020,
    price: 76000000,
    mileage: "43,000 km",
    fuel: "Petrol",
    bodyType: "Truck",
    engine: "3.5L EcoBoost V6",
    transmission: "Automatic",
    color: "Avalanche Grey",
    status: "available" as const,
    badge: "",
    description:
      "The beast for men who carry serious load. Baja-tuned suspension, towing power for days, and road presence that clears traffic by itself. Whether it's site work or weekend adventures, the Raptor delivers.",
    images: [
      img("photo-1533106418989-88406c7cc8ca"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
  {
    title: "Mercedes-Benz C300 2021",
    make: "Mercedes-Benz",
    model: "C300",
    year: 2021,
    price: 52000000,
    mileage: "36,000 km",
    fuel: "Petrol",
    bodyType: "Sedan",
    engine: "2.0L Turbo I4",
    transmission: "Automatic",
    color: "Iridium Silver",
    status: "available" as const,
    badge: "hot" as const,
    description:
      "Executive class, sensible price. The C300 gives you the three-pointed star presence with running costs that won't scare you. Perfect first Mercedes for the young professional on the move.",
    images: [
      img("photo-1549317661-bd32c8ce0db2"),
      img("photo-1492144534655-ae79c964c9d7"),
    ],
  },
];

const SAMPLE_INQUIRIES = [
  {
    name: "Aminu Ibrahim",
    phone: "0803 123 4567",
    email: "aminu@example.com",
    carInterest: "Toyota Land Cruiser 2019",
    message: "What is the final price? And can you deliver to Kano?",
    status: "new" as const,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    name: "Chidinma Okafor",
    phone: "0812 987 6543",
    email: "chidinma@example.com",
    carInterest: "Lexus RX 350 2020",
    message: "Interested in the 40% deposit plan. What's the monthly?",
    status: "contacted" as const,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    name: "Yusuf Bello",
    phone: "0701 555 8899",
    carInterest: "Range Rover Sport 2022",
    message: "Can you source a 2023 Range Rover Autobiography from the US?",
    status: "new" as const,
    createdAt: Date.now() - 1000 * 60 * 60 * 49,
  },
];

/**
 * Seed the showroom with demo machines + sample leads the first time the app
 * is used, so the site never looks empty. Idempotent via the settings table.
 */
export const seedIfEmpty = mutation({
  handler: async (ctx) => {
    const alreadySeeded = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "seeded"))
      .first();
    if (alreadySeeded) {
      return false;
    }

    const now = Date.now();
    for (const car of SAMPLE_CARS) {
      await ctx.db.insert("inventory", {
        ...car,
        createdAt: now,
        updatedAt: now,
      });
    }
    for (const lead of SAMPLE_INQUIRIES) {
      await ctx.db.insert("inquiries", lead);
    }
    await ctx.db.insert("settings", { key: "seeded", value: "true" });
    return true;
  },
});
