// server.js

import { app } from './src/app.js';
import { verificarConexion } from './src/config/db.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {

    console.log(` Servidor  en http://localhost:${PORT}`);
    await verificarConexion();

});
