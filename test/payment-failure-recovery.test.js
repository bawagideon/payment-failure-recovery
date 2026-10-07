const test = require('node:test');
const assert = require('node:assert');
const { PaymentFailureRecovery } = require('../src/index.js');

test('PaymentFailureRecovery: intercepts 3DS timeout and drafts SMS', () => {
  const engine = new PaymentFailureRecovery();
  const res = engine.handleDecline({
    orderId: 'ord_918',
    amount: 650,
    customerPhone: '+14155552671',
    declineCode: '3ds_timeout'
  });
  assert.strictEqual(res.action, 'RESEND_3DS_LINK');
  assert.ok(res.smsPayload.text.includes('3D Secure'));
  assert.ok(res.smsPayload.text.includes('https://pay.store.com/rescue/'));
});
