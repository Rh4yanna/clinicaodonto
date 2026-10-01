import { useAreaClinica } from '../../hooks/useAreaClinica';
import PreVisualizacao from '../../components/PreVisualizacaoEtiqueta';
export default function PreVisualizacaoEtiquetaCoordenador() {
  const { area } = useAreaClinica();
  return <PreVisualizacao area={area} />;
}
