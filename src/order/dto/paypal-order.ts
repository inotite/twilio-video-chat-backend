export class PurchaseUnit{
    amount: Amount;
    payee: Payee;
    payment_instruction: PaymentInstruction;
}

export class Amount{
    currency_code: string;
    value: string;
}

export class ApplicationContext {
    brand_name= 'JOIN A ROOM';
    landing_page= 'LOGIN';
    user_action= 'PAY_NOW';
    return_url= 'https://staging.joinaroom.live/main/payment';
    cancel_url= 'https://staging.joinaroom.live/main/';
}

export class OrdersResponse{
    id: string;
    links: Link[];
    status: string;
}

export class Link{
    href: string;
    rel: string;
    method: string;
}

export class PaypalOrder{
    intent= "CAPTURE";
    purchase_units: PurchaseUnit[] = [];
    application_context: ApplicationContext = new ApplicationContext();
}

export class Payee{
    email_address: string;
    merchant_id: string;
}

export class PaymentInstruction{
    disbursement_mode: string;
    platform_fees: PlatformFees[] = [];
}

export class PlatformFees{
    amount: Amount;
}
