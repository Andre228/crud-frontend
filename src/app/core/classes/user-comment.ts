
import {User} from "./user";
import {Post} from "./post";
export class UserComment {

  id: number;
  text: string;
  created_at: Date;
  user: User;
  post: Post;


  constructor(comment?) {
    if (comment) {
      this.id = comment.id;
      this.text = comment.text;
      this.created_at = comment.created_at;
    } else {
      return {} as UserComment;
    }
  }
}
