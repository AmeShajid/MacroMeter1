declare module "*.json" {
  const value: {
    DishName: string;
    Weight_g: number;
    Macros: {
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    };
  };
  export default value;
}