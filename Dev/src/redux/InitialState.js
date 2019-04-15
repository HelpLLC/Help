import images from 'config/images/images';
//This will be the initial state of the redux persist model. This should only be for test purposes
//and on release, will only contain the developer accounts
export default InitialState = {

    //This array contains the users that are providers
    providers: [
        //This is the provider dev account
        {
            //The phone number for this account (used as account login)
            username: 'ZyadDevProvide',

            //The name of the company for this provider
            companyName: 'Zyad Yardwork',

            //The bio for this company
            companyDescription: 'My lawn mowing company can do any kind of service from tall grass to ' +
                'snipping & pulling weeds!',

            //The array of products that this business offers
            products: [
                {
                    //The information for each product
                    serviceTitle: 'Lawn Mowing',
                    serviceDescription: 'For a very small price, I will mow your lawn and make sure ' +
                        'that it looks good as new!',
                    pricing: '$10 per hour',
                    imageSource: images.LawnMowing
                },

                {
                    //The information for each product
                    serviceTitle: 'Pressure Washing',
                    serviceDescription: 'For the best pressure washing in the business, contact me',
                    pricing: '$20 per hour',
                    imageSource: images.PressureWashing
                },

                {
                    //The information for each product
                    serviceTitle: 'Leave Raking',
                    serviceDescription: 'I\'m the best leave raker in town!!!!',
                    pricing: '$10 per hour',
                    imageSource: images.LeaveRaking
                }
            ]
        }
    ],

    //This array contains the users that are requesters
    requesters: [
        //This is the requester dev account
        {
            //The phone number for this account (used as account login)
            username: 'ZyadDevRequest',
        },
    ]



}