import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
        const info = await transporter.sendMail({
            from: `"HealthCare+" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}

export async function sendBookingConfirmation(appointment: any) {
    const { patient, hospital, doctor, service, startTime, type, videoLink } = appointment;
    const dateStr = new Date(startTime).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const timeStr = new Date(startTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const isVideo = type === "VIDEO_CALL";
    const subject = isVideo
        ? "Video Consultation Confirmed - HealthCare+"
        : "Appointment Receipt & Confirmation - HealthCare+";

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #3b82f6; text-align: center;">HealthCare+</h2>
      <p>Hello <strong>${patient.name}</strong>,</p>
      <p>Your appointment has been successfully booked and paid.</p>
      
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Hospital:</strong> ${hospital.name}</p>
        <p><strong>Service:</strong> ${service.name}</p>
        <p><strong>Doctor:</strong> ${doctor ? doctor.name : "General Consultation"}</p>
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Time:</strong> ${timeStr}</p>
        <p><strong>Type:</strong> ${isVideo ? "Video Call" : "In-Person"}</p>
        <p><strong>Amount Paid:</strong> ₹${(service.price / 100).toFixed(2)}</p>
      </div>

      ${isVideo ? `
        <div style="text-align: center; margin: 30px 0;">
          <p>Your video consultation link is ready:</p>
          <a href="${videoLink}" style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold;">Join Video Call</a>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Click the button at the scheduled time to consult with your doctor.</p>
        </div>
      ` : `
        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46; font-weight: bold;">In-Person Receipt</p>
          <p style="margin: 5px 0 0; color: #065f46; font-size: 14px;">Please present this email at the hospital counter to skip the queue and proceed directly to your consultation.</p>
        </div>
      `}

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666; text-align: center;">
        Thank you for choosing HealthCare+. If you have any questions, please contact the hospital directly.
      </p>
    </div>
  `;

    return sendEmail({ to: patient.email, subject, html });
}
