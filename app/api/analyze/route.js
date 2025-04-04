import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CATEGORIES = [
  "Desarrollo Web Frontend",
  "Desarrollo Web Backend",
  "Desarrollo Móvil iOS",
  "Desarrollo Móvil Android",
  "Desarrollo Aplicaciones Escritorio",
  "Desarrollo Videojuegos",
  "Desarrollo Software Embebido",
  "Desarrollo Inteligencia Artificial",
  "Desarrollo Realidad Virtual/Aumentada",
  "Desarrollo Blockchain",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Oracle",
  "SQL Server",
  "NoSQL",
  "Administración Servidores",
  "Administración Redes",
  "DevOps",
  "Cloud Computing AWS",
  "Cloud Computing Azure",
  "Cloud Computing Google Cloud",
  "Ciberseguridad",
  "Soporte Técnico",
  "Virtualización",
  "Contenedores Docker",
  "Contenedores Kubernetes",
  "Machine Learning",
  "Deep Learning",
  "Procesamiento Lenguaje Natural",
  "Visión Artificial",
  "Ciencia de Datos",
  "Análisis de Datos",
  "Big Data",
  "Business Intelligence",
  "Diseño UX",
  "Diseño UI",
  "Diseño Gráfico",
  "Diseño Web",
  "Diseño Aplicaciones Móviles",
  "SEO",
  "SEM",
  "Marketing de Contenidos",
  "Redes Sociales",
  "Email Marketing",
  "Analítica Web",
  "Gestión de Proyectos Agile",
  "Gestión de Proyectos Scrum",
  "Gestión de Proyectos Kanban",
  "Gestión de Proyectos Tradicional",
  "QA Testing",
  "Consultoría IT",
  "Telecomunicaciones",
  "Robótica",
  "Internet de las Cosas IoT",
  "Realidad Virtual VR",
  "Realidad Aumentada AR",
  "Criptomonedas",
  "Blockchain",
  "Fintech",
  "Salud Digital",
  "Educación en Línea",
  "Comercio Electrónico",
  "Desarrollo de Juegos",
  "Edición de Video",
  "Edición de Audio",
  "Diseño 3D",
  "Animación",
  "Fotografía",
  "Redacción Técnica",
  "Traducción",
  "Gestión de Comunidades",
  "Desarrollo de Hardware",
  "Sistemas Operativos Linux",
  "Sistemas Operativos Windows",
  "Sistemas Operativos macOS",
  "Desarrollo de Plugins",
  "Ciberseguridad Ofensiva",
  "Ciberseguridad Defensiva",
  "Automatización",
  "Desarrollo de APIs",
  "Microservicios",
  "Realidad Extendida (XR)",
  "Computación Cuántica",
  "Bases de Datos Relacionales",
  "Bases de Datos No Relacionales",
  "Desarrollo Low-Code/No-Code",
  "Marketing Digital",
  "Diseño de Producto",
  "Experiencia del Cliente (CX)",
  "Liderazgo Técnico",
  "Gestión de Equipos",
  "Desarrollo de E-learning",
  "Ingeniería de Datos",
  "Desarrollo de Chatbots",
  "Desarrollo Full Stack",
  "Desarrollo Front-End",
  "Desarrollo Back-End"
];

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: 'No se proporcionó texto para analizar' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
    });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 65536,
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `Analiza el siguiente texto y clasifícalo utilizando las categorías proporcionadas. 
    IMPORTANTE: Devuelve SOLO un array JSON con las categorías que mejor se adapten al texto.
    No incluyas explicaciones ni texto adicional, solo el array JSON.
    
    Categorías disponibles: ${CATEGORIES.join(", ")}
    
    Texto a analizar: ${text}`;

    const result = await chatSession.sendMessage(prompt);

    // Limpiar la respuesta para asegurar que sea un JSON válido
    let cleanResponse = result.response.text().trim();
    
    // Limpiar el bloque de código markdown si existe
    cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let categories;
    
    try {
      categories = JSON.parse(cleanResponse);
      // Asegurarse de que las categorías devueltas estén en la lista permitida
      categories = categories.filter(cat => CATEGORIES.includes(cat));
    } catch (error) {
      console.error('Error parsing response:', error);
      return Response.json({ error: 'Error al procesar la respuesta de la IA' }, { status: 500 });
    }

    return Response.json({ 
      categories: categories
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: 'Error al analizar el texto',
      details: error.message
    }, { status: 500 });
  }
} 