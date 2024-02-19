
import { Link } from 'react-router-dom';

const FrequentlyAskedQuestions = () => {
  // Aquí colocarías la lógica para obtener y mostrar las preguntas frecuentes
  return (
    <div style={{ cursor: 'pointer' }}>
      {/* Contenido de preguntas frecuentes */}
      <Link to="/preguntas-frecuentes" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
        <h3>Preguntas</h3>
      </Link>
      
      {/* Aquí irían las preguntas frecuentes */}
    </div>
  );
}

export default FrequentlyAskedQuestions;
