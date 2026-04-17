import prisma from "@/lib/prisma";

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // inside km
}

export const pharmacyService = {
  async getCatalog(query?: string) {
    if (!query) {
      return prisma.medicine.findMany({ take: 50 });
    }
    return prisma.medicine.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { saltComposition: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ]
      },
      take: 50,
    });
  },

  async findNearestFulfillmentPharmacy(items: { medicineId: string; quantity: number }[], lat: number, lng: number) {
    const pharmacies = await prisma.partnerPharmacy.findMany({
      where: { isVerified: true },
      include: { inventory: true },
    });

    const validPharmacies = pharmacies.filter((p) => {
      if (!p.lat || !p.lng) return false;
      const distance = getDistance(lat, lng, p.lat, p.lng);
      if (distance > 15) return false; // Max 15km delivery radius

      // Check stock
      for (const item of items) {
        const inv = p.inventory.find(i => i.medicineId === item.medicineId);
        if (!inv || inv.stock < item.quantity) {
          return false;
        }
      }
      return true;
    });

    if (validPharmacies.length === 0) return null;

    // Sort by nearest
    validPharmacies.sort((a, b) => getDistance(lat, lng, a.lat!, a.lng!) - getDistance(lat, lng, b.lat!, b.lng!));
    
    return validPharmacies[0];
  }
};
