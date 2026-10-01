# Recuperação de senha por código de e-mail

Integração preparada e testada sobre `.review-backend.local`. Esta pasta é um conjunto de arquivos para integrar ao repositório do backend; não é um servidor independente. A cópia local do backend está ignorada pelo Git, por isso os arquivos também ficam aqui para entrega.

## Ativação

1. Confirmar o repositório que publica a API no Railway e integrar os arquivos desta pasta nas mesmas posições. Comparar `authService.js` e `authController.js` com a versão publicada antes de substituir, preservando alterações que existam lá.
2. Criar uma conta no [Resend](https://resend.com/docs/introduction), verificar um domínio e criar uma chave de envio. Configurar no backend do Railway:
   - `RESEND_API_KEY`: chave privada de envio.
   - `EMAIL_FROM`: `Clínica Odontológica <acesso@seu-dominio-verificado>`.
   - `JWT_SECRET`: manter o segredo existente; ele também protege os resumos dos códigos.
3. Aplicar `migrations/015_recuperacao_codigo.sql` pelo processo de migrations do backend (`npm run migrate`). Conferir a numeração se houver migrations mais novas no repositório publicado.
4. Publicar o backend junto com o frontend: o contrato anterior com `token` foi substituído por `email` e `codigo`.
5. Validar com uma conta de teste cadastrada: receber o código, redefinir a senha, entrar com a nova senha e verificar que o código usado é recusado.

Nenhuma chave deve ser colocada nas variáveis `VITE_*` ou no frontend. Não foram enviados e-mails reais, aplicadas migrations em banco real ou publicados serviços durante esta alteração.

## Contrato

- `POST /api/auth/recuperar-senha`: `{ "email": "aluno@dominio.com" }`. Retorna mensagem genérica, sem código, inclusive para e-mail não cadastrado. Sem configuração de envio retorna 503.
- `POST /api/auth/redefinir-senha`: `{ "email": "aluno@dominio.com", "codigo": "012345", "nova_senha": "novaSenha123" }`.
- Código aleatório de seis dígitos, válido por dez minutos, armazenado como HMAC. Limite de cinco tentativas por código, intervalo de sessenta segundos entre envios. Novo envio substitui o código anterior. Após cinco erros, solicitar outro código.
- Alteração da senha e consumo do código são feitos na mesma transação, com bloqueio de linha. Contadores ficam no PostgreSQL e sobrevivem a reinícios da API.

## Testes

No backend: `npm test -- --runTestsByPath tests/auth.test.js tests/recovery.test.js tests/recoveryRepository.test.js tests/recoveryEmail.test.js`.

Os testes usam banco e provedor simulados. A entrega na caixa de entrada e o comportamento SQL no PostgreSQL precisam da validação de ativação acima.
