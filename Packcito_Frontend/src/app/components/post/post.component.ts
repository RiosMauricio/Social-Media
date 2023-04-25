import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { LogInService } from 'src/app/services/log-in.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post = new Post
  postMedia: Array<string> = []

  currentIndex = 0;
  
  //Metodos para manejar el desplazamiento de fotos/videos del post
  prev() {
    this.currentIndex = (this.currentIndex === 0) ? (this.postMedia.length - 1) : (this.currentIndex - 1);
  }
  
  next() {
    this.currentIndex = (this.currentIndex === this.postMedia.length - 1) ? 0 : (this.currentIndex + 1);
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private loginService: LogInService, private router: Router, private postService: PostService) { 
    this.post = new Post()
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    this.postService.getPost(this.data.postId).subscribe((result: any)=>{
      this.post = result.data.post;
      console.log(result)
      //se cargan las direcciones a las imagenes o videos del post
      this.postMedia = this.post.media.split(";")
    })
  }

}
