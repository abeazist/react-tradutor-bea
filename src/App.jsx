import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const languages = [
    { code: "en-us", name: "Inglês" },
    { code: "es", name: "Espanhol" },
    { code: "fr", name: "Francês" },
    { code: "de", name: "Alemão" },
    { code: "it", name: "Italiano" },
    { code: "pt-br", name: "Português" },
  ];

  const [origem, setOrigem] = useState("pt-br"); //opçoes de idioma select
  const [destino, setDestino] = useState("en-us");

  const [textoOrigem, setTextoOrigem] = useState("");
  const [textoDestino, setTextoDestino] = useState("");

  const delayArtificial = useDebouncedCallback((term) => {
    if (term) {
      fetch(
        `https://api.mymemory.translated.net/get?q=${textoOrigem}&langpair=${origem}|${destino}`
      )
        .then((resposta) => resposta.json())
        .then((dados) => setTextoDestino(dados.responseData.translatedText))
        .catch((error) => {
          setError("Erro ao traduzir dados:", error);
        })
    } else {
      setTextoDestino("");
    }
  }, 300);

  useEffect(() => {
    delayArtificial(textoOrigem);
  }, [origem, destino, textoOrigem]); //monitorando as variaveis, se elas mudarem ele faz a funcao

  const trocaIdioma = () => {
    const origemAtual = origem;
    const destinoAtual = destino;

    setOrigem(destinoAtual);
    setDestino(origemAtual);
  };
  let isLoading = false;
  let error = "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-bold">Tradutor</h1>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              value={origem}
              onChange={(event) => setOrigem(event.target.value)}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
            <button
              onClick={trocaIdioma}
              className="p-2 rounded-full hover:bg-gray-100 outline-none"
            >
              <svg
                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select
              value={destino}
              onChange={(evento) => setDestino(evento.target.value)} //evento de mudar algo, no caso mudar o select
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                value={textoOrigem} //value é o valor que está no textarea
                onChange={(evento) => setTextoOrigem(evento.target.value)} //evento de mudar algo, no caso mudar o textarea
                className="w-full h-40 text-lg text-textColor bg-transparent resize-none border-none outline-none"
                placeholder="Digite seu texto..."
              ></textarea>
            </div>

            <div className="relative p-4 bg-secondaryBackground border-l border-gray-200">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-blue-500 border-t-2"></div>
                </div>
              ) : (
                <p className="text-lg text-textColor">{textoDestino}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-t border-red-400 text-red-700">
              {error}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-headerColor">
          &copy; {new Date().getFullYear()} Tradutor
        </div>
      </footer>
    </div>
  );
}
export default App;
