import { Link } from 'react-router-dom';
import Rating from './Rating';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300">
      <Link to={`/product/${product._id}`} className="block h-64 overflow-hidden bg-darker relative">
        <img 
          src={(product.image && product.image !== '/images/sample.jpg') ? product.image : 'https://via.placeholder.com/400x300?text=ZAMIS+Product'} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.model3D && (
          <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            3D Interactivo
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-col mb-2">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-xl font-bold line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <div className="mt-2">
            <Rating value={product.rating} text={`${product.numReviews} reseñas`} />
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            ${product.price}
          </span>
          <Link 
            to={`/product/${product._id}`} 
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            Configurar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
