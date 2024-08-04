declare module "db" {
  interface UserRow {
    id: number;
    email: string;
    name: string;
    password: string;
    salt: string;
  }
}
