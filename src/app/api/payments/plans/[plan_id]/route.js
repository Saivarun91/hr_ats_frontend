export async function GET(request, { params }) {
  try {
    const { plan_id } = params;

    // This would typically call your Django backend
    // For now, returning mock data
    const plan = {
      id: plan_id,
      name: 'Starter Pack',
      price: 999.0,
      credits: 50,
      description: 'Perfect for small companies starting with resume analysis',
      is_active: true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return Response.json(plan);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch payment plan' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { plan_id } = params;
    const body = await request.json();
    const { name, price, credits, description, is_active } = body;

    // Validate required fields
    if (!name || !price || !credits) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // This would typically call your Django backend to update the plan
    // For now, returning mock data
    const updatedPlan = {
      id: plan_id,
      name,
      price: parseFloat(price),
      credits: parseInt(credits),
      description: description || '',
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };

    return Response.json(updatedPlan);
  } catch (error) {
    return Response.json(
      { error: 'Failed to update payment plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { plan_id } = params;

    // This would typically call your Django backend to delete the plan
    // For now, just returning success

    return Response.json(
      { message: 'Payment plan deleted successfully' },
      { status: 204 }
    );
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete payment plan' },
      { status: 500 }
    );
  }
}
