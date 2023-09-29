import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  post = new Post
  file!: File
  packId!: number
  imageUrl!: string
  files!: File[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private postService: PostService) { 
    this.post = new Post()
  }

  ngOnInit(): void {
    this.packId = this.data.packId;
    this.post.media = "Post.png"
  }

  createPost(){
    if(this.files.length <=10){
      this.postService.createPost(this.packId, this.post, this.files).subscribe((result: any) => {
        console.log("guardado", result);
        window.location.reload();
      })
    }else{
      console.log("se permite un maximo de 10 archivos por post.")
    }
    
  }

  selectImage($event: any){
    this.files = $event.target.files;
  }

}
