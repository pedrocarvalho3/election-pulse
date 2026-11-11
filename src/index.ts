import fastify from "fastify";
import { pool } from "./database.js";

const server = fastify();

interface ClienteParams {
  id: string;
}

interface BallotRequest {
  ballotId: string;
  pollingStationCode: string;
  votes: [{ candidateNumber: number; quantity: number }];
  blankVotes: number;
  nullVotes: number;
}

server.post<{ Params: ClienteParams; Body: BallotRequest }>(
  "/ballot",
  async (request, reply) => {},
);

server.get<{ Params: ClienteParams }>(
  "/clientes/:id/extrato",
  async (request, reply) => {},
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
