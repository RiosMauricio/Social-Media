import { Package } from "./package";

export class Post {
  id!: number; 
  title!: string;
  description!: string; 
  media!: string; 
  createdAt!: Date; 
  valoration!: number;
  pack!: Package; 
  packId!: number; 
  // otras propiedades y métodos según tu necesidad
}