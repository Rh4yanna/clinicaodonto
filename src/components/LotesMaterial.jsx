import { useState,useEffect,useCallback } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../Services/api';
export default function LotesMaterial({materialId}) {
 const navigate=useNavigate(),location=useLocation();const area=location.pathname.split('/')[2];
 const [lotes,setLotes]=useState([]),[erro,setErro]=useState('');
 const carregar=useCallback(()=>{if(materialId)api.get(`/rastreabilidade/materiais/${materialId}/lotes`).then(r=>setLotes(r.data)).catch(()=>setErro('Não foi possível carregar os lotes.'));},[materialId]);
 useEffect(carregar,[carregar]);
 return <section className="bg-white border p-4 rounded-xl space-y-3"><h3 className="font-bold">Lotes</h3>{erro&&<p role="alert" className="text-red-600">{erro}</p>}<div className="flex gap-3 text-sm"><button onClick={()=>navigate(`/app/${area}/estoque/entrada`,{state:{material:{id:materialId}}})} className="text-[#3B44A8] underline">+ Entrada</button><button onClick={()=>navigate(`/app/${area}/estoque/entrada`,{state:{material:{id:materialId},tipo:'saida'}})} className="text-[#3B44A8] underline">− Registrar saída</button></div>{lotes.map(l=><div key={l.id} className="border-t pt-2 text-sm"><strong>{l.lote}</strong><p>Validade: {l.validade?l.validade.slice(0,10).split('-').reverse().join('/'):'Não informada'}</p><p>{l.quantidade} unidades</p></div>)}{!erro&&!lotes.length&&<p className="text-sm text-gray-500">Nenhuma entrada registrada.</p>}</section>;
}
LotesMaterial.propTypes={materialId:PropTypes.oneOfType([PropTypes.string,PropTypes.number])};
