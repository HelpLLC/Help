//This component will render a 2 column list of services using the narrowServiceCard. The only prop it will take is the array of
//services. Then it just uses that render the 2 column list.
import React, { Component } from "react";
import { View, Dimensions, FlatList } from "react-native";
import NarrowServiceCard from "./NarrowServiceCard";
import PropTypes from "prop-types";
import FirebaseFunctions from "config/FirebaseFunctions";

//Defines the class
class NarrowServiceCardList extends Component {
  //This function goes to a screen of a specific service based on its index within the services array
  goToServiceScreen(index) {
    //If an exclusive onPress function is called, that will be called instead
    if (this.props.onPress) {
      const { services } = this.props;
      this.props.onPress(services[index]);
    } else {
      const { services, requesterID } = this.props;
      this.props.navigation.push("RequesterServiceScreen", {
        productID: services[index].serviceID,
        requesterID,
        providerID: services[index].offeredByID
      });
    }
  }

  render() {
    //Fetches the array of services from the props along with the requester object that is signed in
    const { services } = this.props;
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={services}
        numColumns={2}
        maxToRenderPerBatch={2}
        initialNumToRender={2}
        windowSize={3}
        keyExtractor={(item, index) => item.serviceID + index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: "row" }}>
            {//Adds a space before the first service if there is only one service because it otherwise has justify
            //content of flex start
            services.length === 1 ? (
              <View style={{ width: Dimensions.get("window").width * 0.03 }} />
            ) : (
              <View></View>
            )}
            <NarrowServiceCard
              serviceTitle={item.serviceTitle}
              price={this.props.dateSelected ? item.dateSelected : item.pricing}
              imageFunction={async () => {
                //Passes in the function to retrieve the image of this product
                return await FirebaseFunctions.call("getProductImageByID", {
                  ID: item.serviceID
                });
              }}
              totalReviews={item.totalReviews}
              averageRating={item.averageRating}
              numCurrentRequests={0}
              //Passes all of the necessary props to the actual screen that contains
              //more information about the service
              onPress={() => {
                this.goToServiceScreen(index);
              }}
            />
            {//Adds a space in between each column
            index % 2 === 0 && services.length > 1 ? (
              <View style={{ width: Dimensions.get("window").width * 0.03 }} />
            ) : (
              <View></View>
            )}
          </View>
        )}
      />
    );
  }
}

//Sets the PropTypes for this component. There will be and it is required. "services" which will be of type array & requester object
//who will be the one requesting the services.  It will also take in an optional boolean to display the date requester of a product
//instead of a price (used in RequesterOrderHistoryScreen)
NarrowServiceCardList.propTypes = {
  services: PropTypes.array.isRequired,
  requesterID: PropTypes.string.isRequired,
  dateRequested: PropTypes.bool,
  onPress: PropTypes.func
};

//Exports the module
export default NarrowServiceCardList;
