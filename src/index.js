// Payment Failure & 3D Secure Recovery Engine
class PaymentFailureRecovery {
  constructor(options = {}) {
    this.declinePlaybooks = {
      'card_declined': { action: 'REQUEST_ALTERNATIVE_CARD', message: 'Your bank declined this card. Click to use a backup payment method.' },
      'insufficient_funds': { action: 'SPLIT_PAYMENT_OR_KLARNA', message: 'Payment incomplete. Select Klarna or PayPal 4-installment checkout.' },
      '3ds_timeout': { action: 'RESEND_3DS_LINK', message: '3D Secure authentication timed out. Click to re-verify safely.' },
      'expired_card': { action: 'UPDATE_CARD_EXPIRY', message: 'Your card on file is expired. Click to update expiry in 10s.' }
    };
  }

  handleDecline(event) {
    const { orderId, amount, customerPhone, declineCode } = event;
    const playbook = this.declinePlaybooks[declineCode] || { action: 'GENERIC_BACKUP_LINK', message: 'Payment did not go through. Click here to complete order.' };

    const backupPaymentUrl = `https://pay.store.com/rescue/${orderId}?token=` + Math.random().toString(36).substr(2, 8);

    return {
      orderId,
      amount,
      declineCode,
      action: playbook.action,
      smsPayload: {
        to: customerPhone,
        text: `${playbook.message} ${backupPaymentUrl}`
      },
      status: 'RESCUE_LINK_DISPATCHED',
      dispatchedAt: new Date().toISOString()
    };
  }
}

module.exports = { PaymentFailureRecovery };
