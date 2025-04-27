import requests
from dotenv import load_dotenv, find_dotenv
import os
import time

# Try to find your .env file
env_path = find_dotenv()
load_dotenv(dotenv_path=env_path, override=True)
USDA_API_KEY = os.getenv("USDA_API_KEY")


# 3. Base URL stays the same
USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

def generate_query_variants(food_name: str):
    """Generate different variants of the food name to try."""
    variants = [
        food_name,                          # original
        food_name.lower(),                  # all lowercase
        food_name.capitalize(),             # Capitalized
        food_name + "s",                    # plural
        food_name + "es",                   # plural alternative
        food_name.replace(" ", ""),          # remove spaces
        "fresh " + food_name,                # add "fresh"
        "cooked " + food_name                # add "cooked"
    ]
    seen = set()
    return [v for v in variants if not (v in seen or seen.add(v))]

def fetch_food_data(food_name: str, max_attempts: int = 8, delay_seconds: int = 1):
    """Fetch food data from USDA API trying multiple modified food names."""
    query_variants = generate_query_variants(food_name)
    attempts = 0

    for variant in query_variants:
        if attempts >= max_attempts:
            break

        params = {
            "query": variant,
            "pageSize": 1,
            "api_key": USDA_API_KEY
        }

        try:
            print(f"Trying '{variant}'...")
            response = requests.get(USDA_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            if data.get("foods"):
                print(f"Found match with '{variant}'!")
                return data["foods"][0]
            else:
                print(f"No food found for '{variant}'.")
        except requests.exceptions.RequestException as e:
            print(f"Request error for '{variant}': {e}")

        attempts += 1
        time.sleep(delay_seconds)

    print(f"Failed to fetch data for '{food_name}' after {max_attempts} attempts.")
    return None

def get_food_nutrition(food_name: str):
    food = fetch_food_data(food_name)
    if not food:
        return

    description = food.get("description", "Unknown Description")
    
    # Initialize macros
    macros = {
        "calories": None,
        "protein_g": None,
        "carbs_g": None,
        "fat_g": None
    }

    for nutrient in food.get("foodNutrients", []):
        name = nutrient.get("nutrientName", "").lower()
        value = nutrient.get("value")
        unit = nutrient.get("unitName", "")

        if "energy" in name and unit == "KCAL":
            macros["calories"] = value
        elif "protein" in name:
            macros["protein_g"] = value
        elif "carbohydrate" in name:
            macros["carbs_g"] = value
        elif "total lipid" in name or "total fat" in name:
            macros["fat_g"] = value

    print(f"{description} per 100g:")
    print(f"Calories: {macros['calories']} kcal")
    print(f"Protein: {macros['protein_g']} g")
    print(f"Carbs: {macros['carbs_g']} g")
    print(f"Fat: {macros['fat_g']} g")

if __name__ == "__main__":
    food = input("Enter a food name: ")
    get_food_nutrition(food)
