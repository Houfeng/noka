/** @format */

import { Entity, Column, PrimaryGeneratedColumn } from "noka";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @Column()
  email: string;
}
