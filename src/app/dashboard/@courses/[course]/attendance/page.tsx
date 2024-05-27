"use client";

import { useEffect, useRef, useState } from "react";

// Qr Scanner
import QrScanner from "qr-scanner";

const QrReader = ({ params }: { params: { course: string } }) => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // console.log(result);
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    const videoElement = videoEl.current; // Copy the ref to a local variable

    if (videoElement && !scanner.current) {
      // Instantiate the QR Scanner
      scanner.current = new QrScanner(videoElement, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoElement) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const currentDate = `${dd}/${mm}/${yyyy}`;
    return currentDate;
  };

  const courseId = params.course;
  interface Res {
    date: string;
    present: string[];
  }

  const [res, setRes] = useState<Res[]>([]);

  const markAttendance = async () => {
    const date = getTodayDate();
    scanner?.current?.stop();

    console.log(JSON.stringify({ courseId, rollNo: scannedResult, date }));

    const response = await fetch("https://track-orpin-tau.vercel.app/api/courses", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ courseId, rollNo: scannedResult, date }),
    });

    const r = await response.json();
    setRes(r);

    setScannedResult(undefined);
    scanner?.current?.start();
  };

  return (
    <div className="qr-reader">
      <div>Attendance: {params.course}</div>
      <video ref={videoEl} className="m-3 w-[500px]"></video>
      <div ref={qrBoxEl} className="m-3">
        {/* <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        /> */}
      </div>

      {scannedResult && (
        <p>
          Scanned Result: {scannedResult}
        </p>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 my-1 mx-3 rounded"
        onClick={markAttendance}
      >
        Mark
      </button>
      {res.map((i) => {
        return (
          <div key={i.date}>
            <div>{i.date}</div>
            {i.present.map((j, index) => (
              <span key={index}>{j}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default QrReader;
