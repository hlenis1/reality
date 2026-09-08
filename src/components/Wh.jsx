import { FloatingWhatsApp } from 'react-floating-whatsapp';
import whatsappIcon from '../assets/whatsApp.png'; // opcional, puedes usar el icono por defecto

function App() {
  return (
    <div>
      {/* tu contenido */}
      <FloatingWhatsApp 
        phoneNumber="533334830506"   // tu número en formato internacional
        accountName="Soporte Sport" // nombre que se muestra
        avatar={whatsappIcon}         // icono personalizado (opcional)
        statusMessage="Responde normalmente en minutos"
        chatMessage="¡Hola! 👋 ¿En qué puedo ayudarte?"
      />
    </div>
  );
}

export default App;