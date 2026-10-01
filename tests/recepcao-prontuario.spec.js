import { test, expect } from '@playwright/test';

const paciente = { id: 42, nome: 'Maria Compartilhada', cpf: '12345678901', data_nascimento: '1990-01-10', ativo: true };
async function preparar(page, perfil = 'recepcionista', id = 1) {
  await page.addInitScript(user => {
    localStorage.setItem('token', 'teste'); localStorage.setItem('usuario', JSON.stringify(user));
  }, { id, perfil, nome: 'Usuário Teste' });
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname.replace('/api', '');
    let json = [];
    if (path === '/auth/me') json = { id, perfil, nome: 'Usuário Teste' };
    if (path === '/pacientes') json = [paciente];
    if (path === '/pacientes/42') json = paciente;
    if (path === '/consultas/disciplinas') json = ['Endodontia'];
    if (path === '/usuarios/profissionais') json = [{ id: 1, nome: 'Professor Teste', perfil: 'professor' }, { id: 2, nome: 'Aluno Teste', perfil: 'aluno' }, { id: 3, nome: 'Coordenador Teste', perfil: 'coordenador' }];
    if (path === '/pacientes/42/saude') json = { alergias_status: 'nenhum', medicamentos_status: 'nenhum', alergias: [], medicamentos: [], saude_versao: 0 };
    if (path.includes('nao-lidas')) json = { total: 0 };
    return route.fulfill({ json });
  });
}

test('cadastro exige resposta explícita de saúde e aceita ausência de alergias e medicamentos', async ({ page }) => {
  await preparar(page);
  await page.goto('/app/recepcao/pacientes/cadastro');
  const alergias = page.getByLabel('Alergias *', { exact: true });
  const medicamentos = page.getByLabel('Medicamentos em uso *', { exact: true });
  await expect(alergias).toHaveAttribute('required', '');
  await expect(medicamentos).toHaveAttribute('required', '');
  expect(await alergias.evaluate(el => el.checkValidity())).toBe(false);
  await alergias.selectOption('nenhum'); await medicamentos.selectOption('nenhum');
  expect(await alergias.evaluate(el => el.checkValidity())).toBe(true);
  expect(await medicamentos.evaluate(el => el.checkValidity())).toBe(true);
});

test('professor abre consulta notificada e atribui alunos', async ({ page }) => {
  await preparar(page, 'professor');
  const consulta = { id: 7, paciente_id: 42, usuario_id: 1, data_hora: '2026-10-01T09:00:00-03:00', status: 'agendada', disciplina: 'Endodontia' };
  await page.route('**/api/consultas', route => route.fulfill({ json: [consulta] }));
  await page.route('**/api/consultas/7', route => route.fulfill({ json: consulta }));
  let alunosIds;
  await page.route('**/api/consultas/7/alunos', route => {
    if (route.request().method() === 'PUT') alunosIds = route.request().postDataJSON().alunos_ids;
    return route.fulfill({ json: [] });
  });
  await page.goto('/app/professor/agenda?consulta=7');
  await page.getByRole('button', { name: 'Definir alunos responsáveis' }).click();
  await page.getByLabel('Aluno Teste').check();
  await page.getByRole('button', { name: 'Salvar alunos' }).click();
  await expect(page.getByText('Alunos responsáveis atualizados.')).toBeVisible();
  expect(alunosIds).toEqual([2]);
});

test('agenda separa confirmação e mostra nomes e horários nos dias, inclusive ao mudar de mês', async ({ page }) => {
  await preparar(page);
  await page.clock.install({ time: new Date('2026-09-30T12:00:00-03:00') });
  await page.route('**/api/consultas', route => route.fulfill({ json: [
    { id: 1, paciente_id: 42, data_hora: '2026-09-30T08:30:00-03:00', status: 'confirmada' },
    { id: 2, paciente_id: 42, data_hora: '2026-09-30T10:00:00-03:00', status: 'agendada' },
    { id: 3, paciente_id: 42, data_hora: '2026-10-01T09:00:00-03:00', status: 'agendada' },
  ] }));
  await page.goto('/app/recepcao/agenda');
  const dia = page.getByRole('button', { name: '30/09/2026', exact: true });
  await expect(dia).toContainText('08:30'); await expect(dia).toContainText('Maria Compartilhada');
  await expect(page.getByRole('region', { name: 'Confirmados', exact: true })).toContainText('08:30');
  await expect(page.getByRole('region', { name: 'Não confirmados', exact: true })).toContainText('10:00');
  await expect(page.getByRole('region', { name: 'Confirmados', exact: true })).not.toContainText('10:00');
  await page.getByRole('button', { name: 'Próximo dia', exact: true }).click();
  await expect(page.getByRole('button', { name: '01/10/2026' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('region', { name: 'Não confirmados', exact: true })).toContainText('09:00');
  await page.getByRole('button', { name: 'Dia anterior', exact: true }).click();
  await expect(dia).toHaveAttribute('aria-pressed', 'true');
});

test('painel não apresenta zeros ou filas vazias como dados válidos quando a API falha', async ({ page }) => {
  await preparar(page);
  await page.route('**/api/consultas', route => route.fulfill({ status: 500, json: {} }));
  await page.goto('/app/recepcao/dashboard');
  await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar');
  await expect(page.getByText('Nenhum paciente aguardando no momento.')).not.toBeVisible();
});

test('recepção agenda com supervisor sem exigir aluno', async ({ page }) => {
  await preparar(page);
  let payload;
  await page.route('**/api/consultas', route => { payload = route.request().postDataJSON(); return route.fulfill({ json: { id: 7 } }); });
  await page.goto('/app/recepcao/agenda/novo-agendamento');
  await page.getByPlaceholder('Buscar paciente por nome ou CPF...').fill('Maria');
  await page.getByRole('button', { name: /Maria Compartilhada/ }).click();
  await page.locator('select').first().selectOption('Endodontia');
  const responsavel = page.getByRole('combobox', { name: 'Professor ou coordenador responsável' });
  await expect(responsavel.locator('option')).toHaveCount(3);
  await expect(responsavel).not.toContainText('Aluno Teste');
  await responsavel.selectOption('1');
  await page.locator('input[type=date]').fill('2026-10-01');
  await page.locator('input[type=time]').fill('09:00');
  await page.getByRole('button', { name: 'Agendar consulta', exact: true }).click();
  await expect(page.getByText('Consulta agendada com sucesso!')).toBeVisible();
  expect(payload.usuario_id).toBe(1); expect(payload.alunos_ids).toBeUndefined();
});

for (const perfil of ['aluno', 'professor', 'coordenador', 'recepcionista']) {
  test(`${perfil} vê histórico completo e edita a mesma informação de saúde`, async ({ page }) => {
    await preparar(page, perfil);
    let saudeSalva;
    await page.route('**/api/pacientes/42/saude', route => {
      if (route.request().method() === 'PUT') { saudeSalva = route.request().postDataJSON(); return route.fulfill({ json: { ...saudeSalva, saude_versao: 1 } }); }
      return route.fulfill({ json: { alergias_status: 'nenhum', medicamentos_status: 'nenhum', alergias: [], medicamentos: [], saude_versao: 0 } });
    });
    await page.route('**/api/pacientes/42/historico', route => route.fulfill({ json: [
      { id: 'consulta-1', tipo: 'consulta', descricao: 'Limpeza', status: 'realizada', criado_em: '2026-08-01T10:00:00' },
      { id: 'cirurgia-1', tipo: 'cirurgia', descricao: 'Extração', status: 'realizada', criado_em: '2026-08-02T10:00:00' },
      { id: 'evolucao-1', tipo: 'evolucao', descricao: 'Restauração concluída', status: 'registrada', criado_em: '2026-08-03T10:00:00' },
    ] }));
    const area = perfil === 'recepcionista' ? 'recepcao' : perfil;
    await page.goto(`/app/${area}/pacientes/detalhes?id=42`);
    await page.getByRole('button', { name: 'Editar alergias e medicamentos' }).click();
    await page.getByLabel('Alergias *', { exact: true }).selectOption('informado');
    await page.getByRole('button', { name: 'Adicionar alergia', exact: true }).click();
    await page.getByLabel('Alergias 1', { exact: true }).fill('Penicilina');
    await page.getByRole('button', { name: 'Salvar informações de saúde' }).click();
    await expect(page.getByText('Penicilina', { exact: false })).toBeVisible();
    expect(saudeSalva.alergias[0].substancia).toBe('Penicilina');
    await page.getByRole('button', { name: 'Histórico', exact: true }).click();
    await expect(page.getByText('Limpeza', { exact: true })).toBeVisible();
    await expect(page.getByText('Extração', { exact: true })).toBeVisible();
    await expect(page.getByText('Restauração concluída', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Documentos', exact: true }).click();
    if (perfil === 'recepcionista') await expect(page.getByLabel('Importar documento digitalizado')).toBeVisible();
    else await expect(page.getByLabel('Importar documento digitalizado')).toHaveCount(0);
  });
}

test('recepção importa exame e o documento permanece após recarregar', async ({ page }) => {
  await preparar(page);
  const docs = [];
  await page.route('**/api/pacientes/42/documentos', route => {
    if (route.request().method() === 'POST') { const d = route.request().postDataJSON(); expect(d.conteudo_base64).toBeTruthy(); docs.push({ id: 1, nome_arquivo: d.nome_arquivo }); return route.fulfill({ json: docs[0] }); }
    return route.fulfill({ json: docs });
  });
  await page.goto('/app/recepcao/pacientes/detalhes?id=42');
  await page.getByRole('button', { name: 'Documentos', exact: true }).click();
  await page.getByLabel('Importar documento digitalizado').setInputFiles({ name: 'resultado-exame.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 teste') });
  await expect(page.getByText('resultado-exame.pdf')).toBeVisible();
  await page.reload(); await page.getByRole('button', { name: 'Documentos', exact: true }).click();
  await expect(page.getByText('resultado-exame.pdf')).toBeVisible();
});
