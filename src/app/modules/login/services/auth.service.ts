import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {APP_HOST} from "../../../core/config";
import {User} from "../../../core/classes/user";
import {Rest} from "../../../core/rest/rest.service";


@Injectable()
export class AuthService {


  constructor(private rest: Rest) {}


  register(body): Promise<User> {
    if (body) {
      const url = `${APP_HOST}/user/register`;
      return this.rest.post(url, body);
    } else {
      return Promise.resolve(User);
    }
  }


  login(body): Promise<User> {
    if (body) {
      const url = `${APP_HOST}/user/login`;
      return this.rest.post(url, body);
    } else {
      return Promise.resolve(User);
    }
  }


}
