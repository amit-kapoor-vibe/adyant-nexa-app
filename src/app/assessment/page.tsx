import { MidnightLeakageDiagnostic } from "@/components/diagnostic/MidnightLeakageDiagnostic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dubai Brokerage Midnight Lead Leakage Diagnostic",
  description: "Calculate your agency's lost overseas property commissions from delayed midnight inquiry responses and discover recoverable revenue.",
  alternates: {
    canonical: "/assessment",
  },
};

export default function AssessmentWizardPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F8FA", paddingTop: "80px", paddingBottom: "60px" }}>
      <MidnightLeakageDiagnostic />
    </main>
  );
}
