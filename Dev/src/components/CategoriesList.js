//This component will render a 2 column list of categories consisting of CategoryCards. The only prop it will take is the array of
//categories. Then it just uses that to render the 2 column list.
import React, { Component } from "react";
import { View, Dimensions, FlatList } from "react-native";
import CategoryCard from "./CategoryCard";
import PropTypes from "prop-types";
import FirebaseFunctions from "config/FirebaseFunctions";

//Defines the class
class CategoriesList extends Component {
  //This function goes to a screen of a specific category
  async goToCategoryScreen(categoryName) {
    const { requester } = this.props;
    const { allProducts } = this.props;
    try {
      this.props.navigation.push("CategoryScreen", {
        categoryName: categoryName,
        requester: requester,
        allProducts: allProducts
      });
    } catch (error) {
      this.setState({ isLoading: false, isErrorVisible: true });
      FirebaseFunctions.logIssue(error, {
        screen: "Categories Screen",
        userID: "r-" + requester.requesterID
      });
    }
  }

  render() {
    //Fetches the array of categories from the props
    const { categories } = this.props;

    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={categories}
        numColumns={2}
        keyExtractor={item => item.categoryName}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              flexDirection: "row"
            }}
          >
            {//Adds a space before the first service if there is only one service because it otherwise has justify
            //content of flex start
            categories.length === 1 ? (
              <View style={{ width: Dimensions.get("window").width * 0.03 }} />
            ) : (
              <View></View>
            )}
            <CategoryCard
              categoryTitle={item.categoryName}
              imageFunction={async () => {
                //Passes in the function to retrieve the image of this category
                return await FirebaseFunctions.getCategoryImageByID(
                  item.imageName
                );
              }}
              numCurrentRequests={0}
              //Passes all of the necessary props to the actual screen that contains
              //more information about the service
              onPress={async () => {
                await this.goToCategoryScreen(item.categoryName);
              }}
            />
            {//Adds a space in between each column
            index % 2 === 0 && categories.length > 1 ? (
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

//Sets the PropTypes for this component. There will be and it is required. "categories" which will be of type array & requester object
//who will be the one requesting the categories
CategoriesList.propTypes = {
  categories: PropTypes.array.isRequired,
  requester: PropTypes.object.isRequired
};

//Exports the module
export default CategoriesList;
