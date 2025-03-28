This is a very basic prototype/MVP of an AI driven assistant designed to automate vendor qualification and procurement workflows. It streamlines the process of interacting with vendors, collecting quotes, and scheduling meetings by leveraging LLM based decision making and automation tools.

Features:-

1. Automates vendor qualification by asking key procurement questions.

2. Contacts vendors via email API (mocked in this version).

3. Extracts and compares vendor quotes (price, availability, terms, delivery time).

4. Recommends the best vendor based on extracted data.

5. Allows users to schedule a meeting with the best vendor or automatically place an order.

Tech Stack:-
Node.js
HuggingFace Inference API 
Google APIs 


How It Works :-

The assistant asks:
Step 1: What product/service do you need?
         How many units?
         What is your delivery deadline?

Step 2: It contacts vendors (mocked in this version) and retrieves quotes.

Step 3: It compares responses and selects the best vendor.

Step 4: The user can:
        a. Schedule a meeting with the vendor.
        b. Autoplace the order with the best terms.
