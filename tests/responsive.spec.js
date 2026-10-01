import { test, expect } from '@playwright/test';

for (const width of [390, 768, 1440]) {
  for (const area of ['aluno', 'coordenador', 'professor', 'recepcao']) {
    test(`${area} ocupa a janela de ${width}px com navegação acessível`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const usuario = { id: 1, nome: 'Pessoa de Teste', perfil: area === 'recepcao' ? 'recepcionista' : area };
      await page.addInitScript(user => {
        localStorage.setItem('token', 'teste');
        localStorage.setItem('usuario', JSON.stringify(user));
      }, usuario);
      await page.route('**/api/**', route => {
        const path = new URL(route.request().url()).pathname;
        const json = path.endsWith('/auth/me') ? usuario : path.includes('resumo') ? {} : path.includes('nao-lidas') ? { total: 0 } : [];
        return route.fulfill({ json });
      });
      for (const screen of ['dashboard', 'agenda', 'pacientes/detalhes']) {
        await page.goto(`/app/${area}/${screen}`);
        const main = page.locator('main').first();
        await expect(main).toBeVisible();
        const box = await main.boundingBox();
        const sidebar = area === 'recepcao' ? (width < 768 ? 76 : 256) : (width < 768 ? 0 : 240);
        expect(box.width).toBeGreaterThanOrEqual(width - sidebar - 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        const navigation = page.locator(area === 'recepcao' ? '.reception-sidebar nav' : '.clinical-navigation');
        await expect(navigation).toBeVisible();
        if (area !== 'recepcao' && width >= 768) {
          expect(await navigation.locator('span').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
        }
      }
    });
  }
}
