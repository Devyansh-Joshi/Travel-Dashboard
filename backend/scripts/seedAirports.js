const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const AIRPORTS = {
  Tokyo: "HND",
  Delhi: "DEL",
  Mumbai: "BOM",
  London: "LHR",
  Paris: "CDG",
};

async function main() {
  for (const [city, code] of Object.entries(AIRPORTS)) {
    await prisma.city.updateMany({
      where: { name: city },
      data: { airportCode: code },
    });
  }
}

main().finally(() => prisma.$disconnect());
