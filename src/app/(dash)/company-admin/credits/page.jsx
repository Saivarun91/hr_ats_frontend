import CompanyCredits from '../../../../components/CompanyCredits';
import Protected from '../../../../components/Protected';

export default function CompanyCreditsPage() {
  return (
    <Protected allowedRoles={['company-admin']}>
      <CompanyCredits />
    </Protected>
  );
}
