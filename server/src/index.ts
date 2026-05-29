// Import the Express app instance
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

// Get the port number from environment variables
// Make sure you have a .env file with `PORT=3000` or similar
const port: number = process.env.PORT ? Number(process.env.PORT) : 3802;
await connectDB(); // Default to 3802 if PORT is not set

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`🚀 Exon is running on http://localhost:${port}`);
  // This message confirms that the server has started successfully
});
