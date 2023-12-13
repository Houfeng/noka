import { Column, Entity, PrimaryGeneratedColumn } from "noka-orm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  title!: string;

  @Column()
  content!: string;
}
