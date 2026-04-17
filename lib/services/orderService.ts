import prisma from "@/lib/prisma";

export const orderService = {
  async assignDeliveryAgent(orderId: string) {
    const order = await prisma.medicineOrder.findUnique({
      where: { id: orderId }
    });
    if (!order || !order.pharmacyId) return null;

    const pharmacy = await prisma.partnerPharmacy.findUnique({ where: { id: order.pharmacyId }});
    if (!pharmacy?.lat || !pharmacy?.lng) return null;

    // Find nearest available agent to the pharmacy
    const agents = await prisma.deliveryAgent.findMany({ where: { isAvailable: true }});
    if (agents.length === 0) return null;

    // Assign random available one for mock logic
    const agent = agents[0]; 

    return prisma.medicineOrder.update({
      where: { id: orderId },
      data: {
        deliveryAgentId: agent.id,
        status: "PROCESSING"
      }
    });
  },

  async deductInventory(orderId: string) {
    const order = await prisma.medicineOrder.findUnique({
      where: { id: orderId },
      include: { items: true }
    });
    
    if (!order || !order.pharmacyId) return;

    for (const item of order.items) {
      // Find the medicine ID via name (or better, tie item to medicineId explicitly in schema, but we'll lookup by name for MVP)
      const medicine = await prisma.medicine.findFirst({ where: { name: item.medicineName }});
      if (medicine) {
        const inv = await prisma.pharmacyInventory.findUnique({
           where: { pharmacyId_medicineId: { pharmacyId: order.pharmacyId, medicineId: medicine.id }}
        });
        if (inv) {
          await prisma.pharmacyInventory.update({
            where: { id: inv.id },
            data: { stock: inv.stock - item.quantity }
          });
        }
      }
    }
  }
};
