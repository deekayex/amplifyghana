import { onRequest } from "firebase-functions/v2/https";
import next from "next";

const app = next({
  dev: false,
  conf: { distDir: ".next" }
});

const handle = app.getRequestHandler();

let isPrepared = false;

export const ssramplifyghana = onRequest(async (req, res) => {
  if (!isPrepared) {
    await app.prepare();
    isPrepared = true;
  }
  return handle(req, res);
});
