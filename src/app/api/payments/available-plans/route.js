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
        description: 'Perfect for small companies starting with resume analysis'
      },
      {
        id: '2',
        name: 'Professional Pack',
        price: 1999.0,
        credits: 150,
        description: 'Ideal for growing companies with regular hiring needs'
      },
      {
        id: '3',
        name: 'Enterprise Pack',
        price: 4999.0,
        credits: 500,
        description: 'Best value for large companies with high-volume hiring'
      },
      {
        id: '4',
        name: 'Premium Pack',
        price: 9999.0,
        credits: 1200,
        description: 'Ultimate package for enterprise-level hiring operations'
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
