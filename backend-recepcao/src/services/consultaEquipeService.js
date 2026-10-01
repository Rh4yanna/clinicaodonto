const pool = require('../config/database');

async function listar(id) {
  const { rows } = await pool.query('SELECT u.id, u.nome FROM consulta_aluno ca JOIN usuario u ON u.id = ca.aluno_id WHERE ca.consulta_id = $1 ORDER BY u.nome', [id]);
  return rows;
}

async function atribuir(id, alunos, ator) {
  if (!['professor', 'coordenador'].includes(ator?.perfil)) throw { status: 403, message: 'Somente o professor ou coordenador pode atribuir alunos.' };
  if (!Array.isArray(alunos) || alunos.length > 30 || alunos.some(a => !Number.isInteger(a) || a <= 0) || new Set(alunos).size !== alunos.length) throw { status: 400, message: 'Informe uma lista válida de alunos.' };
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const consulta = (await client.query('SELECT * FROM consulta WHERE id = $1 FOR UPDATE', [id])).rows[0];
    if (!consulta) throw { status: 404, message: 'Consulta não encontrada' };
    if (String(consulta.usuario_id) !== String(ator.id) && ator.perfil !== 'coordenador') throw { status: 403, message: 'Apenas o responsável pela disciplina pode atribuir alunos a esta consulta.' };
    if (['realizada', 'cancelada', 'faltou'].includes(consulta.status)) throw { status: 409, message: 'Não é possível alterar a equipe de uma consulta encerrada.' };
    const validos = await client.query("SELECT id FROM usuario WHERE id = ANY($1::int[]) AND perfil = 'aluno' AND ativo = true FOR SHARE", [alunos]);
    if (validos.rows.length !== alunos.length) throw { status: 400, message: 'Selecione apenas alunos ativos.' };
    const anteriores = (await client.query('SELECT aluno_id FROM consulta_aluno WHERE consulta_id = $1', [id])).rows.map(a => a.aluno_id);
    await client.query('DELETE FROM consulta_aluno WHERE consulta_id = $1', [id]);
    for (const alunoId of alunos) {
      await client.query('INSERT INTO consulta_aluno (consulta_id, aluno_id) VALUES ($1, $2)', [id, alunoId]);
      if (!anteriores.includes(alunoId)) await client.query("INSERT INTO notificacao (usuario_id, titulo, mensagem, tipo, referencia_id, link) VALUES ($1, $2, $3, 'consulta', $4, $5)", [alunoId, 'Atendimento atribuído', `Você foi vinculado ao atendimento de ${consulta.disciplina || 'consulta'}. Confira a agenda.`, id, `/app/aluno/agenda?consulta=${id}`]);
    }
    await client.query('COMMIT');
    return listar(id);
  } catch (err) { await client.query('ROLLBACK'); throw err; }
  finally { client.release(); }
}
module.exports = { listar, atribuir };
