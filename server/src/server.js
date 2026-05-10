import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);

  if (!env.hasValidGeminiApiKey) {
    console.log(
      "Config notice: Gemini API key is missing or still set to the placeholder value. Update server/.env before uploading PDFs."
    );
  }
});
