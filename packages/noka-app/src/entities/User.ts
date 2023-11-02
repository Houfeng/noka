/** @format */

import { Entity, Column, PrimaryGeneratedColumn } from "noka";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  name?: string;
}
