import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const paciente={id:42,nome:'Maria Teste',cpf:'12345678901'};
const saude={alergias_status:'informado',medicamentos_status:'informado',saude_versao:1,alergias:[{id:3,substancia:'Látex',gravidade:'grave'}],medicamentos:[{id:4,nome_medicamento:'Losartana',dosagem:'50 mg'}]};
async function preparar(page,perfil='aluno'){
 await page.addInitScript(user=>{localStorage.setItem('token','teste');localStorage.setItem('usuario',JSON.stringify(user));},{id:2,nome:'Ana Teste',perfil});
 await page.route('**/api/**',route=>{
  const path=new URL(route.request().url()).pathname.replace('/api','');
  let json=[];
  if(path==='/auth/me')json={id:2,nome:'Ana Teste',perfil};
  if(path==='/pacientes')json=[paciente];
  if(path==='/pacientes/42')json=paciente;
  if(path==='/pacientes/42/saude')json=saude;
  if(path==='/categorias')json=[{id:1,nome:'Instrumentos'}];
  if(path.includes('nao-lidas'))json={total:0};
  return route.fulfill({json});
 });
}
test('catálogo gera código opcional e oferece entrada com quantidade, lote e validade separados',async({page})=>{
 await preparar(page);let catalogo,entrada;
 const material={id:8,nome:'Pinça',codigo_barras:'MAT123',quantidade:0};
 await page.route('**/api/materiais',route=>{catalogo=route.request().postDataJSON();return route.fulfill({json:material});});
 await page.route('**/api/materiais/8',route=>route.fulfill({json:material}));
 await page.route('**/api/rastreabilidade/materiais/8/movimentos',route=>{entrada=route.request().postDataJSON();return route.fulfill({json:{id:9}});});
 await page.goto('/app/aluno/estoque/cadastrar');
 await expect(page.getByLabel('Quantidade *')).toHaveCount(0);
 await expect(page.getByLabel('Validade')).toHaveCount(0);
 await expect(page.getByLabel('Código de barras')).not.toHaveAttribute('required','');
 await page.getByLabel('Nome do produto').fill('Pinça');
 await page.getByLabel('Categoria *').selectOption('1');
 await page.getByLabel('Tipo de material').selectOption('instrumental');
 await page.getByLabel('Passa pelo CME').check();
 await page.getByRole('button',{name:'Salvar material'}).click();
 await expect(page.getByText('Material cadastrado!')).toBeVisible();
 expect(catalogo).toMatchObject({nome:'Pinça',codigo_barras:'',tipo_material:'instrumental',passa_cme:true});
 expect(catalogo).not.toHaveProperty('quantidade');expect(catalogo).not.toHaveProperty('lote');
 await page.getByRole('button',{name:'Adicionar ao estoque'}).click();
 await page.getByLabel('Quantidade *').fill('5');await page.getByLabel('Lote *').fill('ABC');
 await page.getByLabel('Validade *').fill('2027-10-01');await page.getByLabel('Data de recebimento *').fill('2026-09-10');
 await page.getByRole('button',{name:'Confirmar entrada'}).click();
 await expect(page).toHaveURL(/estoque\/detalhes/);
 expect(entrada).toMatchObject({quantidade:5,lote:'ABC',validade:'2027-10-01',data_recebimento:'2026-09-10'});
});
test('dashboard não oferece relatório nem apresenta falha da API como agenda vazia',async({page})=>{
 await preparar(page);await page.route('**/api/consultas',r=>r.fulfill({status:500,json:{}}));
 await page.goto('/app/aluno/dashboard');
 await expect(page.getByRole('button',{name:/baixar relatório/i})).toHaveCount(0);
 await expect(page.getByRole('alert')).toContainText('Não foi possível carregar seus atendimentos');
});
test('resumo de estoque usa dados da API e mantém números alinhados em celular',async({page})=>{
 await preparar(page);await page.setViewportSize({width:360,height:800});
 await page.route('**/api/materiais',r=>r.fulfill({json:[{id:1,nome:'Pinça',quantidade:10,estoque_minimo:2},{id:2,nome:'Sonda',quantidade:0,estoque_minimo:2}]}));
 await page.goto('/app/aluno/estoque');
 const total=page.getByText('Total de itens',{exact:true}).locator('..');
 await expect(total).toContainText('2');
 const tops=await page.locator('span.font-black').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().top));
 expect(tops).toHaveLength(4);expect(Math.max(...tops)-Math.min(...tops)).toBeLessThan(1);
});
test('aluno abre cirurgia atribuída, acrescenta observação e não remove saúde já registrada',async({page})=>{
 await preparar(page);await page.clock.install({time:new Date('2026-09-10T12:00:00-03:00')});
 const cirurgia={id:7,paciente_id:42,usuario_id:1,data_hora:'2026-09-10T09:30:00',tipo_cirurgia:'Extração',status:'agendada'};
 await page.route('**/api/cirurgias',r=>r.fulfill({json:[cirurgia]}));
 await page.route('**/api/cirurgias/7',r=>r.fulfill({json:cirurgia}));
 const notas=[];
 await page.route('**/api/rastreabilidade/cirurgia/7/observacoes',r=>{
  if(r.request().method()==='POST')notas.push({id:1,...r.request().postDataJSON(),responsavel:'Ana Teste',criado_em:'2026-09-10T12:00:00'});
  return r.fulfill({json:r.request().method()==='GET'?notas:notas[0]});
 });
 await page.goto('/app/aluno/cirurgias');await page.getByText('Maria Teste',{exact:true}).click();
 await expect(page.getByRole('region',{name:'Alergias e medicamentos'})).toContainText('Losartana');
 await page.getByRole('button',{name:'Editar alergias e medicamentos'}).click();
 await expect(page.getByLabel('Alergias 1',{exact:true})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Remover Alergias 1'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Remover Medicamentos em uso 1'})).toHaveCount(0);
 await page.getByRole('button',{name:'Adicionar alergia',exact:true}).click();
 await expect(page.getByLabel('Alergias 2',{exact:true})).toBeEnabled();
 await page.getByLabel('Nova observação do atendimento').fill('Procedimento concluído sem intercorrências.');
 await page.getByRole('button',{name:'Salvar observação'}).click();
 await expect(page.getByText('Procedimento concluído sem intercorrências.',{exact:true})).toBeVisible();
 await page.reload();await expect(page.getByText('Procedimento concluído sem intercorrências.',{exact:true})).toBeVisible();
});
test('QR legível identifica pacote exato com conteúdo e responsável do banco',async({page})=>{
 await preparar(page);
 const qr=readFileSync(new URL('./fixtures/pacote-qr.txt',import.meta.url),'utf8');
 const pacote={id:125,codigo:'CME000125',status:'esterilizado',nome_pacote:'Kit de exame',responsavel_esterilizacao:'Operadora do ciclo',esterilizado_em:'2026-09-10T09:00:00',validade:'2026-10-10',itens:[{material_id:8,nome:'Pinça',quantidade:2}],historico:[],qr_code:qr};
 await page.route('**/api/rastreabilidade/pacotes',r=>r.fulfill({json:[pacote]}));
 await page.route('**/api/rastreabilidade/pacotes/125',r=>r.fulfill({json:pacote}));
 await page.route('**/api/rastreabilidade/pacotes/125/etiqueta',r=>r.fulfill({json:pacote}));
 await page.goto('/app/aluno/estoque/configurar-etiqueta?pacote=125');
 await expect(page.getByLabel('Responsável pela esterilização')).toHaveValue('Operadora do ciclo');
 await expect(page.getByText('2 × Pinça')).toBeVisible();
 const tamanho=await page.locator('main .etiqueta-pacote').boundingBox();
 expect(tamanho.width).toBeCloseTo(70*96/25.4,0);expect(tamanho.height).toBeCloseTo(50*96/25.4,0);
 const decoded=await page.evaluate(async()=>{
  const img=document.querySelector('.etiqueta-pacote-qr');
  const blob=await (await fetch(img.src)).blob();
  const mod=await import('/node_modules/.vite/deps/html5-qrcode.js');
  const div=document.createElement('div');div.id='test-qr-decode';document.body.appendChild(div);
  const reader=new mod.Html5Qrcode(div.id);
  try{return await reader.scanFile(new File([blob],'qr.png',{type:'image/png'}),false);}finally{reader.clear();div.remove();}
 });
 expect(decoded).toBe('CME000125');
 await page.goto('/app/aluno/estoque/scanner');
 await page.getByRole('button',{name:'Digitar Código',exact:true}).click();
 await page.getByPlaceholder('Ex: 7891234567890').fill(decoded);
 await page.getByRole('button',{name:'Buscar',exact:true}).click();
 await expect(page).toHaveURL(/cme\/pacotes\?pacote=125/);
 await expect(page.getByText('2 × Pinça')).toBeVisible();
});
test('professor prepara pacote multi-instrumentos com responsável autenticado',async({page})=>{
 await preparar(page,'professor');let payload;
 const pacote={id:126,codigo:'CME000126',nome_pacote:'Exame',status:'aguardando',responsavel_preparo:'Ana Teste',itens:[{material_id:1,nome:'Pinça',quantidade:2},{material_id:2,nome:'Sonda',quantidade:1}],historico:[]};
 await page.route('**/api/materiais',r=>r.fulfill({json:[{id:1,nome:'Pinça',tipo_material:'instrumental',passa_cme:true},{id:2,nome:'Sonda',tipo_material:'instrumental',passa_cme:true},{id:3,nome:'Luva',tipo_material:'consumivel',passa_cme:false}]}));
 await page.route('**/api/rastreabilidade/pacotes',r=>{if(r.request().method()==='POST'){payload=r.request().postDataJSON();return r.fulfill({json:pacote});}return r.fulfill({json:[]});});
 await page.route('**/api/rastreabilidade/pacotes/126',r=>r.fulfill({json:pacote}));
 await page.goto('/app/professor/cme/pacotes');
 await page.getByRole('button',{name:'+ Novo pacote'}).click();
 await page.getByLabel('Nome / tipo do pacote').fill('Exame');
 await expect(page.getByLabel('Luva')).toHaveCount(0);
 await page.getByLabel('Pinça',{exact:true}).check();await page.getByLabel('Sonda',{exact:true}).check();
 await page.getByLabel('Quantidade de Pinça').fill('2');
 await page.getByRole('button',{name:'Criar pacote',exact:true}).click();
 await expect(page).toHaveURL(/pacote=126/);
 await expect(page.getByText('Preparado por: Ana Teste')).toBeVisible();
 expect(payload).toEqual({nome:'Exame',itens:[{material_id:1,quantidade:2},{material_id:2,quantidade:1}]});
 await expect(page.getByRole('button',{name:'Configurar etiqueta'})).toHaveCount(0);
});
