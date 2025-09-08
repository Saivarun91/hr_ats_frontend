export async function POST(request) {
  try {
    const body = await request.json();
    const { plan_id, company_admin_email } = body;

    // Validate required fields
    if (!plan_id || !company_admin_email) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // This would typically call your Django backend to create the order
    // For now, returning mock data
    const orderData = {
      order_id: `order_${Date.now()}`,
      amount: 999.0, // This would come from the selected plan
      currency: 'INR',
      payment_id: `pay_${Date.now()}`
    };

    return Response.json(orderData);
  } catch (error) {
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
