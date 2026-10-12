"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

const API_BASE = "http://localhost:8081/api";

export default function QrScanner() {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    setError("");
    setResult(null);
    setScanning(true);

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        setError("No camera found on this device.");
        setScanning(false);
        return;
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      // Prefer a back camera if available, otherwise use the first one
      const backCamera = devices.find((d) =>
        d.label.toLowerCase().includes("back")
      );
      const cameraId = backCamera ? backCamera.id : devices[0].id;

      await scanner.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await scanner.stop();
          setScanning(false);
          await submitScan(decodedText);
        },
        () => {} // ignore per-frame scan errors
      );
    } catch (err) {
      console.error("Full camera error:", err);
      setError(
        "Camera error: " +
          (err?.message || err?.toString() || JSON.stringify(err))
      );
      setScanning(false);
    }
  };

  const submitScan = async (userId) => {
    try {
      const res = await axios.post(`${API_BASE}/attendance/scan`, { userId });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Scan failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Scan Attendance QR</h2>
      <div id="qr-reader" style={{ width: "100%" }} />

      {!scanning && (
        <button onClick={startScanning} style={{ marginTop: 10 }}>
          Start Scan
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>Action: {result.action}</p>
          <p>User ID: {result.record.userId}</p>
          {result.action === "DEPARTURE" && (
            <p>Total Pay: {result.totalPay}</p>
          )}
        </div>
      )}
    </div>
  );
}