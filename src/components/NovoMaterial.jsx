import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../Services/api';

export default function NovoMaterial() {
 const navigate=useNavigate(), location=useLocation();
 const area=location.pathname.split('/')[2];
 const [dados,setDados]=useState({nome:'',codigo_barras:'',categoria_id:'',unidade_medida:'unidade',estoque_minimo:0,estoque_ideal:0,tipo_material:'consumivel',passa_cme:false,descricao:'',fabricante:'',registro_anvisa:''});
 const [categorias,setCategorias]=useState([]),[erro,setErro]=useState(''),[salvando,setSalvando]=useState(false),[salvo,setSalvo]=useState(null),[camera,setCamera]=useState(false);
 const alterar=(campo,valor)=>setDados(d=>({...d,[campo]:valor}));
 useEffect(()=>{api.get('/categorias').then(r=>setCategorias(r.data)).catch(()=>setErro('Não foi possível carregar as categorias.'));},[]);
 useEffect(()=>{
  if(!camera)return;
  const leitor=new Html5Qrcode('codigo-produto-camera'); let ativo=true;
  const iniciar=async()=>{try{await leitor.start({facingMode:'environment'},{fps:10,qrbox:{width:220,height:100}},texto=>{if(ativo){alterar('codigo_barras',texto);setCamera(false);}});if(!ativo && leitor.isScanning)await leitor.stop();}catch{if(ativo)setErro('Não foi possível acessar a câmera. Digite o código da embalagem.');}};
  iniciar();return()=>{ativo=false;if(leitor.isScanning)leitor.stop().catch(()=>{});};
 },[camera]);
 const salvar=async e=>{e.preventDefault();if(salvando)return;setSalvando(true);setErro('');try{const r=await api.post('/materiais',{...dados,categoria_id:Number(dados.categoria_id),estoque_minimo:Number(dados.estoque_minimo),estoque_ideal:Number(dados.estoque_ideal)});setSalvo(r.data);}catch(e){setErro(e.response?.data?.message||'Não foi possível salvar o material.');}finally{setSalvando(false);}};
 const imagem=e=>{const f=e.target.files?.[0];if(!f)return;if(!['image/jpeg','image/png'].includes(f.type)||f.size>4*1024*1024){setErro('Use JPG ou PNG de até 4 MB.');return;}const r=new FileReader();r.onload=()=>alterar('imagem_base64',r.result);r.readAsDataURL(f);};
 if(salvo)return <div className="flex-1 min-h-0 overflow-y-auto bg-white p-5 space-y-5"><h1 className="font-bold text-xl">Material cadastrado!</h1><p>{salvo.nome}</p><p>Código: {salvo.codigo_barras}</p><p>Deseja registrar a quantidade recebida?</p><button className="bg-[#3B44A8] text-white p-3 rounded-xl" onClick={()=>navigate(`/app/${area}/estoque/entrada`,{state:{material:salvo}})}>Adicionar ao estoque</button><button className="block" onClick={()=>navigate(`/app/${area}/estoque`)}>Fazer depois</button></div>;
 return <div className="flex-1 min-h-0 overflow-y-auto bg-white p-5 space-y-5 overflow-y-auto"><button onClick={()=>navigate(-1)}>← Voltar</button><h1 className="text-xl font-bold text-[#3B44A8]">Novo material</h1>{erro&&<p role="alert" className="text-red-600">{erro}</p>}
 <form onSubmit={salvar} className="space-y-4">
 <h2 className="font-bold">Informações básicas</h2>
 <label className="block text-sm">Nome do produto *<input required value={dados.nome} onChange={e=>alterar('nome',e.target.value)} className="block border rounded-xl w-full p-3"/></label>
 <label className="block text-sm">Código de barras<input value={dados.codigo_barras} onChange={e=>alterar('codigo_barras',e.target.value)} className="block border rounded-xl w-full p-3"/></label><p className="text-xs text-gray-500">Escaneie o código da embalagem. Se não possuir, o sistema gera um.</p><button type="button" onClick={()=>setCamera(!camera)} className="text-sm text-[#3B44A8] underline">{camera?'Fechar câmera':'Escanear embalagem'}</button>{camera&&<div id="codigo-produto-camera"/>}
 <label className="block text-sm">Categoria *<select required value={dados.categoria_id} onChange={e=>alterar('categoria_id',e.target.value)} className="block border rounded-xl w-full p-3"><option value="">Selecione</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>
 <label className="block text-sm">Unidade de medida *<select value={dados.unidade_medida} onChange={e=>alterar('unidade_medida',e.target.value)} className="block border rounded-xl w-full p-3">{['unidade','caixa','pacote','frasco','kit','ml','g'].map(v=><option key={v}>{v}</option>)}</select></label>
 <h2 className="font-bold">Controle</h2>{[['estoque_minimo','Estoque mínimo'],['estoque_ideal','Estoque ideal']].map(([c,t])=><label key={c} className="block text-sm">{t} *<input type="number" min="0" step="1" required value={dados[c]} onChange={e=>alterar(c,e.target.value)} className="block border rounded-xl w-full p-3"/></label>)}
 <label className="block text-sm">Tipo de material<select value={dados.tipo_material} onChange={e=>setDados({...dados,tipo_material:e.target.value,passa_cme:false})} className="block border rounded-xl w-full p-3"><option value="consumivel">Consumível</option><option value="instrumental">Instrumental reutilizável</option></select></label>
 {dados.tipo_material==='instrumental'&&<label className="flex gap-2 text-sm"><input type="checkbox" checked={dados.passa_cme} onChange={e=>alterar('passa_cme',e.target.checked)}/>Passa pelo CME</label>}
 <h2 className="font-bold">Detalhes</h2>{[['descricao','Descrição'],['fabricante','Fabricante / Marca'],['registro_anvisa','Registro ANVISA']].map(([c,t])=><label key={c} className="block text-sm">{t}<input value={dados[c]} onChange={e=>alterar(c,e.target.value)} className="block border rounded-xl w-full p-3"/></label>)}
 <label className="block text-sm">Imagem<input type="file" accept="image/png,image/jpeg" onChange={imagem} className="block w-full"/></label>{dados.imagem_base64&&<img src={dados.imagem_base64} alt="Imagem do material" className="h-24 object-contain"/>}
 <button disabled={salvando} className="w-full rounded-xl bg-[#F9A814] text-white font-bold p-3">{salvando?'Salvando...':'Salvar material'}</button>
 </form></div>;
}
