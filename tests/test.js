const requests = [
  fetch("http://localhost:8080/clientes/1/transacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valor: 700,
      tipo: "d",
      descricao: "teste1",
    }),
  }),
  fetch("http://localhost:8080/clientes/1/transacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valor: 700,
      tipo: "d",
      descricao: "teste2",
    }),
  }),
];

const responses = await Promise.all(requests);

for (const response of responses) {
  console.log(response.status, await response.text());
}
