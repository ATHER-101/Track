"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Overlay from "../../../../../components/Overlay";

const QrReader = ({ params }: { params: { course: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string>("");
  const [presentees, setPresentees] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    setScannedResult(result?.data);
    setMessage(null);
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    const videoElement = videoEl.current;

    if (videoElement && !scanner.current) {
      scanner.current = new QrScanner(videoElement, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: false,
        highlightCodeOutline: false,
        overlay: qrBoxEl.current || undefined,
        maxScansPerSecond: 5,
        calculateScanRegion: (videoElement) => {
          const sideLength =
            0.6 * Math.min(videoElement.videoWidth, videoElement.videoHeight);
          const x = (videoElement.videoWidth - sideLength) / 2;
          const y = (videoElement.videoHeight - sideLength) / 2;

          return {
            x: x,
            y: y,
            width: sideLength,
            height: sideLength,
          };
        },
      });

      const date = getTodayDate();

      fetch(`/api/courses/${params.course}`)
        .then((response) => response.json())
        .then((response) => {
          const att = response.attendance?.find((e: any) => e.date === date);
          if (att === undefined) {
            setPresentees([]);
          } else {
            setPresentees(att?.present);
          }
          setEnrolled(response.students);
        })
        .catch((error) => console.log(error));

      setLoading(false);

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoElement) {
        scanner.current?.stop();
      }
    };
  }, []);

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

  const markAttendance = async () => {
    const date = getTodayDate();
    // scanner.current?.stop();

    if (!!enrolled && !enrolled.includes(scannedResult)) {
      console.log(`${scannedResult} is not enrolled in this course!`);
      setMessage(`${scannedResult} is not enrolled in this course!`);
      setScannedResult("");
    } else if (!!presentees && presentees.includes(scannedResult)) {
      console.log(`Attendance already marked for ${scannedResult}!`);
      setMessage(`${scannedResult} is already marked!`);
      setScannedResult("");
    } else if (scannedResult !== "") {
      setMessage(null);

      setPresentees([scannedResult, ...presentees]);

      console.log(JSON.stringify({ courseId, rollNo: scannedResult, date }));

      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ courseId, rollNo: scannedResult, date }),
      });

      // const res = await response.json();
      // console.log(res);

      setScannedResult("");
      // scanner.current?.start();
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} className="qr-reader">
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingBottom: "100%", // 1:1 aspect ratio
              overflow: "hidden",
            }}
          >
            <video
              ref={videoEl}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            ></video>
            <Overlay />
          </Box>
          {scannedResult && (
            <>
              <TextField
                value={scannedResult}
                label="Scanned Result"
                variant="outlined"
                fullWidth
                size="medium"
                InputProps={{
                  readOnly: true,
                  sx: {
                    fontSize: 20, // Increase font size of the input text
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: 18, // Increase font size of the label text
                  },
                }}
                sx={{ my: 2 }}
              />
              <Button onClick={markAttendance} variant="outlined" fullWidth>
                Mark
              </Button>
            </>
          )}
          {message && (
            <Button color="error" variant="outlined" fullWidth sx={{ mt: 2 }}>
              {message}
            </Button>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {loading ? (
          <Skeleton
            variant="rounded"
            sx={{bgcolor: "white", width: "100%", minHeight: "100%" }}
          />
        ) : (
          <Paper
            sx={{ bgcolor: "white", width: "100%", minHeight: "100%", p: 1 }}
          >
            <Grid container spacing={1}>
              {presentees?.map((presentee: string, index) => {
                return (
                  <Grid key={index} item xs={4} md={4}>
                    <Button variant="outlined" sx={{ width: "100%" }}>
                      {presentee}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default QrReader;
