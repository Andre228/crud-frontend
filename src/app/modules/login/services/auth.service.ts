import {Injectable} from "@angular/core";
import {APP_HOST} from "../../../core/config";
import {User} from "../../../core/classes/user";
import {Rest} from "../../../core/rest/rest.service";
import {Router} from "@angular/router";


export interface Auth {
  username: string;
  password: string;
  email?: string;
}

@Injectable()
export class AuthService {


  constructor(private rest: Rest,
              private router: Router) {}


  register(body: Auth): Promise<User> {
    if (body) {
      const url = `/user/register`;
      return this.rest.post(url, body);
    } else {
      return Promise.resolve(User);
    }
  }


  login(body: Auth): Promise<User> {
    if (body) {
      const url = `/user/login`;
      localStorage.setItem('user', 'Basic ' + btoa(body.username + ':' + body.password));
      return this.rest.post(url, body);
    } else {
      return Promise.resolve(User);
    }
  }

  setLoginStatus(logged: boolean): void {
    localStorage.setItem('isLoggedIn', 'user-logged-in-now');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') ? true : false;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }


}
