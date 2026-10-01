-- Executar somente em banco de teste criado com schema-completo.sql.
-- Os dados artificiais sao desfeitos no final; sequences podem avancar.
BEGIN;

DO $$
DECLARE
  supervisor INTEGER;
  aluno INTEGER;
  paciente_teste INTEGER;
  consulta_teste INTEGER;
  material_teste INTEGER;
  pacote_teste INTEGER;
  ciclo_teste INTEGER;
  lote_teste INTEGER;
  cirurgia_teste INTEGER;
  evento_teste INTEGER;
  valor TEXT;
BEGIN
  INSERT INTO usuario (nome, cpf, email, senha_hash, perfil)
    VALUES ('Teste estrutura coordenador', 'schema-coord', 'schema-coord@example.invalid', 'hash-ficticio', 'coordenador')
    RETURNING id INTO supervisor;
  INSERT INTO usuario (nome, cpf, email, senha_hash, perfil)
    VALUES ('Teste estrutura aluno', 'schema-aluno', 'schema-aluno@example.invalid', 'hash-ficticio', 'aluno')
    RETURNING id INTO aluno;
  INSERT INTO paciente (nome, cpf, data_nascimento, alergias_status, medicamentos_status)
    VALUES ('Paciente ficticio', 'schema-paciente', '2000-01-01', 'informado', 'informado')
    RETURNING id INTO paciente_teste;
  INSERT INTO alergia_paciente (paciente_id, substancia, gravidade) VALUES (paciente_teste, 'Teste', 'leve');
  INSERT INTO medicamento_paciente (paciente_id, nome_medicamento) VALUES (paciente_teste, 'Teste');
  INSERT INTO consulta (paciente_id, usuario_id, data_hora, disciplina)
    VALUES (paciente_teste, supervisor, '2026-09-29 10:00:00', 'Endodontia') RETURNING id INTO consulta_teste;
  INSERT INTO consulta_aluno (consulta_id, aluno_id) VALUES (consulta_teste, aluno);
  FOREACH valor IN ARRAY ARRAY['agendada','confirmada','aguardando','em_atendimento','realizada','cancelada','faltou'] LOOP
    UPDATE consulta SET status=valor WHERE id=consulta_teste;
  END LOOP;
  BEGIN
    UPDATE consulta SET status='invalido' WHERE id=consulta_teste;
    RAISE EXCEPTION 'ERRO: consulta aceitou status invalido';
  EXCEPTION WHEN check_violation THEN NULL;
  END;

  INSERT INTO material (nome, tipo_material, passa_cme, quantidade)
    VALUES ('Instrumental ficticio', 'instrumental', true, 2) RETURNING id INTO material_teste;
  INSERT INTO material_lote (material_id, lote, quantidade, validade)
    VALUES (material_teste, 'LOTE-TESTE', 2, '2027-01-01') RETURNING id INTO lote_teste;
  INSERT INTO movimentacao_estoque (material_id, usuario_id, tipo, quantidade, lote_id)
    VALUES (material_teste, supervisor, 'entrada', 2, lote_teste);
  BEGIN
    UPDATE material_lote SET quantidade=-1 WHERE id=lote_teste;
    RAISE EXCEPTION 'ERRO: lote aceitou saldo negativo';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  INSERT INTO consulta_material (consulta_id, material_id, quantidade) VALUES (consulta_teste, material_teste, 1);
  INSERT INTO mutirao_cirurgico (nome, data_evento, usuario_id)
    VALUES ('Evento ficticio', '2026-09-29', supervisor) RETURNING id INTO evento_teste;
  INSERT INTO cirurgia (paciente_id, usuario_id, data_hora, mutirao_id)
    VALUES (paciente_teste, supervisor, '2026-09-29 11:00:00', evento_teste) RETURNING id INTO cirurgia_teste;
  INSERT INTO cirurgia_aluno (cirurgia_id, usuario_id) VALUES (cirurgia_teste, aluno);
  INSERT INTO cirurgia_material (cirurgia_id, material_id) VALUES (cirurgia_teste, material_teste);
  INSERT INTO evolucao_paciente (paciente_id, usuario_id, consulta_id, descricao)
    VALUES (paciente_teste, supervisor, consulta_teste, 'Observacao ficticia de consulta');
  INSERT INTO evolucao_paciente (paciente_id, usuario_id, cirurgia_id, descricao)
    VALUES (paciente_teste, aluno, cirurgia_teste, 'Observacao ficticia de cirurgia');
  INSERT INTO documento_paciente (paciente_id, usuario_id, nome_arquivo, conteudo)
    VALUES (paciente_teste, supervisor, 'teste.txt', decode('7465737465','hex'));
  INSERT INTO notificacao (usuario_id, titulo, tipo, referencia_id)
    VALUES (aluno, 'Teste', 'consulta', consulta_teste);

  INSERT INTO pacote_esterilizado (nome, preparado_por, status)
    VALUES ('Pacote ficticio', aluno, 'aguardando') RETURNING id INTO pacote_teste;
  INSERT INTO pacote_item (pacote_id, material_id, quantidade) VALUES (pacote_teste, material_teste, 1);
  INSERT INTO pacote_evento (pacote_id, usuario_id, evento) VALUES (pacote_teste, aluno, 'Pacote preparado');
  INSERT INTO esterilizacao (usuario_id, equipamento, status, resultado)
    VALUES (supervisor, 'Autoclave ficticia', 'concluido', 'aprovado') RETURNING id INTO ciclo_teste;
  INSERT INTO controle_biologico (esterilizacao_id, tipo, resultado, testado_por_id)
    VALUES (ciclo_teste, 'biologico', 'aprovado', supervisor);
  UPDATE pacote_esterilizado SET esterilizacao_id=ciclo_teste, status='em_esterilizacao' WHERE id=pacote_teste;
  UPDATE pacote_esterilizado SET liberado_por=supervisor, validade='2027-01-01', status='esterilizado' WHERE id=pacote_teste;
  UPDATE pacote_esterilizado SET status='utilizado' WHERE id=pacote_teste;
  UPDATE pacote_esterilizado SET status='vencido' WHERE id=pacote_teste;
  BEGIN
    UPDATE pacote_esterilizado SET status='invalido' WHERE id=pacote_teste;
    RAISE EXCEPTION 'ERRO: pacote aceitou status invalido';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  BEGIN
    INSERT INTO consulta_aluno (consulta_id, aluno_id) VALUES (consulta_teste, aluno);
    RAISE EXCEPTION 'ERRO: vinculo duplicado aceito';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
  BEGIN
    INSERT INTO consulta_aluno (consulta_id, aluno_id) VALUES (consulta_teste, -1);
    RAISE EXCEPTION 'ERRO: vinculo sem usuario aceito';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
  RAISE NOTICE 'OK: prontuario, equipes, estoque, CME, status e restricoes basicas.';
END $$;

ROLLBACK;
