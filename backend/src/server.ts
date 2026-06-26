import { app } from "./app.js";
import { env } from "./env.js";

const host = env.NODE_ENV === "production" ? "0.0.0.0" : env.HOST;
const server = app.listen(env.PORT, host, () => {
  console.log(`Paikan backend running on http://${host}:${env.PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start Paikan backend:", error);
  process.exit(1);
});
