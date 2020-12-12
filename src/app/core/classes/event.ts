
import {Post} from "./post";

export class Event {

  id: number;
  description: string;
  end_date: Date;
  start_date: Date;
  created_at: Date;
  updated_at: Date;
  post: Post;


  constructor(event?) {
    if (event) {
      this.id = event.id;
      this.description = event.description;
      this.end_date = event.end_date;
      this.start_date = event.start_date;
      this.created_at = event.created_at;
      this.updated_at = event.updated_at;
      this.post = event.post;
    } else {
      return {} as Event;
    }
  }
}
