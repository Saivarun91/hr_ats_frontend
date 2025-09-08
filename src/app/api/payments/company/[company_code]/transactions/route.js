export async function GET(request, { params }) {
  try {
    const { company_code } = params;

    // This would typically call your Django backend
    // For now, returning mock data
    const transactions = [
      {
        id: '1',
        company: 'Test Company',
        transaction_type: 'purchase',
        credits: 500,
        description: 'Purchased 500 credits via Enterprise Pack plan',
        payment_reference: 'pay_test123',
        hr_user: null,
        resume_id: null,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        company: 'Test Company',
        transaction_type: 'usage',
        credits: -1,
        description: 'Viewed global resume: resume123',
        payment_reference: null,
        hr_user: 'hr@company.com',
        resume_id: 'resume123',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        company: 'Test Company',
        transaction_type: 'usage',
        credits: -1,
        description: 'Viewed global resume: resume456',
        payment_reference: null,
        hr_user: 'hr@company.com',
        resume_id: 'resume456',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return Response.json(transactions);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
}
