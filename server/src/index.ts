import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { RouteResolver } from './RouteResolver';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import cors from 'cors';

import { User } from './entity/User';
import {createAccessToken, createRefreshToken} from './auth';
import { sendRefreshToken } from './sendRefreshToken';

(async () => {
  const app = express();
  app.use(
  	cors({
		  origin: 'http://localhost:3000',
		  credentials: true,
	  })
  );
  app.use(cookieParser());
  app.use('/routes', express.static(path.join(__dirname, '../../routes')));

  app.post('/refresh_token', async (req, res) => {
	  const token = req.cookies.jid;
	  let payload: any = null;

	  if (!token) {
	  	return res.send({ ok: false, accessToken: '' });
	  }

	  try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
	  } catch (err) {
		  console.error(err);
		  return res.send({ ok: false, accessToken: '' });
	  }

	  const user = await User.findOne({ id: payload.userId });

	  if (!user) {
		  return res.send({ ok: false, accessToken: '' });
	  }

	  if (user.tokenVersion !== payload.tokenVersion) {
		  return res.send({ ok: false, accessToken: '' });
	  }

	  sendRefreshToken(res, createRefreshToken(user));

	  return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

	await createConnection();

  const apolloServer = new ApolloServer({
	  schema: await buildSchema({
		  resolvers: [
		  	UserResolver,
			  RouteResolver
		  ],
	  }),
	  context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

	app.get('/', (_req, res) => res.send('hello'));
	app.listen(4000, () => {
		console.log('express server started');
	});
})();
