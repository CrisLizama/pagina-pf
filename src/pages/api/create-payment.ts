import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar Mercado Pago con el Access Token
const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener los datos del plan desde el body
    const { planId, planName, price } = await request.json();

    // Crear la preferencia de pago
    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: planId,
            title: planName,
            description: `Plan de entrenamiento: ${planName}`,
            quantity: 1,
            unit_price: price,
            currency_id: 'CLP',
          },
        ],
        back_urls: {
          success: `${request.url.split('/api')[0]}/success`,
          failure: `${request.url.split('/api')[0]}/failure`,
          pending: `${request.url.split('/api')[0]}/pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'PLAN FITNESS',
      },
    });

    // Retornar la URL de pago
    return new Response(
      JSON.stringify({
        success: true,
        url: result.init_point, // URL de Mercado Pago
        id: result.id,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al crear el pago',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};