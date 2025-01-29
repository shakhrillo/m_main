const express = require("express");
const { exec } = require("child_process");
// const open = require("open");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files for simplicity (optional)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Render the UI
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Docker Manager</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 2rem auto;
          max-width: 600px;
          text-align: center;
        }
        input, button {
          padding: 10px;
          font-size: 16px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>Docker Manager</h1>
      <form action="/run" method="POST">
        <label for="envFile">Enter .env file name:</label><br>
        <input type="text" id="envFile" name="envFile" value=".env" required><br>
        <button type="submit">Run Docker</button>
      </form>
    </body>
    </html>
  `);
});

// Handle Docker commands
app.post("/run", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const params = new URLSearchParams(body);
    const envFile = params.get("envFile");

    if (!envFile) {
      res.send("Error: .env file is required!");
      return;
    }

    const buildCommand = `docker-compose -p gmrscrap --env-file ${envFile} build`;
    const upCommand = `docker-compose -p gmrscrap --env-file ${envFile} up -d`;

    console.log(`Using .env file: ${envFile}`);
    exec(buildCommand, (buildErr, buildStdout, buildStderr) => {
      if (buildErr) {
        console.error(`Build error: ${buildStderr}`);
        res.send(`<p>Build failed: ${buildStderr}</p>`);
        return;
      }
      console.log(buildStdout);

      exec(upCommand, (upErr, upStdout, upStderr) => {
        if (upErr) {
          console.error(`Run error: ${upStderr}`);
          res.send(`<p>Run failed: ${upStderr}</p>`);
          return;
        }
        console.log(upStdout);
        res.send(`
          <p>Containers are up and running!</p>
          <pre>${upStdout}</pre>
        `);
      });
    });
  });
});

// Start the server and open the browser
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // open(`http://localhost:${PORT}`);
});
