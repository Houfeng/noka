import { Column, Entity, PrimaryGeneratedColumn } from "noka-orm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  name?: string;
}
