const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3000;
const dbConn = require("./app/config/db");
dbConn();
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:3005",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const authRoutes = require("./app/routes/route.auth");

app.use("/word-suggestion/v1", authRoutes);

app.post("/predict", async (req, res) => {
  const { input, fetchedWords } = req.body;
  console.log("Received input in node:", input);

  const scriptPath = path.join(__dirname, "app", "search", "predict_word.py");
  const pythonProcess = spawn("python", [
    scriptPath,
    input,
    JSON.stringify(fetchedWords),
  ]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    //console.log("stdout: " + data.toString());
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    //console.error("stderr: " + data.toString());
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      const prediction = output.trim();
      //console.log("Prediction:", prediction);

      // Parse the predictions
      const parsedPrediction = JSON.parse(prediction.replace(/'/g, '"'));
      res.send({ prediction: parsedPrediction });
    } else {
      console.error("Error in Python script:", errorOutput);

      res
        .status(500)
        .send({ error: "Prediction failed", message: errorOutput });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
