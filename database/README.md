# Banco de dados do Odonto

Estrutura do código local em 29/09/2026: **PostgreSQL, schema public, 23 tabelas de negócio e 1 tabela de migrations**. Nomes de tabelas e colunas devem permanecer exatamente como neste documento, pois os repositórios executam SQL com esses nomes.

## Arquivos e aplicação

- [schema-completo.sql](schema-completo.sql): estrutura final para **banco novo e vazio**, incluindo chaves primárias/estrangeiras, unicidade, CHECKs, índices, sequences, cinco categorias iniciais e o registro das migrations 001–018. Não contém contas, senhas nem pacientes reais.
- [018_compatibilidade_status.sql](018_compatibilidade_status.sql): correção incremental para banco que **já tenha as migrations 001–017 aplicadas**.
- [validar-estrutura.sql](validar-estrutura.sql): verificação em banco de teste; desfaz os registros ao terminar, mas pode avançar sequences.

### Banco novo

Crie um banco vazio em UTF-8 e abra schema-completo.sql no Query Tool do pgAdmin ou editor SQL do seu cliente. Execute o arquivo inteiro. Ele tem BEGIN/COMMIT e falha se encontrar tabelas com os mesmos nomes; não tenta adaptar uma estrutura existente. Também pode executar com psql:

```sh
psql -h localhost -U seu_usuario -d odonto -v ON_ERROR_STOP=1 -f database/schema-completo.sql
```

Depois configure DATABASE_URL no backend apontando para esse banco. Use o cadastro/seed do backend para criar o primeiro usuário, com senha_hash produzida por bcrypt; o SQL não cria uma conta com senha padrão. A API precisa incluir também as alterações entregues em backend-alunos, backend-recepcao e backend-recuperacao.

O script registra as migrations 001–018 porque já materializa os seus efeitos. Não rode manualmente as migrations antigas por cima. O executor do backend usa _migrations para ignorá-las.

### Banco existente

Não execute schema-completo.sql em um banco com dados. Confira as colunas/constraints reais e a tabela _migrations antes de escolher as migrations pendentes; CREATE TABLE IF NOT EXISTS não corrige uma tabela com formato diferente. Se 001–017 já estiverem aplicadas e compatíveis, copie 018_compatibilidade_status.sql para migrations/ do backend e execute npm run migrate. Esse executor aplica a migration e registra o arquivo em uma transação. Confira a numeração se outra migration 018 já existir no backend publicado.

Existe um risco concreto no histórico: a migration 013 antiga pode apagar documento_paciente quando encontra a coluna arquivo_url, sem verificar se há arquivos cadastrados. Se seu banco ainda usa esse formato, preserve os documentos e prepare a conversão antes de aplicar essa migration; o SQL completo fornecido aqui destina-se exclusivamente a banco vazio e não usa esse DROP.

## Correções necessárias encontradas

As migrations até 017 não permitem todos os status usados pelo backend atual. A migration 018 e o SQL completo incluem:

| Campo | Valores aceitos |
| --- | --- |
| usuario.perfil | coordenador, professor, aluno, recepcionista |
| consulta.status | agendada, confirmada, aguardando, em_atendimento, realizada, cancelada, faltou |
| cirurgia.status | agendada, realizada, cancelada |
| pacote_esterilizado.status | aguardando, em_esterilizacao, esterilizado, utilizado, vencido |
| esterilizacao.status | pendente, em_andamento, concluido, falhou |
| esterilizacao.resultado / controle_biologico.resultado | pendente, aprovado, reprovado |
| esterilizacao.tipo_ciclo | vapor, calor_seco, plasma |
| controle_biologico.tipo | bowie_dick, biologico, quimico |
| material.tipo_material | consumivel, instrumental |
| movimentacao_estoque.tipo | entrada, saida |
| cirurgia_aluno.papel | executante, auxiliar, observador |
| paciente.alergias_status / medicamentos_status | informado, nenhum; NULL significa ainda não informado |

consulta.disciplina e cirurgia.disciplina aceitam NULL ou: Dentística, Endodontia, Periodontia, Ortodontia, Odontopediatria, Cirurgia Bucal, Prótese, Reabilitação Bucal.

## Regras que também dependem da API

- Os quatro perfis ficam em usuario; não criar tabelas separadas de aluno/professor/recepção. As FKs identificam usuários, mas a validação de perfil, permissões e usuário ativo é feita na API.
- A consulta aponta para o supervisor em usuario_id; seus alunos ficam em consulta_aluno.aluno_id. Na cirurgia, cirurgia_aluno.usuario_id identifica o aluno.
- Saúde com status informado exige itens e nenhum exige lista vazia; essa coerência entre tabelas e o incremento de saude_versao são controlados pelo backend. NULL não significa ausência de alergias/medicamentos.
- material.quantidade e os saldos de material_lote são atualizados juntos pela API em transação; não existe trigger de sincronização. Não atualizar saldo manualmente em apenas uma tabela.
- A liberação de pacote verifica ciclo, controles e perfil na API. O banco permite os status, mas não implementa a máquina de estados nem atualiza automaticamente vencido pela data.
- Datas de agenda são TIMESTAMP sem fuso, conforme o driver atual; DATE guarda datas puras. reset_requested_at é TIMESTAMPTZ e reset_token_expires permanece TIMESTAMP por compatibilidade. Não trocar os tipos sem ajustar o backend. Configure o fuso das conexões de forma consistente com o horário da clínica.
- senha_hash armazena o hash da senha. reset_token guarda o resumo HMAC do código de recuperação, e não o código em texto puro. O envio de e-mail também exige configuração do provedor no backend.
- Relatórios, dashboards e histórico consolidado são consultas sobre estas tabelas. Auditoria em arquivo não é uma tabela do banco.

## Dicionário completo

As definições abaixo foram extraídas do PostgreSQL após executar as migrations 001–018. “Aceita NULL” descreve o banco; um campo opcional no banco pode ser obrigatório em determinado fluxo da API. SERIAL é representado como INTEGER com sequence no valor padrão. TIMESTAMP significa sem fuso. Um DEFAULT não impede NULL se a coluna não for NOT NULL.

### usuario

Contas de coordenador, professor, aluno e recepcionista; autenticação e recuperação de senha.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('usuario_id_seq'::regclass)` |
| `nome` | `VARCHAR` | Não | — |
| `cpf` | `VARCHAR` | Não | — |
| `email` | `VARCHAR` | Não | — |
| `senha_hash` | `VARCHAR` | Não | — |
| `telefone` | `VARCHAR` | Sim | — |
| `setor` | `VARCHAR` | Sim | — |
| `perfil` | `VARCHAR` | Não | — |
| `data_admissao` | `DATE` | Sim | — |
| `ativo` | `BOOLEAN` | Sim | `true` |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |
| `reset_token` | `VARCHAR` | Sim | — |
| `reset_token_expires` | `TIMESTAMP` | Sim | — |
| `reset_attempts` | `INTEGER` | Não | `0` |
| `reset_requested_at` | `TIMESTAMPTZ` | Sim | — |

Restrições e relacionamentos:

- `chk_usuario_perfil`: `CHECK (((perfil)::text = ANY ((ARRAY['coordenador'::character varying, 'professor'::character varying, 'aluno'::character varying, 'recepcionista'::character varying])::text[])))`.
- `usuario_cpf_key`: `UNIQUE (cpf)`.
- `usuario_cpf_not_null`: `NOT NULL cpf`.
- `usuario_email_key`: `UNIQUE (email)`.
- `usuario_email_not_null`: `NOT NULL email`.
- `usuario_id_not_null`: `NOT NULL id`.
- `usuario_nome_not_null`: `NOT NULL nome`.
- `usuario_perfil_not_null`: `NOT NULL perfil`.
- `usuario_pkey`: `PRIMARY KEY (id)`.
- `usuario_reset_attempts_not_null`: `NOT NULL reset_attempts`.
- `usuario_senha_hash_not_null`: `NOT NULL senha_hash`.

### paciente

Cadastro e declaração de saúde do paciente. saude_versao permite detectar edições concorrentes.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('paciente_id_seq'::regclass)` |
| `nome` | `VARCHAR` | Não | — |
| `cpf` | `VARCHAR` | Não | — |
| `data_nascimento` | `DATE` | Não | — |
| `telefone` | `VARCHAR` | Sim | — |
| `email` | `VARCHAR` | Sim | — |
| `endereco` | `VARCHAR` | Sim | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |
| `ativo` | `BOOLEAN` | Sim | `true` |
| `alergias_status` | `VARCHAR` | Sim | — |
| `medicamentos_status` | `VARCHAR` | Sim | — |
| `saude_versao` | `INTEGER` | Não | `0` |

Restrições e relacionamentos:

- `paciente_alergias_status_check`: `CHECK (((alergias_status)::text = ANY ((ARRAY['informado'::character varying, 'nenhum'::character varying])::text[])))`.
- `paciente_cpf_key`: `UNIQUE (cpf)`.
- `paciente_cpf_not_null`: `NOT NULL cpf`.
- `paciente_data_nascimento_not_null`: `NOT NULL data_nascimento`.
- `paciente_id_not_null`: `NOT NULL id`.
- `paciente_medicamentos_status_check`: `CHECK (((medicamentos_status)::text = ANY ((ARRAY['informado'::character varying, 'nenhum'::character varying])::text[])))`.
- `paciente_nome_not_null`: `NOT NULL nome`.
- `paciente_pkey`: `PRIMARY KEY (id)`.
- `paciente_saude_versao_not_null`: `NOT NULL saude_versao`.

### alergia_paciente

Uma linha por alergia do paciente.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('alergia_paciente_id_seq'::regclass)` |
| `paciente_id` | `INTEGER` | Não | — |
| `substancia` | `VARCHAR` | Não | — |
| `gravidade` | `VARCHAR` | Sim | — |

Restrições e relacionamentos:

- `alergia_paciente_id_not_null`: `NOT NULL id`.
- `alergia_paciente_paciente_id_fkey`: `FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE`.
- `alergia_paciente_paciente_id_not_null`: `NOT NULL paciente_id`.
- `alergia_paciente_pkey`: `PRIMARY KEY (id)`.
- `alergia_paciente_substancia_not_null`: `NOT NULL substancia`.

### medicamento_paciente

Uma linha por medicamento em uso pelo paciente.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('medicamento_paciente_id_seq'::regclass)` |
| `paciente_id` | `INTEGER` | Não | — |
| `nome_medicamento` | `VARCHAR` | Não | — |
| `dosagem` | `VARCHAR` | Sim | — |

Restrições e relacionamentos:

- `medicamento_paciente_id_not_null`: `NOT NULL id`.
- `medicamento_paciente_nome_medicamento_not_null`: `NOT NULL nome_medicamento`.
- `medicamento_paciente_paciente_id_fkey`: `FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE`.
- `medicamento_paciente_paciente_id_not_null`: `NOT NULL paciente_id`.
- `medicamento_paciente_pkey`: `PRIMARY KEY (id)`.

### consulta

Agendamento/atendimento; usuario_id identifica o supervisor, não a lista de alunos.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('consulta_id_seq'::regclass)` |
| `paciente_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `data_hora` | `TIMESTAMP` | Não | — |
| `queixa_principal` | `VARCHAR` | Sim | — |
| `observacoes` | `TEXT` | Sim | — |
| `status` | `VARCHAR` | Sim | `'agendada'::character varying` |
| `disciplina` | `VARCHAR(50)` | Sim | — |

Restrições e relacionamentos:

- `chk_consulta_disciplina`: `CHECK (((disciplina IS NULL) OR ((disciplina)::text = ANY ((ARRAY['Dentística'::character varying, 'Endodontia'::character varying, 'Periodontia'::character varying, 'Ortodontia'::character varying, 'Odontopediatria'::character varying, 'Cirurgia Bucal'::character varying, 'Prótese'::character varying, 'Reabilitação Bucal'::character varying])::text[]))))`.
- `chk_consulta_status`: `CHECK (((status)::text = ANY ((ARRAY['agendada'::character varying, 'confirmada'::character varying, 'aguardando'::character varying, 'em_atendimento'::character varying, 'realizada'::character varying, 'cancelada'::character varying, 'faltou'::character varying])::text[])))`.
- `consulta_data_hora_not_null`: `NOT NULL data_hora`.
- `consulta_id_not_null`: `NOT NULL id`.
- `consulta_paciente_id_fkey`: `FOREIGN KEY (paciente_id) REFERENCES paciente(id)`.
- `consulta_paciente_id_not_null`: `NOT NULL paciente_id`.
- `consulta_pkey`: `PRIMARY KEY (id)`.
- `consulta_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `consulta_usuario_id_not_null`: `NOT NULL usuario_id`.

Índices adicionais:

- `CREATE INDEX idx_consulta_disciplina ON public.consulta USING btree (disciplina, data_hora)`.

### consulta_aluno

Equipe de alunos de uma consulta. A chave composta impede repetir o mesmo aluno.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `consulta_id` | `INTEGER` | Não | — |
| `aluno_id` | `INTEGER` | Não | — |

Restrições e relacionamentos:

- `consulta_aluno_aluno_id_fkey`: `FOREIGN KEY (aluno_id) REFERENCES usuario(id)`.
- `consulta_aluno_aluno_id_not_null`: `NOT NULL aluno_id`.
- `consulta_aluno_consulta_id_fkey`: `FOREIGN KEY (consulta_id) REFERENCES consulta(id) ON DELETE CASCADE`.
- `consulta_aluno_consulta_id_not_null`: `NOT NULL consulta_id`.
- `consulta_aluno_pkey`: `PRIMARY KEY (consulta_id, aluno_id)`.

### consulta_material

Materiais previstos para uma consulta.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('consulta_material_id_seq'::regclass)` |
| `consulta_id` | `INTEGER` | Não | — |
| `material_id` | `INTEGER` | Não | — |
| `quantidade` | `INTEGER` | Não | `1` |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `chk_consulta_material_quantidade`: `CHECK ((quantidade >= 0))`.
- `consulta_material_consulta_id_fkey`: `FOREIGN KEY (consulta_id) REFERENCES consulta(id) ON DELETE CASCADE`.
- `consulta_material_consulta_id_material_id_key`: `UNIQUE (consulta_id, material_id)`.
- `consulta_material_consulta_id_not_null`: `NOT NULL consulta_id`.
- `consulta_material_id_not_null`: `NOT NULL id`.
- `consulta_material_material_id_fkey`: `FOREIGN KEY (material_id) REFERENCES material(id)`.
- `consulta_material_material_id_not_null`: `NOT NULL material_id`.
- `consulta_material_pkey`: `PRIMARY KEY (id)`.
- `consulta_material_quantidade_not_null`: `NOT NULL quantidade`.

Índices adicionais:

- `CREATE INDEX idx_consulta_material_consulta ON public.consulta_material USING btree (consulta_id)`.

### cirurgia

Cirurgia, paciente, responsável e eventual mutirão.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('cirurgia_id_seq'::regclass)` |
| `paciente_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `data_hora` | `TIMESTAMP` | Não | — |
| `tipo_cirurgia` | `VARCHAR` | Sim | — |
| `status` | `VARCHAR` | Sim | `'agendada'::character varying` |
| `observacoes` | `TEXT` | Sim | — |
| `mutirao_id` | `INTEGER` | Sim | — |
| `disciplina` | `VARCHAR(50)` | Sim | — |

Restrições e relacionamentos:

- `chk_cirurgia_disciplina`: `CHECK (((disciplina IS NULL) OR ((disciplina)::text = ANY ((ARRAY['Dentística'::character varying, 'Endodontia'::character varying, 'Periodontia'::character varying, 'Ortodontia'::character varying, 'Odontopediatria'::character varying, 'Cirurgia Bucal'::character varying, 'Prótese'::character varying, 'Reabilitação Bucal'::character varying])::text[]))))`.
- `chk_cirurgia_status`: `CHECK (((status)::text = ANY ((ARRAY['agendada'::character varying, 'realizada'::character varying, 'cancelada'::character varying])::text[])))`.
- `cirurgia_data_hora_not_null`: `NOT NULL data_hora`.
- `cirurgia_id_not_null`: `NOT NULL id`.
- `cirurgia_mutirao_id_fkey`: `FOREIGN KEY (mutirao_id) REFERENCES mutirao_cirurgico(id)`.
- `cirurgia_paciente_id_fkey`: `FOREIGN KEY (paciente_id) REFERENCES paciente(id)`.
- `cirurgia_paciente_id_not_null`: `NOT NULL paciente_id`.
- `cirurgia_pkey`: `PRIMARY KEY (id)`.
- `cirurgia_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `cirurgia_usuario_id_not_null`: `NOT NULL usuario_id`.

### cirurgia_aluno

Alunos da cirurgia; aqui a coluna do aluno chama-se usuario_id.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('cirurgia_aluno_id_seq'::regclass)` |
| `cirurgia_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `curso` | `VARCHAR` | Sim | — |
| `papel` | `VARCHAR` | Sim | `'observador'::character varying` |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `cirurgia_aluno_cirurgia_id_fkey`: `FOREIGN KEY (cirurgia_id) REFERENCES cirurgia(id) ON DELETE CASCADE`.
- `cirurgia_aluno_cirurgia_id_not_null`: `NOT NULL cirurgia_id`.
- `cirurgia_aluno_cirurgia_id_usuario_id_key`: `UNIQUE (cirurgia_id, usuario_id)`.
- `cirurgia_aluno_id_not_null`: `NOT NULL id`.
- `cirurgia_aluno_papel_check`: `CHECK (((papel)::text = ANY ((ARRAY['executante'::character varying, 'auxiliar'::character varying, 'observador'::character varying])::text[])))`.
- `cirurgia_aluno_pkey`: `PRIMARY KEY (id)`.
- `cirurgia_aluno_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `cirurgia_aluno_usuario_id_not_null`: `NOT NULL usuario_id`.

### cirurgia_material

Materiais previstos para a cirurgia.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('cirurgia_material_id_seq'::regclass)` |
| `cirurgia_id` | `INTEGER` | Não | — |
| `material_id` | `INTEGER` | Não | — |
| `quantidade` | `INTEGER` | Não | `1` |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `chk_cirurgia_material_quantidade`: `CHECK ((quantidade >= 0))`.
- `cirurgia_material_cirurgia_id_fkey`: `FOREIGN KEY (cirurgia_id) REFERENCES cirurgia(id) ON DELETE CASCADE`.
- `cirurgia_material_cirurgia_id_material_id_key`: `UNIQUE (cirurgia_id, material_id)`.
- `cirurgia_material_cirurgia_id_not_null`: `NOT NULL cirurgia_id`.
- `cirurgia_material_id_not_null`: `NOT NULL id`.
- `cirurgia_material_material_id_fkey`: `FOREIGN KEY (material_id) REFERENCES material(id)`.
- `cirurgia_material_material_id_not_null`: `NOT NULL material_id`.
- `cirurgia_material_pkey`: `PRIMARY KEY (id)`.
- `cirurgia_material_quantidade_not_null`: `NOT NULL quantidade`.

### mutirao_cirurgico

Evento que reúne cirurgias.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('mutirao_cirurgico_id_seq'::regclass)` |
| `nome` | `VARCHAR` | Não | — |
| `data_evento` | `DATE` | Não | — |
| `local` | `VARCHAR` | Sim | — |
| `usuario_id` | `INTEGER` | Não | — |
| `observacoes` | `TEXT` | Sim | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `mutirao_cirurgico_data_evento_not_null`: `NOT NULL data_evento`.
- `mutirao_cirurgico_id_not_null`: `NOT NULL id`.
- `mutirao_cirurgico_nome_not_null`: `NOT NULL nome`.
- `mutirao_cirurgico_pkey`: `PRIMARY KEY (id)`.
- `mutirao_cirurgico_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `mutirao_cirurgico_usuario_id_not_null`: `NOT NULL usuario_id`.

### documento_paciente

Arquivos do prontuário. conteudo é BYTEA; não é uma URL de arquivo.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('documento_paciente_id_seq'::regclass)` |
| `paciente_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `nome_arquivo` | `VARCHAR` | Não | — |
| `tipo_arquivo` | `VARCHAR` | Sim | — |
| `tamanho_bytes` | `INTEGER` | Sim | — |
| `conteudo` | `BYTEA` | Não | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `documento_paciente_conteudo_not_null`: `NOT NULL conteudo`.
- `documento_paciente_id_not_null`: `NOT NULL id`.
- `documento_paciente_nome_arquivo_not_null`: `NOT NULL nome_arquivo`.
- `documento_paciente_paciente_id_fkey`: `FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE`.
- `documento_paciente_paciente_id_not_null`: `NOT NULL paciente_id`.
- `documento_paciente_pkey`: `PRIMARY KEY (id)`.
- `documento_paciente_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `documento_paciente_usuario_id_not_null`: `NOT NULL usuario_id`.

Índices adicionais:

- `CREATE INDEX idx_documento_paciente ON public.documento_paciente USING btree (paciente_id, criado_em DESC)`.

### evolucao_paciente

Anotações clínicas, com vínculo opcional a consulta ou cirurgia.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('evolucao_paciente_id_seq'::regclass)` |
| `paciente_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `consulta_id` | `INTEGER` | Sim | — |
| `descricao` | `TEXT` | Não | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |
| `cirurgia_id` | `INTEGER` | Sim | — |

Restrições e relacionamentos:

- `evolucao_paciente_cirurgia_id_fkey`: `FOREIGN KEY (cirurgia_id) REFERENCES cirurgia(id)`.
- `evolucao_paciente_consulta_id_fkey`: `FOREIGN KEY (consulta_id) REFERENCES consulta(id)`.
- `evolucao_paciente_descricao_not_null`: `NOT NULL descricao`.
- `evolucao_paciente_id_not_null`: `NOT NULL id`.
- `evolucao_paciente_paciente_id_fkey`: `FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE`.
- `evolucao_paciente_paciente_id_not_null`: `NOT NULL paciente_id`.
- `evolucao_paciente_pkey`: `PRIMARY KEY (id)`.
- `evolucao_paciente_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `evolucao_paciente_usuario_id_not_null`: `NOT NULL usuario_id`.

### categoria

Categorias do catálogo de materiais.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('categoria_id_seq'::regclass)` |
| `nome` | `VARCHAR` | Não | — |

Restrições e relacionamentos:

- `categoria_id_not_null`: `NOT NULL id`.
- `categoria_nome_key`: `UNIQUE (nome)`.
- `categoria_nome_not_null`: `NOT NULL nome`.
- `categoria_pkey`: `PRIMARY KEY (id)`.

### material

Catálogo e saldo total do material. lote, validade e data_entrada permanecem por compatibilidade; o controle atual por lote usa material_lote.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('material_id_seq'::regclass)` |
| `nome` | `VARCHAR` | Não | — |
| `unidade_medida` | `VARCHAR` | Sim | — |
| `quantidade` | `INTEGER` | Não | `0` |
| `estoque_minimo` | `INTEGER` | Não | `5` |
| `codigo_barras` | `VARCHAR` | Sim | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |
| `categoria_id` | `INTEGER` | Sim | — |
| `estoque_ideal` | `INTEGER` | Sim | — |
| `fabricante` | `VARCHAR` | Sim | — |
| `lote` | `VARCHAR` | Sim | — |
| `registro_anvisa` | `VARCHAR` | Sim | — |
| `data_entrada` | `DATE` | Sim | — |
| `validade` | `DATE` | Sim | — |
| `imagem_base64` | `TEXT` | Sim | — |
| `descricao` | `TEXT` | Sim | — |
| `tipo_material` | `VARCHAR` | Não | `'consumivel'::character varying` |
| `passa_cme` | `BOOLEAN` | Não | `false` |

Restrições e relacionamentos:

- `chk_material_estoque_ideal`: `CHECK (((estoque_ideal IS NULL) OR (estoque_ideal >= estoque_minimo)))`.
- `chk_material_quantidade_nao_negativa`: `CHECK ((quantidade >= 0))`.
- `material_categoria_id_fkey`: `FOREIGN KEY (categoria_id) REFERENCES categoria(id)`.
- `material_estoque_minimo_not_null`: `NOT NULL estoque_minimo`.
- `material_id_not_null`: `NOT NULL id`.
- `material_nome_not_null`: `NOT NULL nome`.
- `material_passa_cme_not_null`: `NOT NULL passa_cme`.
- `material_pkey`: `PRIMARY KEY (id)`.
- `material_quantidade_not_null`: `NOT NULL quantidade`.
- `material_tipo_material_check`: `CHECK (((tipo_material)::text = ANY ((ARRAY['consumivel'::character varying, 'instrumental'::character varying])::text[])))`.
- `material_tipo_material_not_null`: `NOT NULL tipo_material`.
- `uq_material_codigo_barras`: `UNIQUE (codigo_barras)`.

### material_lote

Saldo, validade e recebimento de cada lote por material.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('material_lote_id_seq'::regclass)` |
| `material_id` | `INTEGER` | Não | — |
| `lote` | `VARCHAR` | Não | — |
| `validade` | `DATE` | Sim | — |
| `quantidade` | `INTEGER` | Não | `0` |
| `data_recebimento` | `DATE` | Não | `CURRENT_DATE` |
| `fornecedor` | `VARCHAR` | Sim | — |
| `observacao` | `TEXT` | Sim | — |

Restrições e relacionamentos:

- `material_lote_data_recebimento_not_null`: `NOT NULL data_recebimento`.
- `material_lote_id_not_null`: `NOT NULL id`.
- `material_lote_lote_not_null`: `NOT NULL lote`.
- `material_lote_material_id_fkey`: `FOREIGN KEY (material_id) REFERENCES material(id)`.
- `material_lote_material_id_lote_key`: `UNIQUE (material_id, lote)`.
- `material_lote_material_id_not_null`: `NOT NULL material_id`.
- `material_lote_pkey`: `PRIMARY KEY (id)`.
- `material_lote_quantidade_check`: `CHECK ((quantidade >= 0))`.
- `material_lote_quantidade_not_null`: `NOT NULL quantidade`.

### movimentacao_estoque

Histórico de entradas/saídas, com usuário e vínculo opcional ao lote.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('movimentacao_estoque_id_seq'::regclass)` |
| `material_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `tipo` | `VARCHAR` | Não | — |
| `quantidade` | `INTEGER` | Não | — |
| `data_hora` | `TIMESTAMP` | Sim | `now()` |
| `observacao` | `TEXT` | Sim | — |
| `lote_id` | `INTEGER` | Sim | — |
| `data_recebimento` | `DATE` | Sim | — |
| `fornecedor` | `VARCHAR` | Sim | — |

Restrições e relacionamentos:

- `chk_movimentacao_tipo`: `CHECK (((tipo)::text = ANY ((ARRAY['entrada'::character varying, 'saida'::character varying])::text[])))`.
- `movimentacao_estoque_id_not_null`: `NOT NULL id`.
- `movimentacao_estoque_lote_id_fkey`: `FOREIGN KEY (lote_id) REFERENCES material_lote(id)`.
- `movimentacao_estoque_material_id_fkey`: `FOREIGN KEY (material_id) REFERENCES material(id)`.
- `movimentacao_estoque_material_id_not_null`: `NOT NULL material_id`.
- `movimentacao_estoque_pkey`: `PRIMARY KEY (id)`.
- `movimentacao_estoque_quantidade_not_null`: `NOT NULL quantidade`.
- `movimentacao_estoque_tipo_not_null`: `NOT NULL tipo`.
- `movimentacao_estoque_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `movimentacao_estoque_usuario_id_not_null`: `NOT NULL usuario_id`.

### esterilizacao

Ciclos de esterilização e dados do equipamento.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('esterilizacao_id_seq'::regclass)` |
| `usuario_id` | `INTEGER` | Não | — |
| `data_hora` | `TIMESTAMP` | Sim | `now()` |
| `resultado` | `VARCHAR` | Sim | `'pendente'::character varying` |
| `controle_biologico` | `BOOLEAN` | Sim | `false` |
| `observacoes` | `TEXT` | Sim | — |
| `equipamento` | `VARCHAR` | Sim | — |
| `tipo_ciclo` | `VARCHAR` | Sim | `'vapor'::character varying` |
| `temperatura` | `NUMERIC(5,1)` | Sim | — |
| `pressao` | `NUMERIC(5,2)` | Sim | — |
| `duracao_minutos` | `INTEGER` | Sim | — |
| `status` | `VARCHAR` | Sim | `'pendente'::character varying` |

Restrições e relacionamentos:

- `chk_esterilizacao_resultado`: `CHECK (((resultado)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'reprovado'::character varying])::text[])))`.
- `esterilizacao_id_not_null`: `NOT NULL id`.
- `esterilizacao_pkey`: `PRIMARY KEY (id)`.
- `esterilizacao_status_check`: `CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'em_andamento'::character varying, 'concluido'::character varying, 'falhou'::character varying])::text[])))`.
- `esterilizacao_tipo_ciclo_check`: `CHECK (((tipo_ciclo)::text = ANY ((ARRAY['vapor'::character varying, 'calor_seco'::character varying, 'plasma'::character varying])::text[])))`.
- `esterilizacao_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `esterilizacao_usuario_id_not_null`: `NOT NULL usuario_id`.

### controle_biologico

Indicadores biológicos, químicos e Bowie-Dick de um ciclo.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('controle_biologico_id_seq'::regclass)` |
| `esterilizacao_id` | `INTEGER` | Não | — |
| `tipo` | `VARCHAR` | Não | — |
| `resultado` | `VARCHAR` | Não | `'pendente'::character varying` |
| `lote_indicador` | `VARCHAR` | Sim | — |
| `data_teste` | `TIMESTAMP` | Sim | `now()` |
| `testado_por_id` | `INTEGER` | Sim | — |
| `observacao` | `TEXT` | Sim | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `controle_biologico_esterilizacao_id_fkey`: `FOREIGN KEY (esterilizacao_id) REFERENCES esterilizacao(id) ON DELETE CASCADE`.
- `controle_biologico_esterilizacao_id_not_null`: `NOT NULL esterilizacao_id`.
- `controle_biologico_id_not_null`: `NOT NULL id`.
- `controle_biologico_pkey`: `PRIMARY KEY (id)`.
- `controle_biologico_resultado_check`: `CHECK (((resultado)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'reprovado'::character varying])::text[])))`.
- `controle_biologico_resultado_not_null`: `NOT NULL resultado`.
- `controle_biologico_testado_por_id_fkey`: `FOREIGN KEY (testado_por_id) REFERENCES usuario(id)`.
- `controle_biologico_tipo_check`: `CHECK (((tipo)::text = ANY ((ARRAY['bowie_dick'::character varying, 'biologico'::character varying, 'quimico'::character varying])::text[])))`.
- `controle_biologico_tipo_not_null`: `NOT NULL tipo`.

### pacote_esterilizado

Pacote CME. Pode existir antes do ciclo: esterilizacao_id é opcional. material_id é legado e opcional; os instrumentos do fluxo atual ficam em pacote_item.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('pacote_esterilizado_id_seq'::regclass)` |
| `esterilizacao_id` | `INTEGER` | Sim | — |
| `material_id` | `INTEGER` | Sim | — |
| `qr_code` | `VARCHAR` | Sim | — |
| `status` | `VARCHAR` | Sim | `'esterilizado'::character varying` |
| `validade` | `DATE` | Sim | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |
| `nome` | `VARCHAR` | Sim | — |
| `preparado_por` | `INTEGER` | Sim | — |
| `liberado_por` | `INTEGER` | Sim | — |

Restrições e relacionamentos:

- `chk_pacote_status`: `CHECK (((status)::text = ANY ((ARRAY['aguardando'::character varying, 'em_esterilizacao'::character varying, 'esterilizado'::character varying, 'utilizado'::character varying, 'vencido'::character varying])::text[])))`.
- `pacote_esterilizado_esterilizacao_id_fkey`: `FOREIGN KEY (esterilizacao_id) REFERENCES esterilizacao(id)`.
- `pacote_esterilizado_id_not_null`: `NOT NULL id`.
- `pacote_esterilizado_liberado_por_fkey`: `FOREIGN KEY (liberado_por) REFERENCES usuario(id)`.
- `pacote_esterilizado_material_id_fkey`: `FOREIGN KEY (material_id) REFERENCES material(id)`.
- `pacote_esterilizado_pkey`: `PRIMARY KEY (id)`.
- `pacote_esterilizado_preparado_por_fkey`: `FOREIGN KEY (preparado_por) REFERENCES usuario(id)`.
- `uq_pacote_esterilizado_qr_code`: `UNIQUE (qr_code)`.

### pacote_item

Instrumentos e quantidades de um pacote; a ordem das colunas é usada por um INSERT do backend sem lista de colunas.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `pacote_id` | `INTEGER` | Não | — |
| `material_id` | `INTEGER` | Não | — |
| `quantidade` | `INTEGER` | Não | — |

Restrições e relacionamentos:

- `pacote_item_material_id_fkey`: `FOREIGN KEY (material_id) REFERENCES material(id)`.
- `pacote_item_material_id_not_null`: `NOT NULL material_id`.
- `pacote_item_pacote_id_fkey`: `FOREIGN KEY (pacote_id) REFERENCES pacote_esterilizado(id) ON DELETE CASCADE`.
- `pacote_item_pacote_id_not_null`: `NOT NULL pacote_id`.
- `pacote_item_pkey`: `PRIMARY KEY (pacote_id, material_id)`.
- `pacote_item_quantidade_check`: `CHECK ((quantidade > 0))`.
- `pacote_item_quantidade_not_null`: `NOT NULL quantidade`.

### pacote_evento

Histórico de preparo e processamento do pacote, com responsável.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('pacote_evento_id_seq'::regclass)` |
| `pacote_id` | `INTEGER` | Não | — |
| `usuario_id` | `INTEGER` | Não | — |
| `evento` | `VARCHAR` | Não | — |
| `criado_em` | `TIMESTAMP` | Sim | `now()` |

Restrições e relacionamentos:

- `pacote_evento_evento_not_null`: `NOT NULL evento`.
- `pacote_evento_id_not_null`: `NOT NULL id`.
- `pacote_evento_pacote_id_fkey`: `FOREIGN KEY (pacote_id) REFERENCES pacote_esterilizado(id)`.
- `pacote_evento_pacote_id_not_null`: `NOT NULL pacote_id`.
- `pacote_evento_pkey`: `PRIMARY KEY (id)`.
- `pacote_evento_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id)`.
- `pacote_evento_usuario_id_not_null`: `NOT NULL usuario_id`.

### notificacao

Avisos individuais por usuário. referencia_id é referência polimórfica e não possui FK.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `id` | `INTEGER` | Não | `nextval('notificacao_id_seq'::regclass)` |
| `usuario_id` | `INTEGER` | Não | — |
| `titulo` | `VARCHAR` | Não | — |
| `mensagem` | `TEXT` | Sim | — |
| `tipo` | `VARCHAR` | Não | `'sistema'::character varying` |
| `link` | `VARCHAR` | Sim | — |
| `referencia_id` | `INTEGER` | Sim | — |
| `lida` | `BOOLEAN` | Não | `false` |
| `lida_em` | `TIMESTAMP` | Sim | — |
| `criado_em` | `TIMESTAMP` | Não | `now()` |

Restrições e relacionamentos:

- `notificacao_criado_em_not_null`: `NOT NULL criado_em`.
- `notificacao_id_not_null`: `NOT NULL id`.
- `notificacao_lida_not_null`: `NOT NULL lida`.
- `notificacao_pkey`: `PRIMARY KEY (id)`.
- `notificacao_tipo_not_null`: `NOT NULL tipo`.
- `notificacao_titulo_not_null`: `NOT NULL titulo`.
- `notificacao_usuario_id_fkey`: `FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE`.
- `notificacao_usuario_id_not_null`: `NOT NULL usuario_id`.

Índices adicionais:

- `CREATE INDEX idx_notificacao_nao_lidas ON public.notificacao USING btree (usuario_id) WHERE (lida = false)`.
- `CREATE INDEX idx_notificacao_usuario ON public.notificacao USING btree (usuario_id, criado_em DESC)`.

### _migrations

Controle técnico dos arquivos SQL já aplicados pelo backend.

| Campo | Tipo | Aceita NULL | Padrão |
| --- | --- | --- | --- |
| `nome_arquivo` | `TEXT` | Não | — |
| `aplicada_em` | `TIMESTAMP` | Não | `now()` |

Restrições e relacionamentos:

- `_migrations_aplicada_em_not_null`: `NOT NULL aplicada_em`.
- `_migrations_nome_arquivo_not_null`: `NOT NULL nome_arquivo`.
- `_migrations_pkey`: `PRIMARY KEY (nome_arquivo)`.

## Validação executada

PostgreSQL 18.4 local e isolado: migrations 001–018 aplicadas; SQL completo restaurado em um segundo banco vazio; comparação de todas as colunas, defaults, nulabilidade, constraints e índices; verificação SQL dos vínculos de prontuário, equipes, estoque, CME e dos novos status; rejeição de status inválido, saldo negativo, vínculo duplicado e referência a usuário inexistente. A migration 018 também foi reaplicada com sucesso.

Nenhum banco publicado foi acessado ou alterado. Esta validação comprova a estrutura e os cenários SQL testados; não substitui testar a API publicada, e-mails, permissões e persistência em homologação.
