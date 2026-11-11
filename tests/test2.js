const requests = [];

for (let i = 0; i < 100; i++) {
  requests.push(
    fetch("http://localhost:8080/clientes/1/transacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valor: 10,
        tipo: "c",
        descricao: `cred${i}`,
      }),
    }),
  );
}

const results = await Promise.all(
  requests.map(async (request) => {
    const response = await request;

    return {
      status: response.status,
      body: await response.text(),
    };
  }),
);

const successes = results.filter((result) => result.status === 200);
const failures = results.filter((result) => result.status !== 200);

console.log({
  total: results.length,
  successes: successes.length,
  failures: failures.length,
});

console.log(failures);
