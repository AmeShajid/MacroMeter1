from google.generativeai import GenerativeModel, GenerationConfig
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

# Gemini setup
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GOOGLE_GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)
model = GenerativeModel('gemini-2.5-flash-preview-04-17')

def recognize_ingredients(image_path: str, weight: float):
    img = Image.open(image_path)

    prompt = prompt = f"""
You are decomposing a complex dish into its main ingredients for nutritional analysis.
The weight of the dish is {weight} grams for the nutritional analysis.

Please respond ONLY with a JSON object matching this schema:
{{
  "DishName": "(string - name of the dish, use best guess if not given)",
  "IngredientName": ["list of ingredient names (strings), using USDA standard ingredient names"],
  "IngredientPercentage": ["corresponding percentages (numbers, not strings), without % signs"]
}}

Example:
{{
  "DishName": "Chicken Over Rice",
  "IngredientName": ["grilled chicken", "white rice", "yogurt sauce", "lettuce", "tomatoes"],
  "IngredientPercentage": [40.0, 35.0, 15.0, 5.0, 5.0]
}}
"""

    generation_config = GenerationConfig(
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "DishName": {"type": "string"},
                "IngredientName": {
                    "type": "array",
                    "items": {"type": "string"},
                },
                "IngredientPercentage": {
                    "type": "array",
                    "items": {"type": "number"},
                },
            },
            "required": ["DishName", "IngredientName", "IngredientPercentage"],
        }
    )

    response = model.generate_content(
        [prompt, img],
        generation_config=generation_config
    )

    # Parse the JSON string into a Python dict
    json_output = json.loads(response.candidates[0].content.parts[0].text)
    print(json_output)
    return json_output

if __name__ == "__main__":
    test_image_path = "ai\inference\chipotler.png"
    weight = float(input("Enter the weight of the dish in grams: "))
    result = recognize_ingredients(test_image_path, weight)
    print(result)

    
    # result = recognize_ingredients(test_image_path)
    # print(result)
