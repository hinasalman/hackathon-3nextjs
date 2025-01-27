"use client"; // Mark this as a client component

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import ProductClient from "@/components/ProductClient"; // Import client-side wrapper

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  isNew?: boolean;
  tags: string[];
  imageUrl: string;
  colors?: string[];
  sizes?: string[];
}

const ProductPage = () => {
  const params = useParams(); // Access route parameters
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const query = `*[_type == "product" && _id == $id][0]{
          _id,
          title,
          description,
          price,
          discountPercentage,
          isNew,
          tags,
          "imageUrl": productImage.asset->url,
          colors,
          sizes
        }`;
        const productData = await client.fetch(query, { id: params.id });
        if (!productData) {
          notFound(); // Render 404 if product is not found
        }
        setProduct(productData);
      } catch (err) {
        setError("Failed to fetch product data.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]); // Re-fetch when `params.id` changes

  if (loading) {
    return <div className="container mx-auto px-6 py-12 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-6 py-12 text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-6 py-12 text-center">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 bg-slate-200">
      <nav className="text-gray-600 mb-6 text-sm">
        <Link href="/" className="hover:underline text-xl text-black">Home</Link> &gt;
        <Link href="/shop" className="hover:underline text-xl text-black">Shop</Link> &gt;
        <span className="text-gray-900 font-semibold text-xl">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex justify-center">
          <img src={product.imageUrl} alt={product.title} className="rounded-lg shadow-lg w-full max-w-md object-cover" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{product.title}</h1>
          <p className="text-lg text-primary font-semibold">${product.price.toFixed(2)}</p>
          {product.discountPercentage && (
            <p className="text-sm text-red-500 font-bold">-{product.discountPercentage}% Off</p>
          )}
          <p className="text-green-700 font-bold italic">{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Colors:</h3>
              <div className="flex gap-3 mt-2">
                {product.colors.map((color, index) => (
                  <div key={index} className="w-8 h-8 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Sizes:</h3>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((size, index) => (
                  <span key={index} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Client-Side Component for Add to Cart */}
          <ProductClient product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;