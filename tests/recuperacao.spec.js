import { test, expect } from '@playwright/test';

test('recuperação por código e nova senha', async ({ page }) => {
  await page.route('**/api/auth/recuperar-senha', async route => {
    expect(route.request().postDataJSON()).toEqual({ email: 'aluno@example.com' });
    await route.fulfill({ json: { message: 'Solicitação recebida' } });
  });
  await page.route('**/api/auth/redefinir-senha', async route => {
    expect(route.request().postDataJSON()).toEqual({ email: 'aluno@example.com', codigo: '012345', nova_senha: 'novaSenha123' });
    await route.fulfill({ json: { message: 'Senha redefinida' } });
  });
  await page.goto('/login');
  await page.getByRole('link', { name: 'Esqueci minha senha' }).click();
  await page.getByPlaceholder('E-mail Institucional').fill('aluno@example.com');
  await page.getByRole('button', { name: 'Enviar instruções' }).click();
  await expect(page).toHaveURL(/redefinir-senha$/);
  await page.getByPlaceholder('Código de 6 dígitos').fill('012345');
  await page.getByPlaceholder('Nova senha', { exact: true }).fill('novaSenha123');
  await page.getByPlaceholder('Confirmar nova senha').fill('novaSenha123');
  await page.getByRole('button', { name: 'Redefinir senha', exact: true }).click();
  await expect(page.getByText(/Senha redefinida com sucesso/)).toBeVisible();
  await expect(page).toHaveURL(/login$/);
});

test('código expirado permanece na tela e permite solicitar outro', async ({ page }) => {
  await page.route('**/api/auth/redefinir-senha', route => route.fulfill({ status: 401, json: { message: 'Código expirado' } }));
  await page.goto('/redefinir-senha');
  await page.getByPlaceholder('E-mail Institucional').fill('aluno@example.com');
  await page.getByPlaceholder('Código de 6 dígitos').fill('123456');
  await page.getByPlaceholder('Nova senha', { exact: true }).fill('novaSenha123');
  await page.getByPlaceholder('Confirmar nova senha').fill('novaSenha123');
  await page.getByRole('button', { name: 'Redefinir senha', exact: true }).click();
  await expect(page.getByText('Código expirado', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/redefinir-senha$/);
  await page.getByRole('link', { name: 'Solicitar outro código' }).click();
  await expect(page).toHaveURL(/recuperar-senha$/);
});

test('falha de envio não avança para confirmação', async ({ page }) => {
  await page.route('**/api/auth/recuperar-senha', route => route.fulfill({ status: 503, json: { message: 'Envio indisponível' } }));
  await page.goto('/recuperar-senha');
  await page.getByPlaceholder('E-mail Institucional').fill('aluno@example.com');
  await page.getByRole('button', { name: 'Enviar instruções' }).click();
  await expect(page.getByText('Envio indisponível')).toBeVisible();
  await expect(page).toHaveURL(/recuperar-senha$/);
});
