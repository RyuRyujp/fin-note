import {
  Utensils,
  Bus,
  ShoppingBag,
  Home,
  CircleDollarSign,
} from "lucide-react";
import { theme } from "@/lib/theme";

export function CategoryIcon({ category }: { category: string }) {
  const size = 18;
  const color = theme.primary;

  switch (category) {
    case "食費":
      return <Utensils size={size} color={color} />;
    case "交通費":
      return <Bus size={size} color={color} />;
    case "日用品":
      return <ShoppingBag size={size} color={color} />;
    case "生活費":
      return <Home size={size} color={color} />;
    default:
      return <CircleDollarSign size={size} color={color} />;
  }
}
