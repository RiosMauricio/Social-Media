import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { Package } from 'src/app/models/package';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { PackageService } from 'src/app/services/package.service';
import { LogInService } from 'src/app/services/log-in.service';
import { MatDialog } from '@angular/material/dialog';
import { PackFormComponent } from '../pack-form/pack-form.component';
import { SubscriptionComponent } from '../subscription/subscription.component';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id!: number; // ID del usuario del perfil
  userInSession = false; //variable que verifica que hay un usuario en sesion
  isSubscribed = false; //variable que verifica si el usuario en sesion esta suscrito al perfil
  userLoggedId!: number; //Id del usuario logueado, o usuario en sesion
  user = new User; // Objeto del usuario del perfil
  logUser = new User; // Objeto del usuario logueado

  pack = new Package;

  userFreePackages: Package[] = [] // Paquetes gratis del usuario
  userPayPackages: Package[] = [] // Paquetes pagos del usuario

  userCategories: Category[] = [] //Categorias del usuario del perfil
  userCategoriesName: String[] = [] //Nombre de las categorias del usuario del perfil

  constructor(
    private loginService: LogInService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private packageService: PackageService,
    private subscriptionService: SubscriptionService, 
    public dialog: MatDialog
  ) {
    this.user = new User(); // Inicializar objeto de usuario
    this.logUser = new User(); // Inicializar objeto de usuario logueado
    this.pack = new Package();  //Inicializar pack
  }

  ngOnInit(): void {
    //verificar si hay un usuario en sesion
    this.userInSession = this.loginService.userLoggedIn(); 
    // Obtener el ID del usuario de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })

    //Se obtiene el id del usuario en sesion
    this.userLoggedId = this.loginService.userLoggedId()!

    // Se cargan en la pagina los datos del usuario del perfil en el que se esta navegando
    this.getUser();
    this.getUserPackages(); 
    this.checkSubscription();

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
    })
  }

  // Obtener paquetes del usuario a traves del service de usuarios
  getUserPackages() {
    this.packageService.getPacksByUser(this.id).subscribe((result: any) => {
      // Añadir paquetes del usuario al arreglo de paquetes de usuario
      for (let i = 0; i < result.data.packages.length; i++) {
        if (result.data.packages[i].premium == false) {
          this.userFreePackages.push(result.data.packages[i])
        } else {
          this.userPayPackages.push(result.data.packages[i])
        }
      }
    })
  }

  getPack(packId: number) {
    if (this.loginService.userLoggedIn() == false) {
      this.dialog.open(DialogElementsExampleDialog);
    } else {
      this.router.navigate(['/pack', packId]);
    }
  }

  subscribe() {
    if (this.loginService.userLoggedIn() == false) {
      this.dialog.open(DialogElementsExampleDialog);
    } else {
      const dialogRef = this.dialog.open(SubscriptionComponent, {
        data: {
          subscriberId: this.userLoggedId,
          subscribedToId: this.user.id
        }
      });
    }
  }

  unSubscribe(){
    if (this.loginService.userLoggedIn() == false) {
      this.dialog.open(DialogElementsExampleDialog);
    } else {
      this.subscriptionService.unSubscribe(this.userLoggedId, this.user.id).subscribe((result: any)=>{
        window.location.reload()
      })
    }
  }

  checkSubscription(){
    this.subscriptionService.checkSubscription(this.userLoggedId, this.id).subscribe((result: any)=>{
      this.isSubscribed = result.isSubscribed
    })
  }

  createPackage() {
    this.dialog.open(PackFormComponent);
  }

}

@Component({
  selector: 'dialog-log-in',
  templateUrl: 'dialog-log-in.html',
  styleUrls: ['./profile.component.css']
})
export class DialogElementsExampleDialog {}







