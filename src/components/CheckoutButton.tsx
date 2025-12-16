// src/components/CheckoutButton.tsx
import { useState } from 'react';

interface CheckoutButtonProps {
  planId: string;
  planName: string;
  price: number;
}

export default function CheckoutButton({ planId, planName, price }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Llamar a nuestro endpoint API
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planName,
          price,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirigir a Mercado Pago
        window.location.href = data.url;
      } else {
        alert('Error al crear el pago. Por favor intenta de nuevo.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn btn-primary"
      style={{ 
        width: '100%',
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading ? 'Procesando...' : 'Comprar Ahora'}
    </button>
  );
}