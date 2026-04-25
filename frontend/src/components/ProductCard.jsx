import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full hover:border-primary/50 transition-colors duration-300">
      <Link to={`/product/${product._id}`} className="block h-64 overflow-hidden bg-darker relative">
        <img 
          src={(product.image && product.image !== '/images/sample.jpg') ? product.image : 'https://via.placeholder.com/400x300?text=ZAMIS+Product'} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.model3D && (
          <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md text-white">
            Vista 3D
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold line-clamp-1">{product.name}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            ${product.price}
          </span>
          <Link to={`/product/${product._id}`} className="btn-primary py-2 px-4 text-sm">
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
