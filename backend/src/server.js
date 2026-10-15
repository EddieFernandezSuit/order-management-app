import app from './app.js';
import { startStatusProgression } from './data/orders.js';

const PORT = process.env.PORT || 5000;

startStatusProgression();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});