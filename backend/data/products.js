const products = [
    {
      name: 'Funko Personalizado 3D',
      image: 'https://images.unsplash.com/photo-1608248593842-b062b1ab71eb?q=80&w=600&auto=format&fit=crop',
      description: 'Funko Pop diseñado y pintado a mano basado en tu foto. Material PLA de alta calidad.',
      price: 1500,
      model3D: 'placeholder', // Frontend translates 'placeholder' to a generic 3D box for now
      category: 'Funkos',
      countInStock: 15,
      requiresTextPersonalization: false,
      requiresImagePersonalization: true,
    },
    {
      name: 'Llavero Tipográfico',
      image: 'https://images.unsplash.com/photo-1588609514745-9ee2c2622ba7?q=80&w=600&auto=format&fit=crop',
      description: 'Llavero con tu nombre en relieve 3D, material ultra resistente PETG.',
      price: 250,
      model3D: '',
      category: 'Llaveros',
      countInStock: 50,
      requiresTextPersonalization: true,
      requiresImagePersonalization: false,
    },
    {
      name: 'Busto Escultura',
      image: 'https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=600&auto=format&fit=crop',
      description: 'Escultura decorativa estilo clásico moderno, impresa en resina de ultra alta resolución.',
      price: 800,
      model3D: 'placeholder',
      category: 'Decoración',
      countInStock: 5,
      requiresTextPersonalization: false,
      requiresImagePersonalization: false,
    }
];

export default products;
