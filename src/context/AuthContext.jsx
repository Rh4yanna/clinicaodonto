import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { AuthContext } from './auth';
import api from '../Services/api';

// Perfis do backend -> rota inicial de cada área do app.
const ROTA_POR_PERFIL = {
  professor: '/app/professor',
  coordenador: '/app/coordenador',
  aluno: '/app/aluno',
  recepcionista: '/app/recepcao',
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    if (!localStorage.getItem('token')) return null;
    const salvo = localStorage.getItem('usuario');
    try {
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  // Enquanto valida o token salvo com o backend (GET /auth/me). Começa
  // "true" só quando existe algo pra validar — sem token, não há nada
  // a esperar e o app pode renderizar (redirecionando pro login) direto.
  const [carregando, setCarregando] = useState(() => !!localStorage.getItem('token'));
  const [erroSessao, setErroSessao] = useState('');
  const [tentativa, setTentativa] = useState(0);

  // O login antigo confiava cegamente no que estava salvo no
  // localStorage, sem checar se o token ainda é válido no servidor.
  // Aqui revalidamos contra /auth/me assim que o app abre: se o usuário
  // não existe mais ou o token expirou, a sessão local é encerrada.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCarregando(false);
      return;
    }

    let cancelado = false;
    setCarregando(true);
    setErroSessao('');
    api.get('/auth/me')
      .then((resposta) => {
        if (cancelado) return;
        setUsuario(resposta.data);
        localStorage.setItem('usuario', JSON.stringify(resposta.data));
      })
      .catch((error) => {
        if (cancelado) return;
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setUsuario(null);
        } else {
          setErroSessao('Não foi possível validar sua sessão. Verifique a conexão e tente novamente.');
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => { cancelado = true; };
  }, [tentativa]);

  async function login(email, senha) {
    const resposta = await api.post('/auth/login', { email, senha });
    const { token, usuario: usuarioLogado } = resposta.data;

    if (!token || !usuarioLogado || !ROTA_POR_PERFIL[usuarioLogado.perfil]) {
      throw new Error('Resposta de autenticação inválida.');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
    setErroSessao('');

    return usuarioLogado;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setErroSessao('');
  }

  function rotaInicial(perfil) {
    return ROTA_POR_PERFIL[perfil] || '/login';
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, erroSessao, tentarNovamente: () => setTentativa(t => t + 1), login, logout, rotaInicial }}>
      {children}
    </AuthContext.Provider>
  );
}


AuthProvider.propTypes = { children: PropTypes.node };
