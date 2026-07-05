import { env } from "./env";
import { app } from "./src/app";

app.listen(env.PORT, () => {
  console.log(`📖 Cozy Reading Journal API running on http://localhost:${env.PORT}`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
});
