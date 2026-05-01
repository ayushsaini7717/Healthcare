const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const hospitalsData = [
  {
    "name": "Doon Medical College & Hospital",
    "district": "Dehradun",
    "subdistrict": "Dehradun",
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Amit Sharma", "experience": 12, "qualification": "MD Medicine" },
          { "name": "Dr. Neha Verma", "experience": 8, "qualification": "MBBS, MD" }
        ],
        "services": [
          { "name": "OPD Consultation (Gen. Med.)", "charge": 50 },
          { "name": "Follow-up Visit (Gen. Med.)", "charge": 20 }
        ]
      },
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Rajesh Singh", "experience": 10, "qualification": "MS Orthopedics" }
        ],
        "services": [
          { "name": "Bone Consultation", "charge": 60 },
          { "name": "Fracture Checkup", "charge": 80 }
        ]
      },
      {
        "name": "Pediatrics",
        "doctors": [
          { "name": "Dr. Pooja Joshi", "experience": 7, "qualification": "MD Pediatrics" }
        ],
        "services": [
          { "name": "Child Specialist OPD", "charge": 40 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Haridwar",
    "district": "Haridwar",
    "subdistrict": "Haridwar",
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Sandeep Kumar", "experience": 9, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 30 }
        ]
      },
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Ritu Saxena", "experience": 11, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Women's Health OPD", "charge": 40 }
        ]
      }
    ]
  },
  {
    "name": "Civil Hospital Roorkee",
    "district": "Haridwar",
    "subdistrict": "Roorkee",
    "departments": [
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Vivek Chauhan", "experience": 6, "qualification": "MS Orthopedics" }
        ],
        "services": [
          { "name": "Joint Pain Consultation", "charge": 50 }
        ]
      }
    ]
  },
  {
    "name": "Base Hospital Haldwani",
    "district": "Nainital",
    "subdistrict": "Haldwani",
    "departments": [
      {
        "name": "Cardiology",
        "doctors": [
          { "name": "Dr. Anil Pandey", "experience": 14, "qualification": "DM Cardiology" }
        ],
        "services": [
          { "name": "Heart Checkup", "charge": 100 }
        ]
      },
      {
        "name": "Neurology",
        "doctors": [
          { "name": "Dr. Kavita Rawat", "experience": 10, "qualification": "DM Neurology" }
        ],
        "services": [
          { "name": "Neuro Consultation", "charge": 120 }
        ]
      }
    ]
  },
  {
    "name": "Sushila Tiwari Government Hospital",
    "district": "Nainital",
    "subdistrict": "Haldwani",
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Deepak Bisht", "experience": 8, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 50 }
        ]
      },
      {
        "name": "Emergency",
        "doctors": [
          { "name": "Dr. Manoj Negi", "experience": 9, "qualification": "MBBS, Emergency Care" }
        ],
        "services": [
          { "name": "Emergency Care", "charge": 0 }
        ]
      }
    ]
  },
  {
    "name": "JLN District Hospital Rudrapur",
    "district": "Udham Singh Nagar",
    "subdistrict": "Rudrapur",
    "departments": [
      {
        "name": "Pediatrics",
        "doctors": [
          { "name": "Dr. Meena Bora", "experience": 6, "qualification": "MD Pediatrics" }
        ],
        "services": [
          { "name": "Child OPD", "charge": 30 }
        ]
      }
    ]
  },
  {
    "name": "Base Hospital Srinagar",
    "district": "Pauri Garhwal",
    "subdistrict": "Srinagar",
    "departments": [
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Shalini Rawat", "experience": 10, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Pregnancy Checkup", "charge": 40 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Almora",
    "district": "Almora",
    "subdistrict": "Almora",
    "departments": [
      {
        "name": "General Medicine",
        "doctors": [
          { "name": "Dr. Mohit Tiwari", "experience": 7, "qualification": "MD Medicine" }
        ],
        "services": [
          { "name": "OPD Consultation", "charge": 30 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Pithoragarh",
    "district": "Pithoragarh",
    "subdistrict": "Pithoragarh",
    "departments": [
      {
        "name": "Orthopedics",
        "doctors": [
          { "name": "Dr. Ajay Karki", "experience": 9, "qualification": "MS Orthopedics" }
        ],
        "services": [
          { "name": "Fracture Treatment", "charge": 60 }
        ]
      }
    ]
  },
  {
    "name": "District Hospital Champawat",
    "district": "Champawat",
    "subdistrict": "Champawat",
    "departments": [
      {
        "name": "Gynecology",
        "doctors": [
          { "name": "Dr. Sunita Joshi", "experience": 8, "qualification": "MS Gynecology" }
        ],
        "services": [
          { "name": "Women's Health OPD", "charge": 30 }
        ]
      }
    ]
  }
];

async function main() {
  console.log("Cleaning up existing data...");
  // Use a transaction to clear everything
  await prisma.$transaction([
    prisma.appointment.deleteMany(),
    prisma.timeSlot.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.service.deleteMany(),
    prisma.hospital.deleteMany(),
  ]);
  console.log("Cleanup complete.");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  for (const hData of hospitalsData) {
    console.log(`Creating hospital: ${hData.name}`);
    
    const hospital = await prisma.hospital.create({
      data: {
        name: hData.name,
        address: hData.subdistrict,
        city: hData.district,
        status: "APPROVED",
      }
    });

    for (const dept of hData.departments) {
      // Create Services (Departments/Procedures)
      for (const serviceData of dept.services) {
        await prisma.service.create({
          data: {
            name: `${dept.name} - ${serviceData.name}`,
            price: serviceData.charge * 100, // Charge in paise
            hospitalId: hospital.id,
          }
        });
      }

      // Create Doctors
      for (const docData of dept.doctors) {
        const doctor = await prisma.doctor.create({
          data: {
            name: docData.name,
            specialty: dept.name, // Use department as specialty
            hospitalId: hospital.id,
          }
        });

        // Create Time Slots for today and tomorrow for each doctor
        const timeSlots = [];
        const dates = [today, tomorrow];
        
        for (const date of dates) {
          for (let hour = 9; hour < 17; hour++) {
            const start = new Date(date);
            start.setUTCHours(hour, 0, 0, 0);
            const end = new Date(date);
            end.setUTCHours(hour, 30, 0, 0);

            timeSlots.push({
              hospitalId: hospital.id,
              doctorId: doctor.id,
              startTime: start,
              endTime: end,
              isBooked: false,
            });

            const start2 = new Date(date);
            start2.setUTCHours(hour, 30, 0, 0);
            const end2 = new Date(date);
            end2.setUTCHours(hour + 1, 0, 0, 0);

            timeSlots.push({
              hospitalId: hospital.id,
              doctorId: doctor.id,
              startTime: start2,
              endTime: end2,
              isBooked: false,
            });
          }
        }

        await prisma.timeSlot.createMany({
          data: timeSlots,
        });
      }
    }
  }

  console.log("Seeding complete successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
