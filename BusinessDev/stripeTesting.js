import FirebaseFunctions from './config/FirebaseFunctions';
export default () => {
    main();
    return null;
};

async function main(){
    // const data = await FirebaseFunctions.call('createStripeConnectAccountForBusiness', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
    //     tos_acceptance: {
    //         date: 1601068623,
    //         ip: "50.54.137.178",
    //         user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15"
    //     },
    //     businessProfile: {
    //         name: 'Help',
    //         url: 'https://helptechnologies.net'
    //     },
    //     paymentToken: 'tok_visa_debit'
    // });

    // const data = await FirebaseFunctions.call('createStripeConnectAccountForBusiness', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
    //     tos_acceptance: {
    //         date: 1601068623,
    //         ip: "50.54.137.178",
    //         user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15"
    //     },
    //     businessProfile: {
    //         name: 'Help',
    //         url: 'https://helptechnologies.net'
    //     },
    //     checkingAccount: {
    //         country: 'US',
    //         currency: 'usd',
    //         account_number: '000123456789',
    //         routing_number: '110000000'
    //     }
    // });

    // const data = await FirebaseFunctions.call('checkStripeOnboardingByStripeID', {
    //     stripeID: 'acct_1GXxmdG1nufLloZ5'
    // });

    // const data = await FirebaseFunctions.call('deleteStripeConnectAccount', {
    //     accountID: 'acct_1GXxmdG1nufLloZ5'
    // });

    // const data = await FirebaseFunctions.call('updateStripeConnectAccountPayment', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
    //     checkingAccount: {
    //         country: 'US',
    //         currency: 'usd',
    //         account_number: '000123456789',
    //         routing_number: '110000000'
    //     }
    // });

    // const data = await FirebaseFunctions.call('deleteBusinessPaymentInformation', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    // const data = await FirebaseFunctions.call('createStripeCustomerPaymentInformtion', {
    //     customerID: 'er2wtQa4RhaxhVTjKvqG8ya3B1l2',
    //     checkingAccount: {
    //         country: 'US',
    //         currency: 'usd',
    //         account_number: '000123456789',
    //         routing_number: '110000000'
    //     }
    // });

    // const data = await FirebaseFunctions.call('createStripeCustomerPaymentInformtion', {
    //     customerID: 'er2wtQa4RhaxhVTjKvqG8ya3B1l2',
    //     paymentToken: 'tok_visa_debit'
    // });

    // const data = await FirebaseFunctions.call('updateStripeCustomerPaymentInformtion', {
    //     customerID: 'er2wtQa4RhaxhVTjKvqG8ya3B1l2',
    //     checkingAccount: {
    //         country: 'US',
    //         currency: 'usd',
    //         account_number: '000123456789',
    //         routing_number: '110000000'
    //     }
    // });

    // const data = await FirebaseFunctions.call('deleteCustomerPaymentInformation', {
    //     customerID: 'er2wtQa4RhaxhVTjKvqG8ya3B1l2'
    // });

    // const data = await FirebaseFunctions.call('chargeCustomerForRequest', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
    //     customerID: 'er2wtQa4RhaxhVTjKvqG8ya3B1l2',
    //     requestID: 'XFBs6bUcD5Af7T166orQ',
    //     billedAmount: 10,
    //     serviceID: 'S0bj90OvpgzjxQDUStYo',
    //     isCardSaved: true
    // });

    console.log(data);
}

