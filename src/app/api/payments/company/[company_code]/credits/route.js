export async function GET(request, { params }) {
  try {
    const { company_code } = await params;

    // This would typically call your Django backend
    // For now, returning mock data
    const credits = {
      id: '1',
      company: 'Test Company',
      total_credits: 500,
      used_credits: 150,
      remaining_credits: 350,
      updated_at: new Date().toISOString()
    };

    return Response.json(credits);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch company credits' },
      { status: 500 }
    );
  }
}
