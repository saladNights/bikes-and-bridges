import {Resolver, Mutation, Arg} from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

import {Upload} from './Upload';

@Resolver()
export class RouteResolver {
	@Mutation(() => Boolean)
	async uploadRoute(@Arg('route', () => GraphQLUpload)
	{
		createReadStream,
		filename
	}: Upload): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			return createReadStream()
				.pipe(createWriteStream(__dirname + `/../../routes/${filename}`))
				.on('finish', () => resolve(true))
				.on('error', () => reject(false));
		});
	}
}
