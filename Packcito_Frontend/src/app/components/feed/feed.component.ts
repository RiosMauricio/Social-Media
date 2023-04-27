import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  search = ""
  categories: Category[]=[]
  users: User[] = []
  userCategories = []
  user =  new User

  constructor(private categoryService: CategoryService, private userService: UserService, private router: Router) { 
    this.user = new User()
  }

  ngOnInit(): void {
    this.getCategories(); 
    this.getUsers()
  }

  getCategories(){
    this.categoryService.getCategories().subscribe((result: any)=>{
      result.data.category.forEach((element: any) => {
        this.categories.push(element)
      });
    })
  }

  getUsers(){
    this.userService.getAllUsers().subscribe((result: any)=>{
      result.data.users.forEach((element: any) => {
        this.users.push(element)
        this.getUserCategories(element.id)
      });
    })
    console.log(this.users)
  }

  filterByCategory(categoryId: number){
    this.categoryService.getCategoryUsers(categoryId).subscribe((result: any)=>{
      this.users = []
      result.data.categories.forEach((element: any) => {
        this.userService.getUser(element.B).subscribe((user: any)=>{
          this.users.push(user.data.user)
        })
      });
      console.log(this.users)
    })
  }

  getUser(userId: number){
    this.router.navigate(['/profile/'+userId]);
  }

  getUserCategories(userId: number){
    this.userService.getUserCategories(userId).subscribe((result: any)=>{
      console.log(userId, result.data.categories)
    })
  }

  getUserCategoryName(categoryId: number){
    this.categoryService.getCategory(categoryId).subscribe((result: any)=>{
      console.log(result)
    })
  }
  
  searchUser(username: string) {
    this.users = []
    if (username != "") {
      this.userService.searchUsers(username).subscribe((result: any) => {
        result.data.users.forEach((element: any) => {
          this.users.push(element)
        });
      })
    }else{
      this.getUsers()
    }
  }

}
