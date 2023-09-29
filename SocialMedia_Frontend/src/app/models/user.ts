import {Package} from './package'; 

export class User {
    id!: number;
    username!: string;
    password!: string;
    email!: string; 
    description!: string;
    categories!: []; 
    profilePhoto!: string; 
    banner!: string; 
    packs!: Package[];
    comments!: Comment[];  
    // otras propiedades y métodos según tu necesidad
  }