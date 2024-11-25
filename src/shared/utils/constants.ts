export class Constants {
  static get EmailRegex(): RegExp {
    // tslint:disable-next-line:max-line-length
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }
}

export enum Roles {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}
