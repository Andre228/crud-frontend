import {Injectable} from "@angular/core";
import {Observable, of, Observer, from} from 'rxjs';
import {HttpClient} from "@angular/common/http";



@Injectable()
export class Rest {

  constructor(private http: HttpClient) {
  }

  get(url: string, body: {}): Promise<Object> {
    if (url && body) {
      return this.http.get(url, body).toPromise();
    } else {
      return Promise.resolve({});
    }
  }


  post(url: string, body: {}): Promise<Object> {
    if (url && body) {
      return this.http.post(url, body).toPromise();
    } else {
      return Promise.resolve({});
    }
  }

}
