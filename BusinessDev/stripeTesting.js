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
    //     cardData: {
    //         number: '4000056655665556',
    //         exp_month: 10,
    //         exp_year: 2021,
    //         cvc: '314',
    //         currency: 'usd',
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

    // const data = await FirebaseFunctions.call('updateStripeCustomerPaymentInformtion', {
    //     customerID: 'er2wtQa4RhaxhVTjKvqG8ya3B1l2',
    //     cardData: {
    //         number: '4242424242424242',
    //         exp_month: 10,
    //         exp_year: 2021,
    //         cvc: '314',
    //         currency: 'usd',
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

    // const data = await FirebaseFunctions.call('retrieveConnectAccountBalance', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    // const data = await FirebaseFunctions.call('retrieveConnectAccountTransactionHistory', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    // const data = await FirebaseFunctions.call('retrieveConnectAccountPayoutHistory', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    // const data = await FirebaseFunctions.call('SetConnectAccountPayoutSchedule', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
    //     interval: 'w',
    //     weekly_anchor: 'monday'
    // });

    // const data = await FirebaseFunctions.call('retrieveConnectAccountTransactionStatistics', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    // const data = await FirebaseFunctions.call('retrieveConnectAccountRefundStatistics', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    // const data = await FirebaseFunctions.call('retrieveConnectAccountStatistics', {
    //     businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
    // });

    console.log(data);
}

