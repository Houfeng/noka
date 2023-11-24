/** @format */

import { ORM } from "noka";

@ORM.Entity()
export class User {
  @ORM.PrimaryGeneratedColumn()
  id?: string;

  @ORM.Column()
  account?: string;

  @ORM.Column()
  password?: string;

  @ORM.Column()
  name?: string;

  @ORM.Column()
  avatar?: string;

  @ORM.Column()
  phone?: string;

  @ORM.Column()
  email?: string;
}
