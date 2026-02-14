import {
  Utensils,
  Bus,
  ShoppingBag,
  Home,
  CircleDollarSign,
} from "lucide-react";

export function CategoryIcon({ category }: { category: string }) {
  const size = 18;

  switch (category) {
    case "食費":
      return <Utensils size={size} />;
    case "交通費":
      return <Bus size={size} />;
    case "日用品":
      return <ShoppingBag size={size} />;
    case "生活費":
      return <Home size={size} />;
    default:
      return <CircleDollarSign size={size} />;
  }
}
