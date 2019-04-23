//This action will update an existing provider product with a new one
import actionTypes from '../actionTypes';

//The action will take in an index of the provider, the index of the product, and the new information
//The reducer will then use the information to update the product.
export const updateProviderProduct = ( productID, updatedProductInfo) => (
    {
        //The type of action this is
        type: actionTypes.UPDATE_PROVIDER_PRODUCT,

        //returns the parameters to be used by the reducer
        productID,
        updatedProductInfo

    }
)