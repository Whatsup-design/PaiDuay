import { app } from "./app.js";
import { env } from "./env.js";

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`Paiduay backend running on http://${env.HOST}:${env.PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start Paiduay backend:", error);
  process.exit(1);
});
