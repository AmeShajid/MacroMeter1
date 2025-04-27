#!/usr/bin/env python3
"""
dish_macro_calculator.py: Calculate the macros of a dish based on image recognition and USDA nutrition data.
"""

import argparse
from ImageGeminiDecomposer import recognize_ingredients
from MacroCalculator import fetch_food_data
import argparse
import json

def extract_macros_from_data(food):
    """
    Given a USDA food data dict, extract macros per 100g.
    Returns dict: calories, protein_g, carbs_g, fat_g.
    """
    macros = {"calories": 0.0, "protein_g": 0.0, "carbs_g": 0.0, "fat_g": 0.0}
    for nutrient in food.get("foodNutrients", []):
        name = nutrient.get("nutrientName", "").lower()
        value = nutrient.get("value", 0.0)
        unit = nutrient.get("unitName", "")
        if "energy" in name and unit == "KCAL":
            macros["calories"] = value
        elif "protein" in name:
            macros["protein_g"] = value
        elif "carbohydrate" in name:
            macros["carbs_g"] = value
        elif "total lipid" in name or "total fat" in name:
            macros["fat_g"] = value
    return macros


def calculate_dish_macros(image_path: str, weight: float):
    """
    Recognize ingredients and calculate total macros for the dish.

    Args:
        image_path: Path to the dish image.
        weight: Total weight of the dish in grams.

    Returns:
        dish_name (str), total_macros (dict)
    """
    result = recognize_ingredients(image_path, weight)
    dish_name = result.get("DishName", "Unknown Dish")
    ing_names = result.get("IngredientName", [])
    ing_pcts = result.get("IngredientPercentage", [])

    total_macros = {"calories": 0.0, "protein_g": 0.0, "carbs_g": 0.0, "fat_g": 0.0}

    for name, pct in zip(ing_names, ing_pcts):
        food = fetch_food_data(name)
        if not food:
            print(f"Warning: no nutrition data for {name}")
            continue
        macros_100g = extract_macros_from_data(food)

        # Compute the ingredient's portion weight based on its percentage of the dish
        portion_weight = weight * (pct / 100.0)

        # Scale macros based on portion weight (grams) since macros_100g is per 100g
        for k in total_macros:
            total_macros[k] += macros_100g[k] * (portion_weight / 100.0)

    return dish_name, total_macros


def main():
    parser = argparse.ArgumentParser(
        description="Calculate dish macros from image and USDA data, output JSON to file"
    )
    parser.add_argument("image", help="Path to dish image")
    parser.add_argument("weight", type=float, help="Weight of dish in grams")
    parser.add_argument(
        "-o", "--output", default="dish_macros.json",
        help="Path to save the JSON output (default: dish_macros.json)"
    )
    args = parser.parse_args()

    dish_name, macros = calculate_dish_macros(args.image, args.weight)

    output = {
        "DishName": dish_name,
        "Weight_g": args.weight,
        "Macros": {
            "calories": round(macros['calories'], 2),
            "protein_g": round(macros['protein_g'], 2),
            "carbs_g": round(macros['carbs_g'], 2),
            "fat_g": round(macros['fat_g'], 2)
        }
    }

    # Save JSON payload to file
    with open(args.output, 'w') as f:
        json.dump(output, f, indent=2)
    print(f"JSON output saved to {args.output}")


if __name__ == "__main__":
    import sys
    sys.argv = [
        "MacroCalculator.py",  # <-- dummy script name (ignored)
        "ai\inference\chipotler.png",  # Image path
        "700"  # Example dish weight in grams (you can change)
    ]
    main()
