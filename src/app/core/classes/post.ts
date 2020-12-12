import {Category} from "./category";
import {User} from "./user";

export class Post {

  id: number;
  slug: string;
  description: string;
  title: string;
  excerpt: string;
  content_raw: string;
  content_html: string;
  is_published: boolean;
  publiched_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  category: Category;
  user: User;
  alias: string;


  constructor(post?) {
    if (post) {
      this.id = post.id;
      this.slug = post.slug;
      this.description = post.description;
      this.title = post.title;
      this.excerpt = post.excerpt;
      this.content_raw = post.content_raw;
      this.content_html = post.content_html;
      this.is_published = post.is_published;
      this.publiched_at = post.publiched_at;
      this.created_at = post.created_at;
      this.updated_at = post.updated_at;
      this.deleted_at = post.deleted_at;
      this.category = post.category;
      this.user = post.user;
      this.alias = post.alias;
    } else {
      return {} as Post;
    }

  }


}
