import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export const scanReceipt = async (imageUrl) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert receipt scanner. Extract expense information from receipt images. 
          Return ONLY a valid JSON object with the following structure:
          {
            "amount": number (total amount from receipt),
            "category": string (one of: Food & Drinking, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Groceries, Personal Care, Other),
            "subcategory": string (optional, e.g., "Lunch", "Taxi", "Gas"),
            "description": string (merchant name or brief description),
            "date": string (ISO 8601 format, extract from receipt or use current date if not found),
            "paymentMethod": string (one of: Cash, Credit Card, Debit Card, UPI, Net Banking, Other),
            "tags": string (comma-separated relevant tags)
          }
          
          Rules:
          - If amount is not found, return null for amount
          - If date is not found, use current date in ISO format
          - Match category based on merchant type and items (e.g., restaurant -> Food & Drinking, gas station -> Transportation)
          - Extract merchant name for description
          - Infer payment method if visible, otherwise use "Other"
          - Return valid JSON only, no additional text`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract expense information from this receipt image. Return only valid JSON."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    });

    const content = response.choices[0].message.content;
    
    
    let jsonString = content.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\n?/g, '');
    }

    const extractedData = JSON.parse(jsonString);
    
    
    const expenseData = {
      amount: extractedData.amount || null,
      category: extractedData.category || 'Other',
      subcategory: extractedData.subcategory || '',
      description: extractedData.description || '',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      paymentMethod: extractedData.paymentMethod || 'Other',
      tags: extractedData.tags || ''
    };

    return expenseData;
  } catch (error) {
    console.error('Receipt scanning error:', error);
    throw new Error(`Failed to scan receipt: ${error.message}`);
  }
};

export default client;
