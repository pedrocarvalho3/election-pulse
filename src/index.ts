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
    const { pollingStationCode, votes } = request.body;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `
          INSERT INTO polling_stations (code)
          VALUES ($1)
          RETURNING id
        `,
        [pollingStationCode],
      );

      const pollingStationId = result.rows[0].id;

      for (const vote of votes) {
        await client.query(
          `
          INSERT INTO ballot_votes
          (polling_station_id, candidate_number, count)
          VALUES ($1, $2, $3)
          `,
          [pollingStationId, vote.candidateNumber, vote.count],
        );
      }

      await client.query("COMMIT");

      return reply.status(201).send({
        pollingStationId,
        message: "Ballot received successfully",
      });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
