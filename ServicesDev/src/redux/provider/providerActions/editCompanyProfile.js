//This action will edit the given provider's company details with new info
import actionTypes from '../actionTypes';

//The class will take in two parameters; the index of the provider whose company info will be
//changes and an object containing the new account info
export const editCompanyProfile = (providerIndex, companyInfo) => (
    {
        //The type of action so that the reducer knows what to do
        type: actionTypes.EDIT_COMPANY_PROFILE,
        providerIndex,
        companyInfo
    }
);