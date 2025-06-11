import { ProductWithCategory } from "./product";

export interface CartItem extends ProductWithCategory {
  quantity: number;
}
