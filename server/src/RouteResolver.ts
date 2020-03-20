import {Resolver, Mutation, Arg, UseMiddleware, Ctx, Query} from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

import {Context} from './Context';
import { Route } from './entity/Route';
import {Upload} from './Upload';
import { isAuth } from "./isAuth";

@Resolver()
export class RouteResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async uploadRoute(
		@Arg('route', () => GraphQLUpload) { createReadStream, filename}: Upload,
		@Ctx() { payload }: Context
	): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			const nextFileName = `${Date.now()}_${filename}`;
			const routePath = __dirname + `/../../routes/${nextFileName}`;
			const uploadStatus = createReadStream()
				.pipe(createWriteStream(routePath))
				.on('finish', () => resolve(true))
				.on('error', () => reject(false));

			if (uploadStatus) {
				try {
					await Route.insert({
						userId: payload!.userId,
						title: filename,
						location: `http://localhost:4000/routes/${nextFileName}`,
					});

					return true;
				} catch (err) {
					console.error(err);

					return false;
				}
			}

			return uploadStatus;
		});
	}

	@Query(() => [Route])
	getRoutes(
		@Arg('userId') userId: string,
	) {
		return Route.find({ where: { userId } });
	}
}
