import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(currentDirectory, "public");
const port = Number(process.env.PORT) || 4173;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(publicDirectory));

function parseFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

app.post("/api/add", (req, res) => {
  const firstNumber = parseFiniteNumber(req.body?.firstNumber);
  const secondNumber = parseFiniteNumber(req.body?.secondNumber);
  const fields = [];

  if (firstNumber === null) {
    fields.push("firstNumber");
  }

  if (secondNumber === null) {
    fields.push("secondNumber");
  }

  if (fields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid finite number in each field.",
      fields,
    });
  }

  return res.json({
    success: true,
    sum: firstNumber + secondNumber,
  });
});

app.get("/user-vault/health", (req, res) => {
  res.json({
    project1: true,
    app1: true,
    success: true,
  });
});

app.get("/user-vault/user/:id", (req, res) => {
  res.json({
    id: req.params.id,
    name: "John Doe",
    role: "QA Engineer",
  });
});

app.post("/user-vault/user", (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      success: false,
      message: "name and role are required",
    });
  }

  return res.status(201).json({
    success: true,
    user: {
      id: 1,
      name,
      role,
    },
  });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Send a valid JSON request body.",
    });
  }

  console.error("Unexpected request error", error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong. Try again.",
  });
});

export const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
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