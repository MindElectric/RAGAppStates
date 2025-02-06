
export default function HomePage() {
    return (
        <div className="flex-col mt-5 mx-10">
            <h2 className="text-center text-2xl">¡Bienvenido al Chat de los Estados de Mexico!</h2>
            <div className="text-lg">
                <p className="mt-2">Puede empezar con darle click a uno de los estados en la mapa o empieza a escribir al chatbot para
                    que informe sobre un estado o a México en general.
                </p>
                <p className="mt-2">
                    Esto es una aplicacion RAG &#40;Retrieval-Augemented Generation&#41;, lo cual significa que todo el texto generado
                    proviene de información seleccionada por el dessarrollador.
                </p>
            </div>
        </div>
    );
}