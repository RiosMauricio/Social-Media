import { Category } from "./category";
import { Post } from "./post";
import { User } from "./user";

export class Package {
    id!: number; 
    title!: string; 
    description!: string; 
    icon!: string; 
    premium!: boolean;
    author!: User;  
    authorId!: number; 
    posts!: Post[]; 
    valoration!: number; 
    // otras propiedades y métodos según tu necesidad
  }