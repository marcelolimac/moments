import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { CommentService } from 'src/app/services/comment.service';

import { Moment } from 'src/app/Moments';
import { Comment } from 'src/app/Comment';

import { environment } from 'src/environments/environment';

import { faTimes, faEdit, faUserNinja } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;

  xIcon = faTimes;
  editIcon = faEdit;

  commentForm!: FormGroup

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.momentService.getMoment(id).subscribe(item => this.moment = item.data)

    this.commentForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required])
    })
  }

  get text() {
    return this.commentForm.get("text")!;
  }

  get username() {
    return this.commentForm.get("username")!;
  }

  removeHandler(id: number) {
    this.momentService.removeMoment(id).subscribe();
    this.messagesService.add("Momento excluido com sucesso");
    this.router.navigate(['/']);
  }

  onSubmit(formDirective: FormGroupDirective) {
    if(this.commentForm.invalid) {                // as validações no html são somente visuais, esse if que impede que o envio seja
      return;                                     // efetuado
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);
    this.commentService.createComment(data).subscribe(comment => {
      this.moment!.comments!.push(comment.data)
    });

    this.messagesService.add("Comentário adicionado");

    // aqui limpamos o formulário resetando ele
    this.commentForm.reset();
    formDirective.resetForm();
  }
}