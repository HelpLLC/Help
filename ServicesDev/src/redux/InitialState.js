import images from 'config/images/images';
//This will be the initial state of the redux persist model. This should only be for test purposes
//and on release, will only contain the developer accounts
export default InitialState = {



    //This array contains the users that are providers
    providers: [
        //This is the provider dev account
        {
            //The ID for the current provider
            providerID: 1,
            //The phone number for this account (used as account login)
            username: 'ZyadDevProvide',

            //The name of the company for this provider
            companyName: 'Zyad Yardwork',

            //The bio for this company
            companyDescription: 'My lawn mowing company can do any kind of service from tall grass to ' +
                'snipping & pulling weeds!',

            //All the product ID's that are associated with the product
            serviceIDs: [
                0,
                1,
                2
            ]
        }
    ],

    //This array contains the users that are requesters
    requesters: [
        //This is the requester dev account
        {
            //The username for this account
            username: 'ZyadDevRequest',

            //The ID of this requester
            requesterID: -1
        },
    ],

    //The array of products that are currently available in the market
    products: [
        {
            //The information for each product
            serviceID: 0,
            offeredBy: 1,
            serviceTitle: 'Lawn Mowing',
            serviceDescription: 'For a very small price, I will mow your lawn and make sure ' +
                'that it looks good as new!',
            pricing: '$10 per hour',
            imageSource: images.LawnMowing,

            //An object that contains two different arrays, one containing the completed requests,
            //and one completed the current requests
            requests: {

                //The array containing the completed requests
                completedRequests: [

                    //Each completed request will have a date and a customer name
                    {
                        dateRequested: '3/10/19',
                        dateCompleted: '3/12/19',
                        requesterID: 0
                    },
                    {
                        dateRequested: '3/10/19',
                        dateCompleted: '3/12/19',
                        requesterID: 0
                    },
                    {
                        dateRequested: '3/10/19',
                        dateCompleted: '3/12/19',
                        requesterID: 0
                    },
                ],

                //The array containing the current requests for the product
                currentRequests: [

                    //Each request will contain the ID of the requester, along with the date
                    //is was requested
                    {
                        requesterID: 0,
                        dateRequested: '3/13/19',
                    }
                ]
            }
        },

        {
            //The information for each product
            serviceID: 1,
            offeredBy: 1,
            serviceTitle: 'Pressure Washing',
            serviceDescription: 'For the best pressure washing in the business, contact me',
            pricing: '$20 per hour',
            imageSource: images.PressureWashing,

            //An object that contains two different arrays, one containing the completed requests,
            //and one completed the current requests
            requests: {

                //The array containing the completed requests
                completedRequests: [

                ],

                //The array containing the current requests for the product
                //The array containing the current requests for the product
                currentRequests: [

                ]
            }
        },

        {
            //The information for each product
            serviceID: 2,
            offeredBy: 1,
            serviceTitle: 'Leave Raking',
            serviceDescription: 'I\'m the best leave raker in town!!!!',
            pricing: '$10 per hour',
            imageSource: images.LeaveRaking,

            //An object that contains two different arrays, one containing the completed requests,
            //and one completed the current requests
            requests: {

                //The array containing the completed requests
                completedRequests: [

                ],

                //The array containing the current requests for the product
                currentRequests: [

                ]
            }
        }
    ],

    //This array will contain all of the message arrays between all of the users
    messages: [
        {
            conversationIDs: [-1, 1],
            conversationMessages: [
                {
                    _id: 1,
                    text: "When would you like your lawn mowed?",
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                    }
                },
                {
                    _id: 2,
                    text: "As soon as possible please",
                    createdAt: new Date(),
                    user: {
                        _id: -1
                    }
                },
                {
                    _id: 3,
                    text: "Alright, I'll be there soon",
                    createdAt: new Date(),
                    user: {
                        _id: 1
                    }
                }
            ]
        }
    ],
}