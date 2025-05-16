import app from './app.js';
import {PORT} from './config.js';
import indexRoutes from './routes/index.routes.js';

app.use(indexRoutes);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

