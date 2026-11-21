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
  "/ballots",
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

interface CandidateResult {
  candidateNumber: number;
  count: string;
}

server.get<{ Params: ClienteParams }>("/results", async (request, reply) => {
  const result = await pool.query<CandidateResult>(
    `
        SELECT
            candidate_number AS "candidateNumber",
            SUM(count) AS count
        FROM ballot_votes
        GROUP BY candidate_number
        ORDER BY count DESC
      `,
  );

  const candidates = result.rows.map((candidate) => ({
    candidateNumber: candidate.candidateNumber,
    count: Number(candidate.count),
  }));

  const totalVotes = candidates.reduce(
    (total, candidate) => total + candidate.count,
    0,
  );

  return {
    totalVotes,
    candidates,
  };
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
