import PropTypes from 'prop-types';

export default function FormularioSaude({ valor, onChange, somenteAdicionar = false }) {
  const alterar = (campos) => onChange({ ...valor, ...campos });
  return <div className="space-y-4">
    {[['alergias', 'Alergias', 'substancia'], ['medicamentos', 'Medicamentos em uso', 'nome_medicamento']].map(([chave, titulo, campo]) => <fieldset key={chave} className="space-y-2">
      <label className="block text-sm font-bold" htmlFor={`saude-${chave}`}>{titulo} *</label>
      <select id={`saude-${chave}`} required value={valor[`${chave}_status`] || ''} onChange={e => alterar({ [`${chave}_status`]: e.target.value, [chave]: e.target.value === 'nenhum' ? [] : valor[chave] })} className="w-full p-3 border rounded-xl text-sm">
        <option value="">Selecione uma resposta</option>
        <option value="informado">{chave === 'alergias' ? 'Possui alergias' : 'Utiliza medicamentos'}</option>
        <option value="nenhum" disabled={somenteAdicionar && valor[chave]?.some(item => item.id)}>{chave === 'alergias' ? 'Não possui alergias conhecidas' : 'Não utiliza medicamentos'}</option>
      </select>
      {valor[`${chave}_status`] === 'informado' && <>
        {(valor[chave] || []).map((item, i) => <div key={i} className="flex gap-2 items-center">
          <input aria-label={`${titulo} ${i + 1}`} required disabled={somenteAdicionar && Boolean(item.id)} value={item[campo]} placeholder={titulo} className="w-full min-w-0 border rounded-lg p-2 text-sm" onChange={e => alterar({ [chave]: valor[chave].map((v, idx) => idx === i ? { ...v, [campo]: e.target.value } : v) })} />
          {chave === 'medicamentos' ? <input aria-label={`Dosagem ${i + 1}`} disabled={somenteAdicionar && Boolean(item.id)} value={item.dosagem || ''} placeholder="Dosagem (opcional)" className="w-full min-w-0 border rounded-lg p-2 text-sm" onChange={e => alterar({ [chave]: valor[chave].map((v, idx) => idx === i ? { ...v, dosagem: e.target.value } : v) })} /> : <select aria-label={`Gravidade ${i + 1}`} disabled={somenteAdicionar && Boolean(item.id)} value={item.gravidade || ''} className="border rounded-lg p-2 text-sm" onChange={e => alterar({ [chave]: valor[chave].map((v, idx) => idx === i ? { ...v, gravidade: e.target.value } : v) })}><option value="">Gravidade</option>{['leve', 'moderada', 'grave'].map(g => <option key={g}>{g}</option>)}</select>}
          <button hidden={somenteAdicionar && Boolean(item.id)} type="button" aria-label={`Remover ${titulo} ${i + 1}`} onClick={() => alterar({ [chave]: valor[chave].filter((_, idx) => idx !== i) })} className="text-red-600 text-xs">Remover</button>
        </div>)}
        <button type="button" onClick={() => alterar({ [chave]: [...(valor[chave] || []), { [campo]: '' }] })} className="text-[#3B44A8] text-sm underline">Adicionar {chave === 'alergias' ? 'alergia' : 'medicamento'}</button>
        {!valor[chave]?.length && <p className="text-xs text-amber-700">Adicione pelo menos um registro.</p>}
      </>}
    </fieldset>)}
  </div>;
}
FormularioSaude.propTypes = { valor: PropTypes.object.isRequired, onChange: PropTypes.func.isRequired, somenteAdicionar: PropTypes.bool };
