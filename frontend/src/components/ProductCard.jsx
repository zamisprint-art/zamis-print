import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Box, Star, Zap } from 'lucide-react';
import Rating from './Rating';
import { Badge } from './ui';
import PriceDisplay from './ecommerce/PriceDisplay';
import { staggerItem, hoverLift, tapScale } from '../design-system/tokens';
import { optimizeImage } from '../utils/cloudinary';

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
      className="card-product group flex flex-col h-full w-full"
    >
      {/* Image */}
      <Link
        to={`/product/${product._id}`}
        className="block relative aspect-square overflow-hidden bg-neutral-50 shrink-0"
        tabIndex={isOutOfStock ? -1 : 0}
      >
        <img
          src={
            product.image && product.image !== '/images/sample.jpg'
              ? optimizeImage(product.image, 500)
              : 'https://via.placeholder.com/400x300?text=ZAMIS+Print'
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible';
          }}
          alt={product.name}
          className={`w-full h-full object-contain p-3 object-center transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          loading="lazy"
        />

        {/* Overlay badges — left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="flex items-center justify-center w-6 h-6 bg-amber-400 text-amber-900 rounded-full shadow" title="Destacado">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
            </span>
          )}
          {isNew && (
            <span className="flex items-center justify-center w-6 h-6 bg-brand-500 text-white text-[11px] font-black rounded-full shadow" title="Nuevo">
              N
            </span>
          )}
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
      <div className="p-4 flex flex-col flex-grow relative overflow-hidden bg-white transition-all duration-300 group-hover:pb-16">
        {/* Category + subcategory */}
        <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-1.5 line-clamp-1">
          {product.category}{product.subcategory ? ` › ${product.subcategory}` : ''}
        </span>

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-sm sm:text-base text-neutral-900 leading-snug line-clamp-2 hover:text-brand-500 transition-colors mb-2 min-h-[40px] sm:min-h-[44px]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1 mb-2">
          {product.isOnSale && product.salePrice ? (
            <div className="flex flex-col">
              <span className="text-[11px] text-neutral-400 line-through leading-none mb-1">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
              </span>
              <span className="font-bold text-red-500 text-base sm:text-lg leading-none">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.salePrice)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-neutral-900 text-base sm:text-lg leading-none block">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
            </span>
          )}
        </div>

        {/* Bottom Row: Rating + Always visible Cart Icon */}
        <div className="mt-auto pt-1 flex items-center justify-between">
          <div className="opacity-80">
            <Rating value={product.rating} text={`(${product.numReviews})`} />
          </div>
          <Link
            to={`/product/${product._id}`}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-brand-500 hover:text-white transition-colors ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}
            aria-label="Ver producto"
          >
            <ShoppingCart className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to Cart Hover Button */}
        <div className="absolute left-0 right-0 bottom-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-white via-white to-transparent pt-8">
          <Link
            to={`/product/${product._id}`}
            className={`w-full flex items-center justify-center py-2 rounded-xl bg-neutral-900 text-white font-bold hover:bg-brand-500 hover:shadow-lg transition-colors ${isOutOfStock ? 'opacity-40 pointer-events-none bg-neutral-300' : ''}`}
            aria-label="Ver producto"
          >
            <span className="text-sm">{isOutOfStock ? 'Agotado' : 'Agregar'}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

