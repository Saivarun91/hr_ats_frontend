export async function GET() {
  try {
    // This would typically call your Django backend
    // For now, returning mock data
    const plans = [
      {
        id: '1',
        name: 'Starter Pack',
        price: 999.0,
        credits: 50,
        description: 'Perfect for small companies starting with resume analysis',
        is_active: true,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Professional Pack',
        price: 1999.0,
        credits: 150,
        description: 'Ideal for growing companies with regular hiring needs',
        is_active: true,
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Enterprise Pack',
        price: 4999.0,
        credits: 500,
        description: 'Best value for large companies with high-volume hiring',
        is_active: true,
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Premium Pack',
        price: 9999.0,
        credits: 1200,
        description: 'Ultimate package for enterprise-level hiring operations',
        is_active: true,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return Response.json(plans);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch payment plans' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, credits, description, is_active } = body;

    // Validate required fields
    if (!name || !price || !credits) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // This would typically call your Django backend to create the plan
    // For now, returning mock data
    const newPlan = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      credits: parseInt(credits),
      description: description || '',
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return Response.json(newPlan, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create payment plan' },
      { status: 500 }
    );
  }
}
