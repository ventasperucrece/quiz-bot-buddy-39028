import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    
    if (!topic || typeof topic !== 'string') {
      return new Response(
        JSON.stringify({ error: 'El tema es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY no está configurada');
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generando quiz para el tema: ${topic}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en crear quizzes educativos. Genera exactamente 5 preguntas de opción múltiple sobre el tema proporcionado. 
            Cada pregunta debe tener:
            - Una pregunta clara y concisa
            - 4 opciones de respuesta
            - Solo una respuesta correcta
            - Las preguntas deben ser educativas y apropiadas
            
            Responde ÚNICAMENTE con un objeto JSON válido en este formato exacto:
            {
              "questions": [
                {
                  "question": "texto de la pregunta",
                  "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
                  "correctAnswer": 0
                }
              ]
            }
            
            El campo correctAnswer debe ser el índice (0-3) de la respuesta correcta en el array de opciones.
            NO incluyas texto adicional, solo el JSON.`
          },
          {
            role: 'user',
            content: `Crea 5 preguntas de quiz sobre: ${topic}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de la API de IA:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Límite de solicitudes alcanzado. Por favor, intenta más tarde.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Se requiere pago. Por favor, agrega fondos a tu workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Error al generar el quiz' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Respuesta de la API:', JSON.stringify(data, null, 2));
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No se encontró contenido en la respuesta');
      return new Response(
        JSON.stringify({ error: 'Error al procesar la respuesta de la IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extraer JSON del contenido (por si viene envuelto en markdown)
    let jsonContent = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    const quizData = JSON.parse(jsonContent.trim());
    
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 5) {
      console.error('Formato de quiz inválido:', quizData);
      return new Response(
        JSON.stringify({ error: 'Error al generar el formato correcto del quiz' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Quiz generado exitosamente');
    return new Response(
      JSON.stringify(quizData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en generate-quiz:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});