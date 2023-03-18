import { Field, ID, ObjectType, Root } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType() // make it a type in graphql
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  name1: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // @Field(type => Float, { nullable: true })
  //   averageRating(@Arg("since") sinceDate: Date): number | null {
  //     const ratings = this.ratings.filter(rate => rate.date > sinceDate);
  //     if (!ratings.length) return null;

  //     const ratingsSum = ratings.reduce((a, b) => a + b, 0);
  //     return ratingsSum / ratings.length;
  //   }

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Column()
  password: string;
}
