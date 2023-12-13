import { Column, Entity, PrimaryGeneratedColumn } from "noka-orm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  account?: string;

  @Column()
  password?: string;

  @Column()
  name?: string;

  @Column()
  avatar?: string;

  @Column()
  phone?: string;

  @Column()
  email?: string;
}
