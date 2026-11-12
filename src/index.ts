import fastify from "fastify";
import { pool } from "./database.js";

const server = fastify();

interface ClienteParams {
  id: string;
}

interface CandidateVote {
  candidateNumber: number;
  count: number;
}

interface BallotRequest {
  pollingStationCode: string;
  votes: CandidateVote[];
}

server.post<{ Params: ClienteParams; Body: BallotRequest }>(
  "/ballot",
  async (request, reply) => {
    const result = request.body;
    return reply.status(201).send({ result });
  },
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
