const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking for hospitals...");
  const hospitalCount = await prisma.hospital.count();

  if (hospitalCount === 0) {
    console.log("No hospitals found. Inserting dummy data...");

    const hospital = await prisma.hospital.create({
      data: {
        name: "City General Hospital",
        address: "123 Health St",
        city: "New Delhi",
        status: "APPROVED",
        services: {
          create: [
            { name: "Cardiology", price: 50000 },
            { name: "Neurology", price: 75000 },
            { name: "Orthopedics", price: 60000 },
          ],
        },
        doctors: {
          create: [
            { name: "Dr. Arvind Kumar", specialty: "Cardiology" },
            { name: "Dr. Sarah Johnson", specialty: "Neurology" },
          ],
        },
      },
    });

    console.log("Created hospital:", hospital.name);

    const doctors = await prisma.doctor.findMany({
      where: { hospitalId: hospital.id },
    });

    const services = await prisma.service.findMany({
      where: { hospitalId: hospital.id },
    });

    console.log("Creating time slots...");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const timeSlots = [];
    for (let i = 9; i < 17; i++) {
      const start = new Date(today);
      start.setUTCHours(i, 0, 0, 0);
      const end = new Date(today);
      end.setUTCHours(i, 30, 0, 0);

      timeSlots.push({
        hospitalId: hospital.id,
        doctorId: doctors[0].id,
        startTime: start,
        endTime: end,
        isBooked: false,
      });

      const start2 = new Date(today);
      start2.setUTCHours(i, 30, 0, 0);
      const end2 = new Date(today);
      end2.setUTCHours(i + 1, 0, 0, 0);

      timeSlots.push({
        hospitalId: hospital.id,
        doctorId: doctors[1].id,
        startTime: start2,
        endTime: end2,
        isBooked: false,
      });
    }

    await prisma.timeSlot.createMany({
      data: timeSlots,
    });

    console.log("Dummy data inserted successfully.");
  } else {
    console.log(`${hospitalCount} hospitals already exist. Skipping seed.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
