import { createApp } from '@/app.js';
import { env } from '@/config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[server] escuchando en http://localhost:${env.PORT}`);
});
