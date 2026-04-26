import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Box } from 'lucide-react';
import Rating from './Rating';
import { Badge } from './ui';
import PriceDisplay from './ecommerce/PriceDisplay';
import { staggerItem, hoverLift, tapScale } from '../design-system/tokens';

const ProductCard = ({ product }) => {
  const isNew = product.createdAt
    ? (Date.now() - new Date(product.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14
    : false;
  const isOutOfStock = product.countInStock === 0;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={!isOutOfStock ? hoverLift : {}}
      whileTap={!isOutOfStock ? tapScale : {}}
      className="card-product group flex flex-col h-full"
    >
      {/* Image */}
      <Link
        to={`/product/${product._id}`}
        className="block relative h-56 overflow-hidden bg-surface-base"
        tabIndex={isOutOfStock ? -1 : 0}
      >
        <img
          src={
            product.image && product.image !== '/images/sample.jpg'
              ? product.image
              : 'https://via.placeholder.com/400x300?text=ZAMIS+Print'
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible';
          }}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && <Badge variant="new">Nuevo</Badge>}
          {isOutOfStock && <Badge variant="soldout">Agotado</Badge>}
        </div>

        {product.model3D && (
          <div className="absolute top-3 right-3">
            <span className="badge badge-info gap-1">
              <Box className="w-3 h-3" />
              3D
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            {product.category}
          </span>
        )}

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-neutral-900 leading-snug line-clamp-2 hover:text-brand-300 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <Rating value={product.rating} text={`${product.numReviews} reseñas`} />

        {/* Description */}
        <p className="text-neutral-500 text-sm line-clamp-2 flex-grow">{product.description}</p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
          <PriceDisplay price={product.price} size="sm" />
          <Link
            to={`/product/${product._id}`}
            className={`btn btn-primary btn-sm flex items-center gap-1.5 ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Agotado' : 'Ver'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
