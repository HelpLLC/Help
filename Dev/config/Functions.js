//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application. Since you
//cannot connect a non-component class with the redux state. All of these functions will have to take
//in parameters containing the data that is being manipulated.

//All methods should be labeled static
export default class Functions {

    //This method will take in an ID of a requester and then search through all of the requesters
    //until it finds the requester with this particular ID
    static getRequesterByID(requesterID, allRequesters) {

        const thisRequester = allRequesters.find((requester) => {
            return requester.requesterID === requesterID;
        });

        return thisRequester;
    }

    //This method will take in an ID of a provider and then search through all providers until in finds 
    //provider with this ID. It then returns the provider object
    static getProviderByID(providerID, allProviders) {

        const thisProvider = allProviders.find((provider) => {
            return provider.providerID === providerID;
        });

        return thisProvider;
    }

    //This method will take in an ID of a service and then search through all the services until it finds
    //the one that matches this ID
    static getServiceByID(serviceID, allServices) {

        const thisService = allServices.find((service) => {
            return service.serviceID === serviceID;
        });

        return thisService;
    }

    //This method will return an array filled with requesters that requested a certain product. It will
    //take in a service and all the requesters and then return only the ones who's ID is present in
    //this product's requests
    static getServiceRequesters(service, allRequesters) {

        let requestersOfThisProduct = [];
        service.requests.currentRequests.forEach((request) => {
            let requesterID = request.requesterID;
            let requester = allRequesters.find((requester) => {
                return requester.requesterID === requesterID;
            })

            requestersOfThisProduct.push(requester);
        });

        return requestersOfThisProduct;
    }

    //This method will return an array of products that is offered by a specifc provider. It will
    //go through all products and only return ones that belong to this provider
    static getProviderProducts(provider, allProducts) {

        const providerProductIDs = provider.serviceIDs;
        const providerProducts = [];

        providerProductIDs.forEach((id) => {
            //Finds the index of the product that is associated with the user and adds it to the array
            //of this user's products
            let providerProduct = allProducts.find((product) => {
                return product.serviceID === id;
            });

            providerProducts.push(providerProduct);
        });

        return providerProducts;
    }
    
    //This method will return true if the service has already been requested by this requester
    static isServiceAlreadyRequested(service, requesterID) {

        //If the value is -1, this means that this requester doesn't have a current request on this service
        const indexOfRequest = service.requests.currentRequests.findIndex((request) => {
            return request.requesterID === requesterID;
        });

        return (indexOfRequest === -1 ? false : true);

    }
}

