import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Box, Star, Zap } from 'lucide-react';
import Rating from './Rating';
import { Badge } from './ui';
import PriceDisplay from './ecommerce/PriceDisplay';
import { staggerItem, hoverLift, tapScale } from '../design-system/tokens';

const ProductCard = ({ product }) => {
  const isNew = product.isNewArrival || (product.createdAt
    ? (Date.now() - new Date(product.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14
    : false);
  const isOutOfStock = product.countInStock === 0;
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const discount = product.isOnSale && product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

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
          loading="lazy"
        />

        {/* Overlay badges — left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              <Star className="w-3 h-3" /> Destacado
            </span>
          )}
          {isNew && <Badge variant="new">Nuevo</Badge>}
          {product.isOnSale && discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              -{discount}% OFF
            </span>
          )}
          {isOutOfStock && <Badge variant="soldout">Agotado</Badge>}
        </div>

        {/* Top-right badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {product.model3D && (
            <span className="badge badge-info gap-1">
              <Box className="w-3 h-3" />3D
            </span>
          )}
          {product.isCustomizable && (
            <span className="flex items-center gap-1 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              <Zap className="w-3 h-3" /> PRO
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        {/* Category + subcategory */}
        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
          {product.category}{product.subcategory ? ` › ${product.subcategory}` : ''}
        </span>

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-neutral-900 leading-snug line-clamp-2 hover:text-brand-300 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Material + Size tags */}
        {(product.material || product.size) && (
          <div className="flex flex-wrap gap-1">
            {product.material && (
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                {product.material}
              </span>
            )}
            {product.size && (
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                {product.size}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        <Rating value={product.rating} text={`${product.numReviews} reseñas`} />

        {/* Description */}
        <p className="text-neutral-500 text-sm line-clamp-2 flex-grow">{product.description}</p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
          <div className="flex flex-col">
            <PriceDisplay price={displayPrice} size="sm" />
            {product.isOnSale && product.salePrice && (
              <span className="text-xs text-neutral-400 line-through">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
              </span>
            )}
          </div>
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

