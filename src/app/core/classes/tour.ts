import {Category} from "./category";

export class Tour {

  id: number;
  title: string;
  description: string;
  start_date: Date;
  category: Category;


  constructor(tour?) {
    if (tour) {
      this.id = tour.id;
      this.title = tour.title;
      this.description = tour.description;
      this.start_date = tour.start_date;
      this.category = tour.category;
    } else {
      return {} as Tour;
    }
  }

}
