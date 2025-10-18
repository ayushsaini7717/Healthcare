
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export default async function HospitalDashboard() {
  const session = (await getServerSession(authOptions as any)) as any;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to the Hospital Admin Dashboard!</h1>
      <p>If you can see this, your middleware is working correctly.</p>
      <hr style={{ margin: "1rem 0" }} />
      <h3>Your Session Details:</h3>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}