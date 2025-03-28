import { OpenAI } from "openai";
import dotenv from "dotenv";
import readlineSync from 'readline-sync';

dotenv.config({ path: "./.env" });

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/nebius/v1",
  apiKey: process.env.HUGGING_API_KEY,
});

const systemPrompt = `
You are an AI powered assistant that automates vendor qualification and procurement workflows.
Follow this process strictly:

1. Ask the user what product/service they need.
2. Ask about quantity and delivery deadline.
3. Contact vendors via email API (mocked in this script).
4. Collect and extract quotes (price, availability, delivery time, terms).
5. Compare vendor responses and select the best one.
6. If a vendor qualifies, ask the user if they want to schedule a meeting or auto-place an order.

**Strictly return responses in JSON format.**

Valid Responses:
{"type": "output", "user": "What product or service do you need?"}
{"type": "output", "user": "How many units do you need?"}
{"type": "output", "user": "What is your delivery deadline?"}
{"type": "output", "user": "I am reaching out to vendors for quotes."}
{"type": "output", "user": "The best vendor is XYZ Ltd. Would you like to schedule a meeting or auto-place the order?"}
{"type": "action", "function": "scheduleMeeting", "input": {"vendor": "XYZ Ltd", "email": "contact@xyz.com", "date": "2024-04-01"}}
{"type": "action", "function": "placeOrder", "input": {"vendor": "XYZ Ltd", "product": "Laptops", "quantity": 50, "price": "$500 each"}}
`;

const messages = [{ role: "system", content: systemPrompt }];
const userData = { product: null, quantity: null, deadline: null, bestVendor: null };

while (true) {
  const query = readlineSync.question('>> ');
  messages.push({ role: "user", content: query });

  const chat = await client.chat.completions.create({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1-fast",
    messages: messages,
  });

  const rawResponse = chat.choices[0].message.content;
  console.log("Raw API Response:", rawResponse);
  messages.push({ role: "assistant", content: rawResponse });

  try {
    const jsonMatches = rawResponse.match(/\{.*?\}/g);
    if (!jsonMatches) throw new Error("Invalid JSON response from AI");

    for (const jsonStr of jsonMatches) {
      const response = JSON.parse(jsonStr);

      if (response.type === "output") {
        console.log("Output:", response.user);
        
        if (response.user.toLowerCase().includes("product")) userData.product = query;
        if (response.user.toLowerCase().includes("units")) userData.quantity = parseInt(query.replace(/\D/g, ''), 10);
        if (response.user.toLowerCase().includes("deadline")) userData.deadline = query;
      }

      if (userData.product && userData.quantity && userData.deadline) {
        console.log("Reaching out to vendors...");
        console.log("Collecting quotes...");
        
        // Mock data
        userData.bestVendor = { name: "XYZ Ltd", email: "contact@xyz.com", price: "$500 each", delivery: "7 days" };
        
        messages.push({
          role: "assistant",
          content: JSON.stringify({
            type: "output",
            user: `The best vendor is ${userData.bestVendor.name}. Would you like to schedule a meeting or autoplace the order?`
          })
        })
      }
    }
  } catch (error) {
    console.error("Error parsing AI response:", error);
  }
}
