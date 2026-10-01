import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export function useAreaClinica() {
  const { usuario } = useAuth();
  const area = usuario?.perfil === 'professor' ? 'professor' : 'coordenador';
  return { area, titulo: area === 'professor' ? 'Professor' : 'Coordenador' };
}

// As telas clínicas são compartilhadas, mas a navegação permanece na área do usuário.
export function useNavigateClinico() {
  const navigate = useNavigate();
  const { area } = useAreaClinica();
  return useCallback((destino, options) => {
    const rota = typeof destino === 'string'
      ? destino.replace(/^\/app\/coordenador(?=\/|$)/, `/app/${area}`)
      : destino;
    return navigate(rota, options);
  }, [navigate, area]);
}
