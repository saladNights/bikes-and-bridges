import {Field, ObjectType} from 'type-graphql';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@ObjectType()
@Entity('routes')
export class Routes extends BaseEntity {
	@Field(() => String)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column('text')
	title: string;

	@Field()
	@Column('text')
	description: string;
}
