import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { LogInService } from 'src/app/services/log-in.service';
import { Package } from 'src/app/models/package';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostComponent } from '../post/post.component';
import { PackageService } from 'src/app/services/package.service';


@Component({
  selector: 'app-pack',
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.css']
})
export class PackComponent implements OnInit {
  userLoggedId!: number; 
  packId!: number; 
  post = new Post; 
  posts: Post[] = []
  pack = new Package; 

  constructor(private loginService: LogInService, private packageService: PackageService,private postService: PostService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog) { 
    this.post = new Post(); 
    this.pack = new Package();
    if (loginService.userLoggedIn() == false) {
      this.router.navigate(['log-in']);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packId = params['packId'];
    })

    this.userLoggedId = this.loginService.userLoggedId()!;

    this.getPack(); 

    this.postService.getPostsByPackage(this.packId).subscribe((result: any)=>{
      result.data.posts.forEach((post: any) => {
        //Si el post tiene mas de una imagen o video cargado, se carga la primera en el post a mostrar 
        //para la vista previa del post 
        if(post.media.includes(";")){
          const media = post.media.split(";")[0];
          console.log(media)
          this.posts.push({ ...post, media });
        }
        //si no es el caso, se muestra el post normalmente.
        else{
          this.posts.push(post);
        }
      });
    })
  }

  getPack(){
    this.packageService.getPack(this.packId).subscribe((result: any)=>{
      this.pack = result; 
    })
    console.log(this.pack)
  }

  getPost(postId: number){
    const dialogRef = this.dialog.open(PostComponent, {
      data: { postId: postId }
    });
  }

  createPost() {
    const dialogRef = this.dialog.open(PostFormComponent, {
      data: { packId: this.packId }
    });
  }

}
