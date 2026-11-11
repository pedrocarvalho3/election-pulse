-- Active: 1784934909891@@127.0.0.1@5432@rinha
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
    saldo INTEGER NOT NULL,
	limite INTEGER NOT NULL
)

CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY,
	cliente_id INTEGER NOT NULL,
	valor INTEGER NOT NULL,
	tipo CHAR(1) NOT NULL,
	descricao VARCHAR(10) NOT NULL,
	realizada_em TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_clientes_transacoes_id
		FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

DO $$
BEGIN
	INSERT INTO clientes (nome, saldo, limite)
	VALUES
		('user 1', 0, 100000),
		('user 2', 0, 80000),
		('user 3', 0, 1000000),
		('user 4', 0, 10000000),
		('user 5', 0, 500000);
END;
$$;