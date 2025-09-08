import PaymentPlanManager from '../../../../components/PaymentPlanManager';
import Protected from '../../../../components/Protected';

export default function PaymentPlansManagementPage() {
  return (
    <Protected allowedRoles={['super-admin']}>
      <PaymentPlanManager />
    </Protected>
  );
}
