import PaymentPlans from '../../../../components/PaymentPlans';
import Protected from '../../../../components/Protected';

export default function PaymentPlansPage() {
  return (
    <Protected allowedRoles={['company-admin']}>
      <PaymentPlans />
    </Protected>
  );
}
