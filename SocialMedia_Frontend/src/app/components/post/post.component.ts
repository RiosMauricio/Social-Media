import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';
import { LogInService } from 'src/app/services/log-in.service';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  userLoggedId!: number; 
  post = new Post
  comment = new Comment
  comments: Comment[] = []
  postMedia: Array<string> = []

  currentIndex = 0;

  //Metodos para manejar el desplazamiento de fotos/videos del post
  prev() {
    this.currentIndex = (this.currentIndex === 0) ? (this.postMedia.length - 1) : (this.currentIndex - 1);
  }

  next() {
    this.currentIndex = (this.currentIndex === this.postMedia.length - 1) ? 0 : (this.currentIndex + 1);
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private loginService: LogInService, private router: Router, private postService: PostService, 
    private commentService: CommentService, private userService: UserService) {
    this.post = new Post()
    this.comment = new Comment()
  }

  ngOnInit(): void {
    this.userLoggedId = this.loginService.userLoggedId()!; 
    this.getPost();
  }

  getPost() {
    this.postService.getPost(this.data.postId).subscribe((result: any) => {
      this.post = result.data.post;
      //se cargan las direcciones a las imagenes o videos del post
      this.postMedia = this.post.media.split(";")
      //se cargan los comentarios del post
      this.getPostComments();
    })
  }

  getPostComments(){
    this.commentService.getCommentByPost(this.post.id).subscribe((result: any)=>{
      //los comentarios del post se cargan en un arreglo momentaneo para visualizarlos.
      result.data.comments.forEach((element: any) => {
        this.userService.getUser(element.authorId).subscribe((data: any)=>{
          const authorName = data.data.user.username; 
          this.comments.push({...element, authorName: authorName})
        })
      });
    })
  }

  createComment(){
    this.commentService.createComment(this.comment, this.userLoggedId, this.post.id).subscribe((result: any)=>{
      console.log(result)
    })
  }

}
