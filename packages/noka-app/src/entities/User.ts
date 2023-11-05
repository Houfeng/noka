import { ORM } from "noka";

@ORM.Entity()
export class User {
  @ORM.PrimaryGeneratedColumn()
  id?: string;

  @ORM.Column()
  name?: string;
}
