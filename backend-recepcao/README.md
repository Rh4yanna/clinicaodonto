# Recepção, prontuário compartilhado e equipe das consultas

Arquivos preparados sobre a cópia `.review-backend.local`, que é ignorada pelo Git. Esta pasta contém as alterações para integrar no repositório que publica a API do Railway; não é um backend independente. O frontend exige essas alterações para os novos fluxos.

## Comportamento

- Painel e gerenciamento de pacientes usam `/consultas` e `/pacientes`, sem filtro pelo recepcionista logado. As telas consultam novamente o servidor, incluindo atualização periódica. Falhas de carregamento são exibidas.
- Cadastro exige `saude`: alergias e medicamentos, com declaração explícita de ausência quando for o caso. Paciente e saúde são criados na mesma transação. Registros antigos sem declaração ficam como “Ainda não informado”, sem presumir ausência.
- Recepção, aluno, professor e coordenador consultam o mesmo prontuário por ID. Todos podem atualizar alergias e medicamentos. `saude_versao` impede sobrescrever uma edição feita por outra pessoa com um formulário desatualizado.
- Histórico combina todas as consultas, cirurgias, evoluções clínicas e documentos do paciente, independentemente do usuário que os cadastrou. Mantém o status, inclusive agendamentos e cancelamentos; não apresenta eventos agendados como procedimentos realizados. Limpezas, extrações, restaurações e outros procedimentos precisam estar registrados na consulta, cirurgia ou evolução para aparecerem.
- Importação de exames/documentos é exclusiva da recepção. Os quatro perfis podem listar e baixar. O frontend aceita PDF, JPG e PNG até 8 MB; o limite JSON passa a 12 MB para acomodar a expansão do base64.
- Agenda geral mostra horário e nome dentro do dia. Abaixo aparecem confirmados e não confirmados, com seleção de data e setas diárias. Cancelamentos/faltas aparecem separadamente. `agendada` significa confirmação pendente; `confirmada`, `aguardando`, `em_atendimento` e `realizada` entram no grupo confirmado.
- A recepção escolhe professor/coordenador ativo e disciplina, sem selecionar aluno. `consulta.usuario_id` mantém o supervisor. Criação da consulta e da notificação ao supervisor é transacional.
- Professor responsável e coordenador podem atribuir alunos ativos em `consulta_aluno`. A atribuição não substitui o supervisor. Novos alunos recebem notificação, e a consulta é aberta na data correta ao clicar na notificação. Consultas encerradas não aceitam troca de equipe.

## Integração e publicação

1. Confirmar o repositório/branch usados pelo Railway e comparar os arquivos desta pasta com a versão atual, preservando alterações que só existam no backend publicado.
2. Integrar os arquivos nas mesmas posições. O backend deve ter as migrations anteriores, incluindo tabelas de notificações, alergias, medicamentos, documentos e evoluções. A configuração de datas já existente em `src/config/database.js` preserva timestamps locais sem `Z`; mantê-la.
3. Aplicar `migrations/016_recepcao_prontuario.sql` pelo processo de migrations do projeto (`npm run migrate`). Conferir a numeração caso existam novas migrations no backend publicado.
4. Publicar backend e frontend de forma coordenada. Não publicar apenas o frontend: os endpoints de saúde, histórico e equipe são novos.
5. Validar em homologação com duas contas de recepção, aluno, professor e coordenador: cadastrar paciente com saúde, consultar em outra conta, editar saúde, importar/baixar exame, registrar evolução, agendar, receber notificação e atribuir alunos. Recarregar e conferir persistência.

## Endpoints

- `POST /pacientes`: dados cadastrais existentes mais `saude: { alergias_status, medicamentos_status, alergias, medicamentos }`.
- Estados de saúde: `informado` exige pelo menos um item; `nenhum` exige lista vazia. Alergia: `{ substancia, gravidade? }`; medicamento: `{ nome_medicamento, dosagem? }`.
- `GET /pacientes/:id/saude` e `PUT /pacientes/:id/saude`: o PUT envia também `saude_versao` retornada no GET. Edição desatualizada retorna 409.
- `GET /pacientes/:id/historico`: linha do tempo completa.
- `POST /consultas`: paciente, supervisor em `usuario_id`, disciplina e data/hora; nenhum aluno obrigatório.
- `GET /consultas/:id/alunos` e `PUT /consultas/:id/alunos`: `{ alunos_ids: [2, 3] }`.

## Validação executada

Frontend: lint e testes Playwright, com API simulada. Backend: testes de rotas, permissões, regras e transações com PostgreSQL simulado:

```sh
npm test -- --runTestsByPath tests/consultas.test.js tests/pacientes.test.js tests/recepcao-prontuario.test.js tests/recepcao-transacoes.test.js
```

Não foram aplicadas migrations em banco real, publicados serviços ou manipulados prontuários reais. A persistência e entrega de notificações no ambiente publicado ainda exigem a validação de homologação acima.
