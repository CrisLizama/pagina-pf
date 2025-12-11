// src/components/CheckoutButton.tsx
interface CheckoutButtonProps {
  planId: string;
  planName: string;
  price: number;
}

export default function CheckoutButton({ planId, planName, price }: CheckoutButtonProps) {
  
  const handleCheckout = async () => {
    console.log('Comprando plan:', planName, 'por $', price);
    
    // Por ahora solo muestra un alert
    // Después conectaremos con Mercado Pago
    alert(`¡Próximamente podrás comprar el ${planName}!`);
  };

  return (
    <button 
      onClick={handleCheckout}
      className="btn btn-primary"
      style={{ width: '100%' }}
    >
      Comprar Ahora
    </button>
  );
}