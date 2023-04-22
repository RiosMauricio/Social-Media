import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { Package } from 'src/app/models/package';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { PackageService } from 'src/app/services/package.service';
import { LogInService } from 'src/app/services/log-in.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id!: number; // ID del usuario del perfil
  userLoggedId!: number;  
  user = new User; // Objeto del usuario del perfil
  logUser = new User; // Objeto del usuario logueado

  pack = new Package; 

  userFreePackages: Package[] = [] // Paquetes del usuario
  userPayPackages: Package[] = []

  userCategories: Category[] = [] //Categorias del usuario del perfil
  userCategoriesName: String[] = [] //Nombre de las categorias del usuario del perfil

  constructor(
    private loginService: LogInService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router, 
    private categoryService: CategoryService,
    private packageService: PackageService
  ) {
    this.user = new User(); // Inicializar objeto de usuario
    this.logUser  = new User(); // Inicializar objeto de usuario logueado
    this.pack = new Package();  //Inicializar pack
  }

  ngOnInit(): void {
    // Obtener el ID del usuario de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })

    //Se obtiene el id del usuario en sesion
    this.userLoggedId = this.loginService.userLoggedId()!

    // Se cargan en la pagina los datos del usuario del perfil en el que se esta navegando
    this.getUser();
    this.getUserPackages()

    // Obtener las categorías del usuario y sus nombres
    this.userService.getUserCategories(this.id).subscribe((result: any) => {
      // se carga un arreglo con los ids de las categorias del usuario, para asi poder buscar el 
      // nombre de las mismas en la base de datos
      for (var i = 0; i < result.data.categories.length; i++) {
        this.userCategories.push(result.data.categories[i].A)
        this.categoryService.getCategory(result.data.categories[i].A).subscribe((result) => {
          this.userCategoriesName.push(result.data.category.name)
        })
      }
    })
  }

  // Obtener información del usuario a traves del service de usuarios
  getUser() {
    this.userService.getUser(this.id).subscribe((result) => {
      this.user = result.data.user;

      // Verificar y actualizar las rutas de la foto de perfil y la imagen de portada del usuario
      // la cadena "uploads" puede variar dependiendo del nombre de la carpeta contenedora de imagenes en el servidor
      //Se realiza tanto para el banner como para la foto de perfil
      if (this.user.profilePhoto.startsWith("uploads\\")) {
        this.user.profilePhoto = this.user.profilePhoto.split("\\")[1]
      }
      if (this.user.banner.startsWith("uploads\\")) {
        this.user.banner = this.user.banner.split("\\")[1]
      }
    })
  }

  // Obtener paquetes del usuario a traves del service de usuarios
  getUserPackages() {
    this.packageService.getPackByUser(this.id).subscribe((result: any) => {
      // Añadir paquetes del usuario al arreglo de paquetes de usuario
      for (let i = 0; i < result.data.packages.length; i++) {
        if(result.data.packages[i].price == 0){
          this.userFreePackages.push(result.data.packages[i])
        }else{
          this.userPayPackages.push(result.data.packages[i])
        }
      }
    })
  }

  createPackage(){
    this.router.navigate(['/pack-form'])
  }

}






