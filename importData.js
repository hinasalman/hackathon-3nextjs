import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5aio1d75',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-06-01',
  token: 'skUMfpkn7pFuXj45BQtianzeJkgibfAAvkvnqE1EVzF60SROrZ2mXUg6Up6t0TSCAugvtzgT6t2pLemXnZApLihPRKDxNCg52DsvAjkKjA4Tri3bdFz11xYi53sa864p8pu1XLY7DKcEfAFzwgHjrNduDznzObPZ1rPTBXgCltvPDx9DGG5z',
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop(),
    });

    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error);
    return null;
  }
}

async function uploadProduct(product) {
  try {
    console.log(`Processing product: ${product.title}`);
    const imageId = await uploadImageToSanity(product.imageUrl);

    if (imageId) {
      const document = {
        _type: 'product',
        title: product.title,
        price: product.price,
        productImage: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        tags: product.tags,
        discountPercentage: product.discountPercentage,
        description: product.description,
        isNew: product.isNew,
      };

      const createdProduct = await client.create(document);
      console.log(`✅ Product ${product.title} uploaded successfully:`, createdProduct);
    } else {
      console.log(`❌ Product ${product.title} skipped due to image upload failure.`);
    }
  } catch (error) {
    console.error('Error uploading product:', error);
  }
}

async function importProducts() {
  try {
    const response = await fetch('https://template6-six.vercel.app/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const products = await response.json();
    console.log('Fetched Products:', products); // Debugging

    for (const product of products) {
      await uploadProduct(product);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Start Import
importProducts(); 