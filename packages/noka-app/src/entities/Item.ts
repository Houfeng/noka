/** @format */

import { Entity, Column, PrimaryGeneratedColumn } from "noka";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: string | undefined;

  @Column()
  name: string | undefined;
}
