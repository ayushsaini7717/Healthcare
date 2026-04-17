import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean old orders, agents, inventories, medicines, pharmacies to prevent unique constraints issues on re-run
  await prisma.orderItem.deleteMany()
  await prisma.medicineOrder.deleteMany()
  await prisma.deliveryAgent.deleteMany()
  await prisma.pharmacyInventory.deleteMany()
  await prisma.medicine.deleteMany()
  await prisma.partnerPharmacy.deleteMany()

  // 1. Create Pharmacies
  console.log('Creating Pharmacies...')
  const p1 = await prisma.partnerPharmacy.create({
    data: {
      name: 'Apollo Pharmacy Central',
      location: 'MG Road, City Center',
      lat: 28.6139,
      lng: 77.2090,
      contactInfo: '+91-9876543210',
      isVerified: true,
    }
  })

  // 2. Create Medicines
  console.log('Creating Medicines...')
  const m1 = await prisma.medicine.create({
    data: {
      name: 'Paracetamol 500mg',
      saltComposition: 'Paracetamol',
      manufacturer: 'GSK',
      category: 'Fever',
      mrp: 30.0,
      discountPrice: 25.0,
      prescriptionRequired: false,
    }
  })

  const m2 = await prisma.medicine.create({
      data: {
          name: 'Azithromycin 500mg',
          saltComposition: 'Azithromycin',
          manufacturer: 'Cipla',
          category: 'Antibiotic',
          mrp: 120.0,
          discountPrice: 100.0,
          prescriptionRequired: true,
      }
  })

  // 3. Create Inventory
  console.log('Creating Inventory...')
  await prisma.pharmacyInventory.create({
    data: {
      pharmacyId: p1.id,
      medicineId: m1.id,
      stock: 500
    }
  })

  await prisma.pharmacyInventory.create({
    data: {
      pharmacyId: p1.id,
      medicineId: m2.id,
      stock: 200
    }
  })

  // 4. Create Delivery Agents
  console.log('Creating Delivery Agents...')
  await prisma.deliveryAgent.create({
    data: {
      name: 'Raju Bhai',
      phone: '9999999999',
      vehicleNumber: 'DL 1A XYZ 1234',
      isAvailable: true,
      currentLat: 28.6140,
      currentLng: 77.2091
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
