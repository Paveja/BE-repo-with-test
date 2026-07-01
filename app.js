// Load express module using `require` directive

// import multer from "multer";
// import { S3Client, PutObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
// import fs from "fs";
import express from "express";
import { WebSocketServer } from "ws";
// import { pipeline } from "stream";
// import { promisify } from "util";

let app = express();
// Define request response in root URL (/)
app.get("/", function (req, res) {
  res.send("Dockerize the node app");
});

// Define request response in root URL (/)
app.get("/user-vault/health", function (req, res) {
  res.json({
    project1: true,
    app1: true,
    success: true,
  });
});

// New Endpoint 1 - Get user details
app.get("/user-vault/user/:id", function (req, res) {
  res.json({
    id: req.params.id,
    name: "John Doe",
    role: "QA Engineer"
  });
});

// New Endpoint 2 - Create user
app.post("/user-vault/user", function (req, res) {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      success: false,
      message: "name and role are required"
    });
  }

  res.status(201).json({
    success: true,
    user: {
      id: 1,
      name,
      role
    }
  });
});



// Launch listening server on port 8081
export const server = app.listen(8080, function () {
  console.log("app listening on port 8080");
});

// // --- WEBSOCKET ENDPOINT ---
// const wss = new WebSocketServer({ server, path: "/ws" });

// wss.on("connection", (ws) => {
//   console.log("Client connected to WebSocket");

//   ws.send("Welcome to WebSocket!");

//   // Send message every 5 seconds
//   const intervalId = setInterval(() => {
//     if (ws.readyState === ws.OPEN) {
//       ws.send("Ping from server every 5 seconds");
//     }
//   }, 5000);

//   ws.on("message", (message) => {
//     console.log("Received:", message.toString());
//     ws.send(`You said: ${message}`);
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");

//     // Stop the interval when client disconnects
//     clearInterval(intervalId);
//   });

//   ws.on("error", (err) => {
//     console.error("Socket error:", err);
//     clearInterval(intervalId);
//   });
// });

// // Promisify pipeline for easier async/await
// app.use("/upload", express.raw({ type: "*/*", limit: "50mb" }));
// const s3 = new S3Client({
//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
//   },
// });
// app.post("/upload", async (req, res) => {
//   try {
//     const fileBuffer = req.body;
//     if (!fileBuffer || fileBuffer.length === 0) {
//       return res.status(400).send("No file received");
//     }

//     const bucketName = process.env.BUCKET_NAME ?? 'kendall-bucket-red-qa'
//     const key = "apple.png";

//     // Upload to S3
//     const command = new PutObjectCommand({
//       Bucket: bucketName,
//       Key: key,
//       Body: fileBuffer,
//       ContentType: req.headers["content-type"] || "application/octet-stream",
//     });

//     await s3.send(command);

//     res.status(200).send({ message: "File uploaded successfully", key });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error uploading file");
//   }
// });

// const streamPipeline = promisify(pipeline);

// app.get("/object", async (req, res) => {
//   const bucketName = "revolte-ramco-code-red";
//   const key = req.query.key; // pass ?key=apple.png

//   if (!key) {
//     return res.status(400).send("Missing key parameter");
//   }

//   try {
//     const command = new GetObjectCommand({
//       Bucket: bucketName,
//       Key: key,
//     });

//     const response = await s3.send(command);

//     // Set headers so the browser downloads the file
//     res.setHeader(
//       "Content-Type",
//       response.ContentType || "application/octet-stream"
//     );
//     res.setHeader("Content-Disposition", `attachment; filename="${key}"`);

//     // Pipe the S3 stream to the client response
//     await streamPipeline(response.Body, res);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error downloading object");
//   }
// });

export default app;