# Odonto

Frontend da clínica odontológica em React e Vite, com áreas de aluno, professor, coordenador e recepção.

## Desenvolvimento

```sh
npm ci
npm run dev
```

Configure `VITE_API_URL` em `.env.local` com a URL do backend, incluindo `/api`. Esse arquivo fica fora do Git. Credenciais do PostgreSQL, JWT e e-mail pertencem ao backend, nunca às variáveis `VITE_*`.

## Verificação

```sh
npm run lint
npx playwright install chromium
npm test
npm run build
```

Os testes do frontend usam API simulada. A integração com a API publicada exige validação separada.

## Organização

- `src/`: telas, componentes, autenticação e integração com a API.
- `tests/`: testes Playwright e fixtures.
- `database/`: estrutura SQL, migrations complementares e documentação da atualização do banco.
- `backend-alunos/`, `backend-recepcao/`, `backend-recuperacao/`: alterações pendentes de integração no repositório da API; não são servidores independentes.
- [Estrutura do banco](database/README.md).
- [Integração de recepção e prontuário](backend-recepcao/README.md).
- [Integração de recuperação de senha](backend-recuperacao/README.md).

Dependências, builds, relatórios de testes, arquivos de ambiente, cópias locais e PDFs/ZIPs de entrega ficam fora do versionamento pelo `.gitignore`.
