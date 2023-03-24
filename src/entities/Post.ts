// import necessary libraries
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"; // import necessary decorators

@ObjectType() // defines the class as a GraphQL object type
@Entity() // defines the class as an entity for MikroORM
export class Post extends BaseEntity {
  @Field(() => Int) // defines the field as a GraphQL field with Int type
  @PrimaryGeneratedColumn() // marks this property as the primary key for the entity
  id!: number; // defines the id property as a number

  @Field(() => String) // defines the field as a GraphQL field with String type
  @CreateDateColumn() // defines this property as a date type for the entity
  createdAt: Date; // sets the default value to the current date and time

  @Field(() => String) // defines the field as a GraphQL field with String type
  @UpdateDateColumn() // defines this property as a date type for the entity and updates the value to the current date and time when it is updated
  updatedAt = Date; // sets the default value to the current date and time

  @Field() // defines the field as a GraphQL field with default String type
  @Column() // defines this property as a text type for the entity
  title!: string; // defines the title property as a string
}
