import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {APP_HOST} from "../config";


@Injectable()
export class Rest {

  constructor(private http: HttpClient) {}

  get(url: string, options?: boolean): Promise<any> {
    url = `${APP_HOST}` + url;
    if (url) {
      if (options) {
        return this.http.get(url, { headers: this.getAuthorizationHeaders() }).toPromise();
      } else {
        return this.http.get(url).toPromise();
      }
    } else {
      return Promise.resolve({});
    }
  }

  post(url: string, body: {}, options?: boolean): Promise<any> {
    url = `${APP_HOST}` + url;
    if (url && body) {
      if (options) {
        return this.http.post(url, body, { headers: this.getAuthorizationHeaders() }).toPromise();
      } else {
        return this.http.post(url, body).toPromise();
      }
    } else {
      return Promise.resolve({});
    }
  }


  put(url: string, body: {}, options?: boolean): Promise<any> {
    url = `${APP_HOST}` + url;
    if (url && body) {
      if (options) {
        return this.http.put(url, body, { headers: this.getAuthorizationHeaders() }).toPromise();
      } else {
        return this.http.put(url, body).toPromise();
      }
    } else {
      return Promise.resolve({});
    }
  }

  delete(url: string, options?: boolean): Promise<any> {
    url = `${APP_HOST}` + url;
    if (url) {
      if (options) {
        return this.http.delete(url, { headers: this.getAuthorizationHeaders() }).toPromise();
      } else {
        return this.http.delete(url).toPromise();
      }
    } else {
      return Promise.resolve({});
    }
  }

  private getAuthorizationHeaders(): HttpHeaders {
    if (this.getAuthMetaData()) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json', 'Authorization': this.getAuthMetaData()
      });
      return headers;
    } else {
      return new HttpHeaders();
    }
  }

  private getAuthMetaData(): string {
    const logAndPass = localStorage.getItem('user');
    if (logAndPass) {
      return logAndPass;
    } else {
      return '';
    }
  }

}
