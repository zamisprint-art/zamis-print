const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-darker via-dark to-darker opacity-90 z-10"></div>
          {/* We'll add a 3D background or image here later */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1631556097152-c3bfdd8a3eb5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Impresión 3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Personalizada</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Da vida a tus ideas con ZAMIS Print. Figuras, llaveros y decoración con un nivel de detalle inigualable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">Explorar Catálogo</button>
            <button className="btn-outline text-lg px-8 py-4">Cotizar Diseño Propio</button>
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Skeleton Cards for now */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="glass-panel rounded-2xl overflow-hidden group">
              <div className="h-64 bg-darker/50 flex items-center justify-center">
                <span className="text-gray-500">Imagen 3D</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Producto de Ejemplo</h3>
                <p className="text-gray-400 mb-4">Descripción breve del producto impreso en 3D.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">$499</span>
                  <button className="btn-primary py-2 px-4">Ver Detalle</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
