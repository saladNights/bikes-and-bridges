import {Field, ObjectType} from 'type-graphql';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@ObjectType()
@Entity('routes')
export class Route extends BaseEntity {
	@Field(() => String)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column('text')
	userId: string;

	@Field()
	@Column('text')
	title: string;

	@Field()
	@Column('text')
	location: string;
}
