import { test, expect } from '@playwright/test';
// Os quatro perfis s?o recebidos da API sem convers?o de privil?gios.
const usuario = (perfil) => ({ id: 1, nome: 'Pessoa de Teste', email: 'teste@example.com', perfil });

async function mockApi(page, perfil = 'aluno', authenticated = true) {
  const requests = [];
  if (authenticated) {
    await page.addInitScript((user) => {
      localStorage.setItem('token', 'token-apenas-para-teste');
      localStorage.setItem('usuario', JSON.stringify(user));
    }, usuario(perfil));
  }
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname.replace('/api', '');
    requests.push({ path, method: route.request().method(), body: route.request().postDataJSON() });
    let json = [];
    if (path === '/auth/me') json = usuario(perfil);
    if (path === '/auth/login') json = { token: 'token-apenas-para-teste', usuario: usuario(perfil) };
    if (path === '/dashboard/resumo') json = {};
    if (path.includes('nao-lidas')) json = { total: 0 };
    if (path === '/consultas/disciplinas') json = ['Endodontia', 'Dentística'];
    await route.fulfill({ json });
  });
  return requests;
}

test('login respeita campos obrigatórios e mostra erro sem recarregar', async ({ page }) => {
  const requests = await mockApi(page, 'aluno', false);
  await page.goto('/login');
  await page.getByRole('button', { name: 'Aluno', exact: true }).click();
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  expect(requests.filter(r => r.path === '/auth/login')).toHaveLength(0);
  await page.getByPlaceholder('E-mail', { exact: true }).fill('teste@example.com');
  await page.getByPlaceholder('Senha', { exact: true }).fill('senha-incorreta');
  await page.route('**/api/auth/login', route => route.fulfill({ status: 401, json: { message: 'Credenciais inválidas para teste' } }));
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByText('Credenciais inválidas para teste')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

for (const [perfil, label, area] of [['professor', 'Professor', 'professor'], ['aluno', 'Aluno', 'aluno'], ['coordenador', 'Coordenador', 'coordenador'], ['recepcionista', 'Recepção', 'recepcao']]) {
  test(`login e logout: ${perfil}`, async ({ page }) => {
    await mockApi(page, perfil, false);
    await page.goto('/login');
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.getByPlaceholder('E-mail', { exact: true }).fill('teste@example.com');
    await page.getByPlaceholder('Senha', { exact: true }).fill('senha-teste');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/app/${area}/dashboard$`));
    if (perfil !== 'recepcionista') await page.goto(`/app/${area}/configuracoes`);
    await page.getByRole('button', { name: /sair/i }).click();
    if (perfil === 'aluno') await page.getByRole('button', { name: 'Sair', exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => [localStorage.getItem('token'), localStorage.getItem('usuario')])).toEqual([null, null]);
  });
}

test('rotas exigem token, mesmo com usuário salvo', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('usuario', JSON.stringify({ perfil: 'coordenador' })));
  await page.goto('/app/coordenador/configuracoes');
  await expect(page).toHaveURL(/\/login$/);
});

test('aluno não acessa área de coordenador', async ({ page }) => {
  await mockApi(page, 'aluno');
  await page.goto('/app/coordenador/configuracoes');
  await expect(page).toHaveURL(/\/app\/aluno\/dashboard$/);
});

const routes = {
  aluno: ['dashboard', 'agenda', 'cirurgias', 'cirurgias/detalhes', 'estoque', 'estoque/cadastrar', 'estoque/materiais', 'estoque/detalhes', 'estoque/configurar-etiqueta', 'agenda/detalhes', 'pacientes/detalhes', 'configuracoes', 'notificacoes'],
  coordenador: ['dashboard', 'agenda', 'cirurgias', 'cirurgias/nova', 'cirurgias/detalhes', 'mutirao', 'pacientes', 'pacientes/detalhes', 'cme', 'cme/novo-ciclo', 'cme/pacotes-esterilizados', 'cme/controle-biologico', 'estoque', 'estoque/cadastrar', 'estoque/materiais', 'estoque/detalhes', 'estoque/configurar-etiqueta', 'configuracoes', 'configuracoes/novo-usuario', 'notificacoes'],
  recepcao: ['dashboard', 'agenda', 'agenda/novo-agendamento', 'agenda/reagendar', 'agenda/cancelar', 'pacientes', 'pacientes/cadastro', 'pacientes/detalhes', 'status-consultas', 'fila-completa', 'notificacoes'],
};

routes.professor = routes.coordenador.filter(path => path !== 'configuracoes/novo-usuario');

for (const [area, paths] of Object.entries(routes)) {
  test(`telas de ${area} não quebram com listas vazias ou acesso direto`, async ({ page }) => {
    test.setTimeout(90000);
    await mockApi(page, area === 'recepcao' ? 'recepcionista' : area);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of paths) {
      await page.goto(`/app/${area}/${path}`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#root')).not.toBeEmpty();
      expect(errors, path).toEqual([]);
    }
  });
}

for (const area of ['aluno', 'coordenador', 'professor', 'recepcao']) {
  test(`agenda ${area} mostra paciente e horário corretos`, async ({ page }) => {
    await mockApi(page, area === 'recepcao' ? 'recepcionista' : area);
    await page.route('**/api/pacientes', route => route.fulfill({ json: [{ id: 42, nome: 'Paciente Fictício QA' }] }));
    const now = new Date();
    const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(now);
    await page.route('**/api/consultas', route => route.fulfill({ json: [{ id: 91, paciente_id: 42, data_hora: `${date}T14:30:00-03:00`, disciplina: 'Endodontia', status: 'agendada', queixa_principal: 'Consulta de teste' }] }));
    await page.goto(`/app/${area}/agenda`);
    const agenda = area === 'recepcao' ? page.getByRole('region', { name: 'Não confirmados', exact: true }) : page;
    await expect(agenda.getByText('Paciente Fictício QA', { exact: false })).toBeVisible();
    await expect(agenda.getByText(/14:30/)).toBeVisible();
  });
}

test('login cabe em celular de 360px sem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await mockApi(page, 'aluno', false);
  await page.goto('/login');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  await page.getByRole('button', { name: 'Entrar', exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeInViewport();
});


test('professor usa telas clinicas sem administracao', async ({ page }) => {
  const requests = await mockApi(page, 'professor');
  await page.goto('/app/professor/configuracoes');
  await expect(page.getByRole('heading', { name: 'Minha conta' })).toBeVisible();
  await expect(page.getByText(/Backup|Auditoria|Permiss|Adicionar/)).toHaveCount(0);
  expect(requests.some(r => ['/usuarios', '/logs', '/permissoes'].includes(r.path))).toBe(false);
  await page.goto('/app/coordenador/configuracoes');
  await expect(page).toHaveURL(/\/app\/professor\/dashboard$/);
  await page.goto('/app/professor/configuracoes/novo-usuario');
  await expect(page).toHaveURL(/\/app\/professor\/dashboard$/);
  await page.getByRole('button', { name: 'Agenda', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/professor\/agenda$/);
  await expect(page.getByText('Agenda do Professor')).toBeVisible();
});
