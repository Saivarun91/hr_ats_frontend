export async function GET(request, { params }) {
  try {
    const { resume_id, hr_email } = params;

    // This would typically call your Django backend
    // For now, returning mock data
    const accessInfo = {
      can_view: true,
      reason: 'Sufficient credits available',
      credits_required: 1,
      remaining_credits: 350,
      total_credits: 500,
      used_credits: 150
    };

    return Response.json(accessInfo);
  } catch (error) {
    return Response.json(
      { error: 'Failed to check credits' },
      { status: 500 }
    );
  }
}
