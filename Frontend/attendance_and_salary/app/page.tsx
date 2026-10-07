"use client";

import dynamic from "next/dynamic";

// Dynamically import components and disable SSR to fix hydration errors
const RegistrationForm = dynamic(() => import("@/components/RegistrationForm"), {
  ssr: false,
});
const QrScanner = dynamic(() => import("@/components/QrScanner"), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Attendance System</h1>
      <RegistrationForm />
      <hr style={{ margin: "40px 0" }} />
      <QrScanner />
    </div>
  );
}