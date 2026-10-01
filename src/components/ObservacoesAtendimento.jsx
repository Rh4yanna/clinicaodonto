import {useState,useEffect,useCallback} from 'react';
import PropTypes from 'prop-types';
import api from '../Services/api';
export default function ObservacoesAtendimento({tipo,id,observacaoInicial}){
 const [itens,setItens]=useState([]),[descricao,setDescricao]=useState(''),[erro,setErro]=useState(''),[salvando,setSalvando]=useState(false);
 const carregar=useCallback(async()=>{if(!id)return;try{const r=await api.get(`/rastreabilidade/${tipo}/${id}/observacoes`);setItens(r.data);setErro('');}catch{setErro('Não foi possível carregar as observações.');}},[tipo,id]);
 useEffect(()=>{carregar();},[carregar]);
 const salvar=async e=>{e.preventDefault();if(salvando||!descricao.trim())return;setSalvando(true);try{await api.post(`/rastreabilidade/${tipo}/${id}/observacoes`,{descricao});setDescricao('');await carregar();}catch(e){setErro(e.response?.data?.message||'Não foi possível registrar a observação.');}finally{setSalvando(false);}};
 return <section className="bg-white border rounded-xl p-4 space-y-3 text-gray-900"><h3 className="font-bold text-sm">Observações do atendimento</h3>{observacaoInicial&&<p className="text-sm whitespace-pre-wrap">{observacaoInicial}</p>}{erro&&<p role="alert" className="text-red-600 text-sm">{erro}</p>}{itens.map(i=><div key={i.id} className="text-sm border-t pt-2"><p className="whitespace-pre-wrap">{i.descricao}</p><small>{i.responsavel} · {new Date(i.criado_em).toLocaleString('pt-BR')}</small></div>)}<form onSubmit={salvar} className="space-y-2"><textarea required aria-label="Nova observação do atendimento" value={descricao} onChange={e=>setDescricao(e.target.value)} className="border rounded-lg p-3 w-full text-sm"/><button disabled={salvando||!id} className="bg-[#3B44A8] text-white p-3 rounded-xl text-sm">Salvar observação</button></form></section>;
}
ObservacoesAtendimento.propTypes={tipo:PropTypes.oneOf(['consulta','cirurgia']).isRequired,id:PropTypes.oneOfType([PropTypes.string,PropTypes.number]),observacaoInicial:PropTypes.string};
