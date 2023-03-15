import { Entity, PrimaryKey, Property } from "@mikro-orm/core"; // import necessary libraries
import { ObjectType, Field, Int } from "type-graphql"; // import necessary decorators

@ObjectType() // defines the class as a GraphQL object type
@Entity() // defines the class as an entity for MikroORM
export class Post {

    @Field(() => Int) // defines the field as a GraphQL field with Int type
    @PrimaryKey() // marks this property as the primary key for the entity
    id!: number; // defines the id property as a number

    @Field(() => String) // defines the field as a GraphQL field with String type
    @Property({ type: 'date' }) // defines this property as a date type for the entity
    createdAt = new Date(); // sets the default value to the current date and time

    @Field(() => String) // defines the field as a GraphQL field with String type
    @Property({ type: 'date', onUpdate: () => new Date() }) // defines this property as a date type for the entity and updates the value to the current date and time when it is updated
    updatedAt = new Date(); // sets the default value to the current date and time

    @Field() // defines the field as a GraphQL field with default String type
    @Property({ type: 'text' }) // defines this property as a text type for the entity
    title!: string; // defines the title property as a string

}