import express from 'express';
const { ApolloServer } = require('apollo-server-express');
import bodyParser from 'body-parser';
import schema from './data/schema';
import compression from 'compression';
import cors from 'cors';

const GRAPHQL_PORT = 8080;

const server = new ApolloServer(schema);

const app = express();

app.use(compression());
app.use(cors());


server.applyMiddleware({ app });

// graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
// graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen({ port: GRAPHQL_PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}`)
);
